# Dashboard refactor — architectural decisions

This document records the architectural choices made during the migration of
the event-logger dashboard from a monolithic 3,800-line inline-script HTML
file to a modular Preact + Vite codebase. It is meant to give a future
contributor (or future-you) enough context to evaluate the choices and
continue the migration.

## Goals

The user's hard requirements:

1. The dashboard must remain runnable via `npx @hipster/sb-utils event-logger`.
2. The HTML snapshot export must still produce a self-contained,
   fully-interactive HTML file.
3. The codebase must be more maintainable than a single 3,800-line file.

The implicit requirement, surfaced after the first review:

4. New work merged from `main` while the refactor was in flight (telemetry
   reconstruction from the Storybook cache, on-load backfill, the "from
   cache" recon badge, snapshot bake of `realTelemetryDetected`) must be
   preserved at feature parity.

## Decisions

### 1. Build pipeline: Vite + plugin-singlefile, alongside tsdown

**Decision.** Add Vite as a second build step. The CLI/server stays on
`tsdown`; the dashboard is built by Vite + `vite-plugin-singlefile` which
emits a single `dist/event-log-dashboard.html` with all CSS, JS, and assets
inlined. The Hono server reads that one file at startup.

**Why.** "Single self-contained HTML" is a *build output* concern, not a
source-code concern. `vite-plugin-singlefile` is designed for exactly this
shape of problem and is widely used. Coupling source layout to the output
artifact would have meant either (a) keeping the monolithic file or (b)
inventing a fragile post-build inliner. Neither is justifiable when a
focused tool exists.

**Tradeoff.** A second build tool. tsdown runs first (writes CLI bundles
into `dist/`), then Vite (writes the dashboard HTML alongside, with
`emptyOutDir: false` so it doesn't wipe tsdown's output). The order
matters and is enforced by the `build` script chaining.

**Files.** `vite.config.ts`, `tsdown.config.ts`, `package.json` scripts
(`build`, `build:dashboard`, `build:cli`, `dev:dashboard`, `dev:cli`).

### 2. Source layout: `src/dashboard/` with three flat sub-trees

```
src/dashboard/
├── event-log-dashboard.html  Vite entry — minimal shell + <script src="main.tsx">
├── main.tsx                  Bootstrap Preact app, then start the legacy module
├── app.tsx                   JSX shell composing the layout components
├── styles.css                Single global stylesheet
├── components/               Static-shape Preact components rendering the layout
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── EventContainer.tsx
│   ├── TimelineView.tsx
│   ├── CacheViewShell.tsx
│   ├── ModalShell.tsx
│   ├── DropOverlay.tsx
│   └── PausedBanner.tsx
├── lib/                      Pure helpers, dependency-free, unit-tested
│   ├── colors.ts             Type → color (hand-picked + hash fallback)
│   ├── format.ts             escapeHtml, formatGapDuration
│   └── lcs-diff.ts           LCS line diff for cache:write rendering
└── legacy-app.ts             Imperative behavior — to be progressively replaced
```

**Why this shape.** The natural seams in the original script were the
three IIFE pseudo-modules (Timeline, CacheView, top-level event app), the
~30 pure helpers, and the static DOM skeleton. Pulling out (a) the static
skeleton as Preact components, (b) the pure helpers as their own modules,
and (c) leaving the imperative behavior in one named file with clear
module boundaries lets the migration be incremental rather than a single
giant rewrite.

### 3. Hybrid Preact-shell + legacy-imperative for the first migration pass

**Decision.** This PR migrates the *layout shell* (the static DOM
structure of the dashboard — header, sidebar, panels) to Preact JSX
components, but leaves the *dynamic behavior* (event ingestion, rendering
of cards / sessions / cache entries / timeline canvas, modal logic, drag
& drop, snapshot export) in `legacy-app.ts` which is now an importable ES
module rather than an inline `<script>`. The two pieces compose because
the legacy code addresses the DOM by ID, and Preact renders the same IDs
the original `<body>` had.

**Why not full Preact rewrite in one PR.** The original file is ~3,800
lines of imperative behavior with subtle invariants (timeline canvas
math, cache diff rendering, batched rAF rendering, SSE deduplication,
synthetic-index ordering, snapshot mode). Converting that all at once
into reactive Preact components is high-risk; the resulting PR would be
unreviewable. The chosen path:
- gives an immediately shippable, modular, single-file build output;
- preserves all behavior (validated by 35 Playwright E2E tests);
- creates clean seams (`lib/`, `components/`, `legacy-app.ts`) to migrate
  imperative behavior in subsequent PRs without risk of breaking
  functionality.

**Tradeoff.** The legacy module is large and uses `// @ts-nocheck`. That
cost is intentional — strict typing the imperative code as it is would
churn most lines without behavioral changes; once components migrate the
file shrinks naturally.

### 4. Dynamic ES module → window-exposed handlers for inline `onclick`

**Decision.** Four functions used by inline `onclick="…"` attributes
(`toggleCard`, `toggleJson`, `copyEvent`, `copyEventCurl`) are explicitly
attached to `window` at the bottom of `legacy-app.ts`.

**Why.** The original inline `<script>` declared these functions in the
global scope automatically. As an ES module, top-level declarations are
module-scoped, so inline `onclick` cannot resolve them — it would throw
`ReferenceError`. The fix is intentional and tightly scoped: only the
four functions actually referenced from inline attributes are exposed.

**Future direction.** When migrating event cards to Preact, replace
inline `onclick` with proper component event handlers and delete the
window-expose block.

### 5. Bootstrap binding deferred via `window.__sbDashboardBind`

**Decision.** The original code's `if (document.readyState === 'loading')`
bind block at the top of the script doesn't work as a module — at module
evaluation time the document is already parsed (`readyState ===
'complete'`), but several `const SVG_*` constants used by the bind
helpers haven't been initialized yet (they live further down in the
file). The bind body is wrapped into a function assigned to
`window.__sbDashboardBind` and invoked from `main.tsx` after the import
completes — by which time all module-level `const`s have initialized.

**Future direction.** Once the bind targets (sidebar master rows) are
rendered as Preact components, both the deferred binding and the SVG
string constants disappear.

### 6. Snapshot export: fetch the prebuilt HTML, inject a bootstrap script

**Decision.** The `exportHtmlSnapshot` flow now:

1. Fetches `/event-log-dashboard.html` (the same artifact the live server
   serves — guaranteed identical to what the user is looking at).
2. Parses it with `DOMParser`, injects a synchronous `<script>` at the
   top of `<head>` with the baked `__SNAPSHOT__` globals + `fetch` and
   `EventSource` stubs.
3. Adds the snapshot banner + read-only neutering CSS.
4. Downloads the resulting blob.

**Why.** The original code cloned the live document and then fetched the
external CSS to inline it. With Vite emitting a single self-contained
HTML, the clone is unnecessary — fetching the same file we already serve
gives a clean baseline. This deletes ~50 lines of fragile DOM-manipulation
(stripping live-rendered cards/separators/sessions out of the clone) and
removes a dependency on the long-gone `/event-log-dashboard.css` route.

**Server route.** A dedicated `app.get('/event-log-dashboard.html', …)`
serves the cached HTML at a stable path so the snapshot exporter can
fetch it back without depending on the build's filename hashing.

**Tradeoff.** Falls back to the live-document-clone path if the fetch
fails (defensive — by construction the export only runs when there's a
live server reachable, so this is rarely exercised).

### 7. Cache reconstruction + backfill ported verbatim from `main`

**Decision.** When the upstream `improve cache writing and event
recollection` commit landed on `main` mid-refactor, we re-extracted
`legacy-app.ts` from the updated HTML and re-applied the four surgical
patches (helpers extraction, deferred bind, snapshot export
rework). All upstream features — telemetry reconstruction from the
Storybook cache, on-load backfill, the `cache-recon` badge, the snapshot
bake of `realTelemetryDetected` — work unchanged.

**Why this strategy.** Cherry-picking the commit's HTML patch (288 lines,
14 hunks across the script body) would have applied cleanly *except* at
the snapshot exporter where my refactor diverged. Re-extracting and
re-patching surgically was simpler and produced an obviously correct
result; the E2E tests confirm feature parity.

### 8. Tests: Playwright E2E + Vitest unit

**Decision.** Two test layers:

- **Vitest** for pure modules (`lib/format`, `lib/lcs-diff`) — fast,
  hermetic, run in `pnpm test`.
- **Playwright** for end-to-end behavior (`pnpm test:e2e`) — every test
  spawns a fresh `node dist/bin.mjs event-logger` on a unique port via a
  per-test fixture, then drives the live dashboard with a real Chromium
  browser. Tests run from `cwd: /tmp` so the CLI's auto-detected
  Storybook cache resolution doesn't latch onto the repo. A second
  fixture (`eventLoggerWithCache`) explicitly passes
  `--project-root=playground` so cache-reconstruction tests run against
  the committed `playground/.cache/storybook/...` fixture data.

**Coverage.** 35 tests across 9 files: events, search, expand-collapse,
filters, timeline, cache, cache-diff, export-import, snapshot,
reconstruction. Notable: the snapshot test writes the exported file to
disk, opens it via `file://` in a fresh browser context, and asserts the
dashboard renders the baked events with no localhost network requests.

**Why this matters for the migration.** These tests are the contract.
They were written against the *current* (legacy + new features) build.
As components migrate from imperative DOM to Preact, the suite is the
safety net — any visible regression fails a test.

### 9. Deferred: full Preact migration of dynamic behavior

The following is intentionally **not** in this PR:

- `EventList` / `EventCard` / `SessionSeparator` as Preact components.
- `Timeline` as a Preact component (currently a 1.5kLOC IIFE — canvas
  drawing, pan/zoom math, drawer navigation, minimap). The pure pan/zoom
  math is a candidate for `lib/timeline-math.ts`; the canvas effect
  becomes a Preact component using `useRef` + `useEffect`.
- `CacheView` as a Preact component (entries list, diff rendering, edit
  mode).
- A signals store replacing `state` + the global mutation pattern.
- Modal / Toast / DropOverlay as Preact components.
- Conversion of inline `onclick` attributes to component event handlers
  (allows deleting the window-expose block).

The migration order suggested by surface-area:
1. **Toast** (smallest, 1 file, no dependencies).
2. **DropOverlay + drag-and-drop import handler**.
3. **Modal** (used by save / explanation flows).
4. **Sidebar rows** as components reading from a signals store
   (introduce the store with Sidebar; legacy code writes events into it
   via a thin adapter).
5. **EventCard + EventList** with Tabs / DiffTab / PayloadTab. This is
   the largest single area but has the cleanest data shape.
6. **CacheView**.
7. **Timeline** (last — most complex).

Each step is mergeable independently; each removes lines from
`legacy-app.ts`; each must keep the E2E suite green.

## How to verify

```bash
cd libs/sb-utils
pnpm install
pnpm build              # produces dist/bin.mjs + dist/event-log-dashboard.html
pnpm test:e2e           # 35 Playwright tests, ~10s
pnpm test --run         # 12 Vitest specs for lib/format + lib/lcs-diff
pnpm typecheck          # tsc --noEmit, clean
```

Manual smoke against a real Storybook project:

```bash
node dist/bin.mjs event-logger --port 6017 --project-root /path/to/storybook
# In the project:
STORYBOOK_TELEMETRY_URL=http://localhost:6017/event-log yarn storybook
```

The dashboard at `http://localhost:6017` should:
- Render the existing cache as `cache:write op=create` synthetic events.
- Reconstruct telemetry from `dev-server/lastEvents` writes (each gets
  the "cache" recon badge until a real telemetry event arrives via SSE).
- Switch off reconstruction the moment a real event lands; subsequent
  writes don't get ghost recon events.
- Export an HTML snapshot that opens via `file://` and shows the same
  events with no network activity.
