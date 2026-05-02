# Dashboard improvements — done

The migration is complete. Every dynamic piece of the dashboard is a
Preact component reading directly from signals; no legacy state
object, no mirror layer, no `window` exposes for inline `onclick`
markup, no HTML-string injectors. The only imperative code left is
the canvas drawing inside `features/timeline.ts`, which is wrapped by
a Preact `<Timeline />` component that mounts it in `useEffect`.

## Final shape

```
src/dashboard/
├── main.tsx                      Boot: snapshot detection, Preact mount
├── app.tsx                       Top-level layout
├── styles.css                    Single CSS file (Vite inlines it)
├── event-log-dashboard.html      Vite entry (just <div id="root">)
│
├── components/                   All Preact, all reactive on signals
│   ├── Header.tsx                Title, view toggle, search, controls,
│   │                             export menu, status dot (reads
│   │                             connectionStatus + paused signals)
│   ├── Sidebar.tsx               EventTypes / CacheOps / Sessions / Imports / Shortcuts
│   ├── EventList.tsx             Cards + session separators + empty state
│   ├── EventCard.tsx             Header + tabs (uses <JsonView /> + <DiffView />)
│   ├── JsonView.tsx              Recursive collapsible JSON tree
│   ├── DiffView.tsx              Side-by-side cache diff with row-level expand
│   ├── CacheView.tsx             Toolbar + edit mode + entries
│   ├── Timeline.tsx              JSX shell + useEffect drives the canvas engine
│   ├── TimelineDrawer.tsx        Slide-in event detail (uses JsonView/DiffView)
│   ├── Modal.tsx                 Save + Explain modes driven by signal
│   ├── Toast.tsx                 Toast queue
│   ├── DropOverlay.tsx           Drag-drop import handler
│   ├── PausedBanner.tsx          Banner when paused
│   └── SnapshotBanner.tsx        Banner only in exported HTML snapshots
│
├── store/                        Reactive state + IO façades
│   ├── signals.ts                Every piece of dashboard state.
│   │                             events / view / paused / filters /
│   │                             hidden sets / modal / toasts /
│   │                             selectedTimelineEvent /
│   │                             connectionStatus / typeCounts /
│   │                             sessionMap / cacheMap / imports
│   │                             (last four computed from events.value)
│   ├── modal.ts                  openSaveModal / openExplanationModal
│   ├── cache.ts                  cacheInfo / cacheEntries / editMode + IO
│   └── actions.ts                Re-exports features/actions for components
│
├── features/                     Imperative pieces — all signals-driven
│   ├── runtime.ts                ~50 lines: bridges + boot wiring
│   ├── actions.ts                Every sidebar/header action on signals
│   ├── event-stream.ts           SSE + on-load recovery + dedup
│   ├── reconstruction.ts         Cache backfill + telemetry-from-cache
│   ├── snapshot-export.ts        Self-contained HTML snapshot generator
│   ├── keyboard.ts               Global shortcuts
│   └── timeline.ts               Canvas engine (mounted by Timeline.tsx)
│
└── lib/                          Pure helpers, unit-tested with Vitest
    ├── format.ts                 escapeHtml, formatGapDuration
    ├── lcs-diff.ts               LCS line diff
    ├── colors.ts                 TYPE_COLORS + getColor (hash fallback)
    ├── event-helpers.ts          formatDelta, getPreviousEventTime, cacheKeyOf
    ├── filters.ts                matchesFilters reading signals
    └── cache-diff.ts             Pure diff data (typed rows, no HTML)
```

## Tests

- **Vitest**: 40 specs across `format`, `lcs-diff`, `colors`,
  `cache-diff`, and computed signals (`typeCounts`, `sessionMap`,
  `cacheMap`, `imports`).
- **Playwright**: 40 E2E tests covering every user-facing surface —
  events / search / expand / filters / timeline / cache / cache-diff /
  cache edit-mode / export+import / paused buffer / snapshot
  generation / snapshot interactivity / snapshot explanation modal /
  reconstruction.
- **Typecheck**: `tsc --noEmit` against both the root tsconfig and
  the dashboard tsconfig — both clean.

## Build

`pnpm build` → `dist/event-log-dashboard.html`, 145 KB / 41 KB
gzip, single self-contained file.

## Items not done (with rationale)

- **Shared `<Icon />` component.** The hand-authored SVGs across the
  codebase use slightly different stroke widths, viewBoxes, and
  conventions. Normalizing them into one component risks subtle visual
  regressions for ~2 KB savings in the bundle. Skipped intentionally;
  open for a future cosmetic pass that can be paired with screenshot
  tests.

## Items deferred to the server-side codebase

- `/cache/entries` returns every entry's content inline. For projects
  with megabyte-scale telemetry caches this is a noticeable initial
  payload — pagination or lazy-load on entry click would help first
  paint. Out of scope for the dashboard refactor.

## Verifying

```bash
cd libs/sb-utils
pnpm install
pnpm build              # tsdown + vite, single dist/event-log-dashboard.html
pnpm typecheck          # both tsconfigs
pnpm test --run         # 40 Vitest specs
pnpm test:e2e           # 40 Playwright specs (~9s, auto-builds via pretest)
```

Manual smoke against a real Storybook project:

```bash
node dist/bin.mjs event-logger --port 6017 --project-root /path/to/storybook
# In the project:
STORYBOOK_TELEMETRY_URL=http://localhost:6017/event-log yarn storybook
```
