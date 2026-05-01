# Dashboard improvements — follow-up work

The migration from a single 3,800-line inline `<script>` to a Preact +
Vite + plugin-singlefile codebase is feature-complete and exercised by
35 Playwright E2E tests. This document lists what's intentionally left
imperative and the suggested order for finishing the conversion. Each
item is mergeable on its own; the E2E suite is the safety net.

## File map (current)

```
src/dashboard/
├── main.tsx                  Preact bootstrap, hoists shell into <body>, imports runtime
├── app.tsx                   Top-level layout composing all components
├── styles.css                Single CSS file (Vite inlines it)
├── event-log-dashboard.html  Vite entry — empty shell + <div id="root">
├── components/
│   ├── Header.tsx            Title, view toggle, search, controls, export menu, paused banner
│   ├── Sidebar.tsx           EventTypes, CacheOps, Sessions, Imports, Shortcuts (all reactive)
│   ├── EventList.tsx         Event cards + session separators + empty state
│   ├── EventCard.tsx         Card header reactive; tab content via dangerouslySetInnerHTML
│   ├── Modal.tsx             Save + Explain modal driven by signal
│   ├── Toast.tsx             Toast queue
│   ├── DropOverlay.tsx       Drag-drop import handler
│   ├── PausedBanner.tsx      Banner when paused
│   ├── TimelineView.tsx      Static shell — Timeline imperative renders into it
│   └── CacheViewShell.tsx    Static shell — CacheView imperative renders into it
├── store/
│   ├── signals.ts            All reactive state (events, view, paused, filters, modal, toasts, imports, computed counts)
│   ├── legacy-mirror.ts      Copies imperative `state` into signals on rAF
│   ├── modal.ts              openSaveModal / openExplanationModal façade backed by `modal` signal
│   ├── actions.ts            Façade around action functions exposed via window bridge
│   └── renderers.ts          Façade around legacy HTML-string renderers (renderJson, renderCacheDiff, …)
├── lib/                      Pure helpers — unit-tested with Vitest
│   ├── format.ts             escapeHtml, formatGapDuration
│   ├── lcs-diff.ts           LCS line diff for cache write rendering
│   ├── colors.ts             TYPE_COLORS table + getColor (hash fallback)
│   ├── json-render.ts        renderJson + toggleJson (HTML-string output)
│   └── cache-diff.ts         deepDiffLeaves, renderCacheDiff, side-by-side renderer
└── features/
    ├── runtime.ts            Imperative orchestrator: state, DOM refs, SSE, ingestion,
    │                         action bridge, modal/snapshot wiring, keyboard shortcuts
    ├── timeline.ts           setupTimeline() — canvas pan/zoom + drawer
    ├── cache-view.ts         setupCacheView() — toolbar + entries + diff/edit
    └── reconstruction.ts     setupReconstruction() — telemetry-from-cache + backfill
```

The `legacy-app.ts` file is gone. What remains imperative
(`features/runtime.ts`, `features/timeline.ts`, `features/cache-view.ts`)
is split into focused modules with clear public APIs and is well under the
size of any single legacy IIFE.

## Improvements

### Native Preact for imperative IIFEs

These three modules are still imperative-render-into-DOM-by-ID. Each is a
candidate for a follow-up PR that replaces it with a native Preact
component, freeing the corresponding renderer bridge entry.

1. **`components/EventCard` tab content** — currently the JSON tree and
   cache diff are rendered as HTML strings via `renderJson` /
   `renderCacheDiff` and injected with `dangerouslySetInnerHTML`. Build
   a recursive `<JsonView />` Preact component (collapsible nodes via
   `useState`) and a `<DiffView />` component that takes prev/next.
   Outcome: delete `lib/json-render.ts` `toggleJson`, drop the
   `window.toggleJson` expose, drop `store/renderers.ts`.

2. **`features/cache-view.ts` → `components/CacheView.tsx`**
   ~370 lines, mostly toolbar + entries + diff. The toolbar maps cleanly
   to a small Preact subtree; the entries are a list of cards (also
   well-suited to Preact). Edit-mode state moves from a closure variable
   into a `cacheEditMode` signal. Localstorage persistence stays in the
   signal's effect.

3. **`features/timeline.ts` → `components/Timeline.tsx`**
   The largest follow-up at ~1,400 lines. Strategy:
   - Move pure pan/zoom math (`srcToDisp`, `dispToSrc`, segment building,
     gap collapsing) into `lib/timeline-math.ts` — testable.
   - The canvas drawing stays imperative, wrapped in
     `useEffect(() => render())` reacting to signal changes.
   - The drawer becomes a Preact subtree.
   - Pan/zoom event handlers become refs/effects.
   - Snapshot export (`exportHtmlSnapshot`) moves to
     `features/snapshot-export.ts` — it doesn't really belong on
     Timeline conceptually.

### Other carve-outs from `features/runtime.ts`

`runtime.ts` is the imperative orchestrator. It can keep shrinking:

4. **SSE + ingestion** → `features/event-stream.ts` exposing
   `setupEventStream(state, helpers)`. Wraps `connect`,
   `recoverMissedEvents`, `loadExisting`, the SSE handler, and the
   `updateTypeCounts/Session/Cache/ImportMap` helpers. Once Preact owns
   the rendering reactively, these helpers can write directly to signals
   instead of the legacy `state` object.

5. **Action functions** → `features/actions.ts`. The pile of
   `setFilter`, `toggleHidden*`, `deleteEventsBy*`, `deleteAllX*`
   functions live in `runtime.ts` today and are exposed via
   `window.__sbDashActions`. Move them to their own module and have the
   `actions` façade in `store/actions.ts` import them directly. Drop
   the window bridge.

6. **Snapshot export** → `features/snapshot-export.ts`. The 200+ line
   `exportHtmlSnapshot` lives inside the Timeline IIFE for historical
   reasons; it has nothing to do with the timeline. Pull it out.

7. **Keyboard shortcuts** → `features/keyboard.ts`. Single `keydown`
   listener that dispatches based on context. Already written
   imperatively but isolated, ~50 lines.

8. **Snapshot-mode bootstrap IIFE** → fold into `main.tsx`. The
   IIFE in `runtime.ts` reads `window.__SNAPSHOT__*` and binds the
   "view explanation" button. Move the explanation button binding into
   the snapshot banner Preact component (next item).

9. **Snapshot banner** → `components/SnapshotBanner.tsx`. Currently
   injected as static HTML by `exportHtmlSnapshot`. Build a Preact
   component that renders when `window.__SNAPSHOT__ === true`, reading
   metadata from `window.__SNAPSHOT_META__`. Drop the inline HTML
   injection in the snapshot exporter.

### Drop the legacy mirror layer

Once everything writes directly to signals (steps 1–6), the
`store/legacy-mirror.ts` file becomes unused: there's no imperative
`state` object to mirror anymore. Delete it, delete the
`scheduleMirror(state)` calls, drop the `state` object itself. The
signals ARE the state.

### Drop the inline `onclick` attributes

`renderJson` emits `onclick="toggleJson(this)"` because the buttons
were rendered as HTML strings. After native Preact JSON view, no
`window.toggleJson` is needed. Same for `copyEvent` / `copyEventCurl`
once event cards no longer build inline `<button onclick="...">`
markup. After this lands, delete the window-expose block at the top of
`features/runtime.ts`.

### Type the dashboard

Both `features/runtime.ts` and `features/timeline.ts` start with
`// @ts-nocheck`. Stripping that out and typing the surface (the legacy
state shape, the Timeline state object `st`, the imperative IIFE locals)
would catch a class of refactor bugs at edit time. The pure modules in
`lib/` and `store/` are already typed; ts-checking them is enabled.

### Tests

- **Unit**: add Vitest specs for `lib/cache-diff` (pairAdjacentChanges,
  buildSxsRows), `lib/colors` (deterministic hash), `store/signals`
  computed (typeCounts, sessionMap, cacheMap from a fixture event list).
- **E2E**: cover paused-while-buffering count badge, Cmd+F focusing
  search, snapshot's explanation modal, the cache-view edit mode
  (toggle, save, delete) — currently lightly covered.

### Server-side

These aren't in the migration scope but are noted for completeness:

- The cache `/cache/entries` response has every entry's `content`
  inline; for projects with megabyte-scale telemetry caches that's a
  noticeable initial payload. Pagination or lazy-load on entry click
  would make first paint faster.
- The dashboard polls `/cache/info` once on load + every cache event;
  the polled response is small but adds up under heavy cache churn.
  Consider a single SSE event for cache info changes.

### Build / tooling

- `pnpm test:e2e` currently rebuilds `dist/` only when explicitly
  invoked; surprising failure mode if you forget to rebuild. Add
  `"pretest:e2e": "pnpm build:dashboard"` to ensure tests always run
  against the latest build.
- `vite-plugin-singlefile` produces ~150 KB / 40 KB gzip; that's fine
  for a debugging tool but if size matters later, replace the
  hand-written SVG icons with a tiny shared icon component (each icon
  is duplicated 5–8x in the markup today).
