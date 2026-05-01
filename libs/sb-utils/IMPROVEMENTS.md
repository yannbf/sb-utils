# Dashboard improvements — remaining work

Most of the migration is done. The legacy single-file `<script>` is
gone, signals are the only source of truth, and almost every renderer
is a Preact component. The two remaining imperative pieces are the
**Timeline canvas engine** and the **Timeline drawer's HTML-string
renderers**, both of which boil down to one follow-up item.

## Current file map

```
src/dashboard/
├── main.tsx                      Boot: snapshot detection, Preact mount, hoist into body
├── app.tsx                       Top-level layout
├── styles.css                    Single CSS file (Vite inlines it)
├── event-log-dashboard.html      Vite entry — empty shell + <div id="root">
│
├── components/                   Native Preact, all reactive on signals
│   ├── Header.tsx                Title, view toggle, search, controls, export menu
│   ├── Sidebar.tsx               EventTypes / CacheOps / Sessions / Imports / Shortcuts
│   ├── EventList.tsx             Cards + session separators + empty state
│   ├── EventCard.tsx             Header + tabs (uses <JsonView /> + <DiffView />)
│   ├── JsonView.tsx              Recursive collapsible JSON tree
│   ├── DiffView.tsx              Side-by-side cache-write diff with row-level expand
│   ├── CacheView.tsx             Toolbar + edit mode + entries list with diff
│   ├── Timeline.tsx              JSX shell + useEffect drives the imperative engine
│   ├── Modal.tsx                 Save + Explain modes driven by signal
│   ├── Toast.tsx                 Toast queue
│   ├── DropOverlay.tsx           Drag-drop import handler
│   ├── PausedBanner.tsx          Banner when paused
│   └── SnapshotBanner.tsx        Banner only in exported HTML snapshots
│
├── store/                        Reactive state + IO façades
│   ├── signals.ts                events / view / paused / filters / hidden sets / modal
│   │                             / toasts / typeCounts / sessionMap / cacheMap / imports
│   │                             (last four are computed from events.value)
│   ├── modal.ts                  openSaveModal / openExplanationModal
│   ├── cache.ts                  cacheInfo / cacheEntries / cacheEditMode + fetch/edit
│   └── actions.ts                Re-exports features/actions for components
│
├── features/                     Imperative pieces, focused modules, signal-only
│   ├── runtime.ts                ~80 lines: window onclicks, action bridges,
│   │                             keyboard wiring, setupEventStream, view restore
│   ├── actions.ts                All sidebar/header actions on signals
│   ├── event-stream.ts           SSE + on-load recovery + dedup + status dot
│   ├── reconstruction.ts         Cache backfill + telemetry-from-cache synthesis
│   ├── snapshot-export.ts        Self-contained HTML snapshot generator
│   ├── keyboard.ts               Global shortcuts dispatched through actions
│   └── timeline.ts               Imperative canvas + pan/zoom + drawer engine
│
└── lib/                          Pure helpers, unit-tested with Vitest
    ├── format.ts                 escapeHtml, formatGapDuration
    ├── lcs-diff.ts               LCS line diff
    ├── colors.ts                 TYPE_COLORS + getColor (hash fallback)
    ├── event-helpers.ts          formatDelta, getPreviousEventTime, cacheKeyOf
    ├── filters.ts                matchesFilters reading signals
    ├── cache-diff.ts             Pure diff data (no HTML)
    └── legacy-html.ts            HTML-string renderers used ONLY by Timeline drawer
```

## What's still imperative

### Timeline canvas engine — `features/timeline.ts`

~1,160 lines. The canvas drawing, pan/zoom math, hi-DPI handling,
minimap, drawer event card rendering. Tightly coupled to imperative
DOM manipulation (canvas contexts, pointer events, requestAnimationFrame
batching).

**Status today.** Wrapped by `<Timeline />` in `components/Timeline.tsx`,
which renders the static structure (toolbar, canvases, drawer shell) as
JSX and starts the engine in `useEffect`. The engine reads signal state
via a Proxy. Its public API is published to the `timelineApi` signal so
the runtime + keyboard handler can call `invalidate` / `fitAll` / etc.

**Why this still has `@ts-nocheck`.** ~50 implicit-any `let` declarations
for canvas / context / drawer DOM refs. Annotating each as `: any`
defeats the purpose of removing `@ts-nocheck`; properly typing them
means rewriting parts of the engine.

**Migration target.** Convert the engine into a `useEffect`-driven
Preact component:
- Pure pan/zoom math → `lib/timeline-math.ts` (testable).
- Canvas refs via `useRef`, drawing in an effect that depends on
  events / view-window signals.
- The drawer's tab content becomes JSX using the existing native
  `<JsonView />` + `<DiffView />` components (deletes the imperative
  `buildEventTabs` helper inside the engine).
- Pan/zoom event handlers stay imperative inside the effect (canvas
  doesn't have a clean declarative model for this).

After that lands:
- `lib/legacy-html.ts` deletes itself (the only consumer is the
  drawer's HTML-string content).
- `runtime.ts`'s `window.toggleCard` and `window.__sbToggleJson`
  exposes go away.
- `@ts-nocheck` comes off `features/timeline.ts` (which becomes much
  smaller — most of its body moves into the component).

### Timeline drawer's HTML-string renderers — `lib/legacy-html.ts`

~340 lines. `renderJsonHtml` + `toggleJsonHtml` + `renderCacheDiffHtml`
+ a document-level click handler for the diff "Expand N unchanged lines"
button. Used ONLY by the Timeline drawer's `buildEventTabs`.

**Removal.** Falls out automatically when the Timeline drawer migrates
to JSX (above).

## Smaller follow-ups

1. **Native test coverage for the new Preact components.** Vitest specs
   exist for `lib/format` and `lib/lcs-diff`. Add specs for
   `lib/cache-diff` (`buildCacheDiff` / `pairAdjacentChanges` /
   `buildSxsRows`), `lib/colors` (deterministic hash), and
   `store/signals` (computed `typeCounts` / `sessionMap` / `cacheMap` /
   `imports` from a fixture event list).

2. **More E2E coverage.** Currently 35 tests. Lightly covered:
   paused-while-buffering badge count, Cmd+F focusing search, the
   snapshot's explanation modal, cache-view edit-mode (toggle / save /
   delete a real entry).

3. **`pnpm test:e2e` could pre-build.** Add `"pretest:e2e":
   "pnpm build:dashboard"` so the suite always runs against the latest
   build.

4. **Shared icon component.** Each SVG icon is duplicated 3–8x in the
   markup. A small `<Icon name="…" />` would shrink the bundle a touch
   and centralize aria attributes.

5. **Server-side: `/cache/entries` payload.** Returns every entry's
   `content` inline. For projects with megabyte-scale telemetry caches
   that's a noticeable initial payload — pagination or lazy-load on
   entry click would help first paint.

6. **Status dot reactivity.** `features/event-stream.ts` mutates
   `#statusDot` imperatively (className + title) on connect/disconnect.
   Convert to a `connectionStatus` signal read by `Header`. Tiny —
   leftover from the imperative era.

## How to verify

```bash
cd libs/sb-utils
pnpm install
pnpm build              # tsdown + vite (single dist/event-log-dashboard.html)
pnpm test --run         # 12 Vitest specs
pnpm test:e2e           # 35 Playwright specs (~7s)
pnpm typecheck          # tsc --noEmit, clean (root excludes src/dashboard)
```

Manual smoke against a real Storybook project:

```bash
node dist/bin.mjs event-logger --port 6017 --project-root /path/to/storybook
# then in the project:
STORYBOOK_TELEMETRY_URL=http://localhost:6017/event-log yarn storybook
```

Visit `http://localhost:6017`. The dashboard should:
- Reconstruct existing telemetry from `dev-server/lastEvents` (cards
  carry the "cache" recon badge until a real telemetry event arrives).
- Stop reconstructing the moment a real instrumented event lands; new
  events come in via SSE.
- Filter / search / pause / expand all work reactively (signals).
- `Export → HTML snapshot` produces a self-contained file that opens
  via `file://` and renders the same dashboard with no network calls.
