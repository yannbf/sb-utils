## What this package is

A CLI of Storybook utilities. Two commands:

- `uninstall` — remove Storybook from a project.
- `event-logger` — local HTTP server + dashboard for inspecting
  Storybook telemetry and the on-disk cache. The dashboard is the
  bulk of the codebase.

Distribution: published to npm as `@hipster/sb-utils`. Users invoke
via `npx @hipster/sb-utils <command>`.

## Hard constraints

These are the requirements that drove the architecture. Don't break
them without an explicit user nod:

1. **Single-binary install.** Everything ships through `dist/`. Users
   shouldn't need any extra setup beyond `npx`.
2. **Single-file dashboard.** `dist/event-log-dashboard.html` is one
   self-contained file with all CSS + JS inlined. The server serves
   it whole; the snapshot exporter clones it. No external assets.
3. **Snapshot exports must stay interactive offline.** An exported
   `.html` snapshot opens via `file://` on any machine and must
   render the baked events, support tab switches, and never make
   network calls. The bake stubs `fetch` and `EventSource`.
4. **No dev-machine state leaks into snapshots.** `localStorage` is
   never used. Live preferences live in `sessionStorage`,
   namespaced by the server's `startedAt` so they reset across
   restarts. The session-storage layer is a no-op in snapshot mode.
5. **Cache + telemetry stay independent.** Cache entries surface
   independently from telemetry events. Filters, hide/show, and
   reconstruction toggles are orthogonal.

## Build pipeline

Two parallel toolchains, both in `package.json`:

- **`tsdown`** builds the CLI/server (`bin.ts`, `commands/*`,
  `cache/*`, `utils/*`) → `dist/bin.mjs` + `dist/commands/*.mjs`.
- **`vite` + `vite-plugin-singlefile` + `@preact/preset-vite`** builds
  the dashboard (`src/dashboard/**`) → a single
  `dist/event-log-dashboard.html`.

Scripts:

| Script | What it does |
| --- | --- |
| `pnpm build` | tsdown + vite. Required before E2E. |
| `pnpm build:cli` | tsdown only. |
| `pnpm build:dashboard` | vite only. Faster iteration. |
| `pnpm dev:dashboard` | vite dev server (HMR). Proxies API calls to a long-running CLI. |
| `pnpm dev:cli` | tsdown --watch. Pair with `node dist/bin.mjs event-logger`. |
| `pnpm typecheck` | Two passes — root tsconfig + `src/dashboard/tsconfig.json`. |
| `pnpm test --run` | Vitest. Pure-logic specs in `specs/`. |
| `pnpm test:e2e` | Playwright. End-to-end specs in `e2e/`. Auto-builds via `pretest:e2e`. |

## Source layout

```
src/
├── bin.ts                    # CLI entrypoint (commander)
├── commands/
│   ├── event-logger.ts       # Hono server, SSE, cache wiring
│   └── uninstall.ts
├── cache/                    # Cache module — discovery, watch, IO
│   ├── discover.ts           # resolveCacheLocation, findProjectRoot
│   ├── watch.ts              # fs.watch wrapper. emitColdStart flag for mid-session attach.
│   ├── read.ts / write.ts
│   ├── routes.ts             # Hono routes for /cache/*
│   └── types.ts
├── utils/                    # Shared CLI helpers
└── dashboard/                # The single-file dashboard app (Preact + signals)
    ├── main.tsx              # Boot: snapshot detection + Preact render
    ├── app.tsx               # Top-level layout
    ├── styles.css            # Single CSS file (Vite inlines it)
    ├── event-log-dashboard.html  # Vite entry — just <div id="root">
    ├── tsconfig.json         # JSX/Preact config
    ├── components/           # Reactive Preact components reading signals
    │   ├── Header.tsx, Sidebar.tsx, EventList.tsx, EventCard.tsx
    │   ├── JsonView.tsx, DiffView.tsx, CacheView.tsx
    │   ├── Timeline.tsx + TimelineDrawer.tsx
    │   ├── Modal.tsx, Toast.tsx, DropOverlay.tsx
    │   ├── PausedBanner.tsx, SnapshotBanner.tsx
    ├── store/                # Reactive state + IO façades
    │   ├── signals.ts        # Every signal — events, view, paused, filters, sessionMap, …
    │   ├── modal.ts, cache.ts, actions.ts
    ├── features/             # Imperative pieces — all signals-driven
    │   ├── runtime.ts        # Boot wiring (action bridges, keyboard, prefs restore)
    │   ├── actions.ts        # Setters for sidebar/header (writes signals + sessionStorage)
    │   ├── event-stream.ts   # SSE + on-load /event-log recovery + dedup
    │   ├── reconstruction.ts # Cache backfill + telemetry-from-cache
    │   ├── snapshot-export.ts# Self-contained HTML snapshot generator
    │   ├── keyboard.ts       # Global shortcuts
    │   └── timeline.ts       # Canvas engine (mounted by Timeline.tsx)
    └── lib/                  # Pure helpers, unit-tested with Vitest
        ├── format.ts, lcs-diff.ts, colors.ts
        ├── cache-diff.ts, event-helpers.ts, filters.ts
        ├── timeline-math.ts  # Pure pan/zoom + segment math
        └── session-storage.ts# Session-aware sessionStorage wrapper
```

`specs/` holds pure-logic Vitest specs that don't need a DOM. `e2e/`
holds Playwright tests with per-test event-logger fixtures that
spawn a real CLI process and tear it down.

## Where to make a change

A small decision tree for routine changes — pick the closest match:

| Change | Where |
| --- | --- |
| Add/rename a CLI flag | `src/bin.ts` (option declaration) + `src/commands/event-logger.ts` (consume it) |
| New HTTP endpoint | `src/commands/event-logger.ts` (Hono `app.get/post`) — for cache routes, `src/cache/routes.ts` |
| Cache discovery / watching behavior | `src/cache/discover.ts` (resolution) or `src/cache/watch.ts` (events). Note the `emitColdStart` flag for mid-session attach. |
| New piece of dashboard state | Add a `signal` in `src/dashboard/store/signals.ts`. If derived, prefer `computed`. |
| User-triggered behavior (toggle, filter, click) | Action in `src/dashboard/features/actions.ts`, called from a component via `actions().<name>()`. |
| Persisted preference | Wrap with `readPref` / `writePref` from `src/dashboard/lib/session-storage.ts`. Never use `localStorage`. |
| New visible UI | Preact component in `src/dashboard/components/`, reading signals directly. |
| New filter rule | `src/dashboard/lib/filters.ts` (`matchesFilters`). |
| New diff / format helper | `src/dashboard/lib/` — must be pure, importable from a Vitest spec without a DOM. |
| Timeline canvas math | `src/dashboard/lib/timeline-math.ts` (pure) — wire into `src/dashboard/features/timeline.ts`. |
| Snapshot export bake | `src/dashboard/features/snapshot-export.ts`. Bake new state via `window.__SNAPSHOT_*__` and stub the matching server endpoint. |
| Snapshot bootstrap restore | `src/dashboard/features/runtime.ts`'s snapshot branch. |
| Styling | `src/dashboard/styles.css` (single file, Vite inlines it). |
| Pure-logic test | `specs/dashboard.<topic>.spec.ts` — no jsdom needed. |
| User-flow test | `e2e/<topic>.e2e.ts` — uses the `eventLogger` / `eventLoggerWithCache` fixtures from `e2e/fixtures.ts`. |

## Patterns to follow

### State

Everything reactive lives in `store/signals.ts`. Components read
`signal.value` inside their render function and Preact's signal
integration auto-subscribes. Never expose mutators on signals — go
through an action in `features/actions.ts`.

### Snapshot vs live

Always check `window.__SNAPSHOT__` (or the `isSnapshot` const in
runtime.ts) when behavior should differ between the live dashboard
and the exported HTML. Snapshot mode:

- Stubs `fetch` and `EventSource` — assume no network.
- `sessionStorage` writes are no-ops (so the viewer's machine can't
  bleed prefs).
- Reads from baked globals: `__SNAPSHOT_EVENTS__`,
  `__SNAPSHOT_CACHE_ENTRIES__`, `__SNAPSHOT_CACHE_INFO__`,
  `__SNAPSHOT_STARTED_AT__`, `__SNAPSHOT_PREFS__`,
  `__SNAPSHOT_REAL_TELEMETRY_DETECTED__`, `__SNAPSHOT_META__`.

When you add a new piece of state that should be preserved in
snapshots, bake it in `snapshot-export.ts` AND restore it in
`runtime.ts`'s snapshot branch.

### Cache toggles + staleness

Three orthogonal toggles in the gear popover:

1. `cacheAllHidden` — eye on "All operations" row. Hides cache from
   the dashboard list (and timeline canvas).
2. `showStaleCache` — gear menu. Pre-existing cache entries (mtime <
   `serverStartedAt`) are filtered at ingestion (`ingestSyntheticCacheCreate`)
   and via `matchesFilters` for safety. Off by default.
3. `reconstructFromCache` — gear menu. Synthesizes telemetry events
   from `dev-server/lastEvents`. Off by default. Per-event staleness
   gate inside `reconstructTelemetryFromCacheWriteInner` mirrors the
   `showStaleCache` rule — recent only unless stale toggle is also on.

Mid-session cache discovery (storybook creates the cache after
event-logger started) emits cold-start `cache:write` events from the
watcher with `emitColdStart: true` so the user sees the contents.

### Tests

When a behavior change touches:

- **Pure logic** → add to `specs/`. Snapshot the input → output via
  `expect(...).toEqual(...)`.
- **A user flow** → add to `e2e/`. Use the fixtures.
- **Both** → both. The pure spec catches regressions cheaply; the
  E2E catches the integration.

After you change pure helpers, also run vitest. After UI changes,
also run E2E. Don't claim done without both green.

## Verification checklist

Before marking work complete:

```sh
pnpm typecheck              # both tsconfigs
pnpm test --run             # vitest
pnpm test:e2e               # playwright (auto-builds)
```

For UI changes, also smoke the dashboard manually:

```sh
node dist/bin.mjs event-logger --port 6017 --project-root /path/to/storybook-project
```

Then in the project: `STORYBOOK_TELEMETRY_URL=http://localhost:6017/event-log yarn storybook`.

## Things to avoid

- **`localStorage`.** Use `lib/session-storage.ts`. localStorage
  bleeds across server restarts and into snapshots.
- **DOM cloning in snapshot export.** The exporter fetches
  `/event-log-dashboard.html` whole and only injects a bootstrap
  `<script>`. Don't go back to clone-the-live-DOM.
- **`window.onclick` markup or HTML-string injectors.** Everything
  reactive is Preact. The only imperative DOM left is the canvas
  engine in `features/timeline.ts`, wrapped in a `useEffect`.
- **Implicit globals.** No more `window.state` / `state.X`. Components
  read signals; actions write signals.
- **Two `fetch` calls when one would do.** Boot is sensitive to the
  browser's per-origin HTTP/1.1 connection cap (~6) — open SSE
  streams hold slots, so blocking boot on extra fetches makes
  multi-tab refresh hang. See the `pagehide` cleanup in
  `features/event-stream.ts`.
