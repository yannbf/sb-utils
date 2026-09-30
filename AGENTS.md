# Working on @hipster/sb-utils

This repository is one npm package at the root. It provides two CLI commands:
`uninstall` removes Storybook from a project; `event-logger` serves a local
telemetry and cache dashboard. Users run `npx @hipster/sb-utils <command>`.

Read [README.md](README.md) for usage, [development commands](README.md#development),
and the [release process](README.md#releases). `package.json` and
`.github/workflows/` are the source of truth for scripts and automation.
`CLAUDE.md` imports this file; keep agent instructions here.

## Code map

| Area | Start here |
| --- | --- |
| CLI commands and options | `src/bin.ts`, then the matching file in `src/commands/` |
| HTTP server, telemetry ingestion, SSE, startup | `src/commands/event-logger.ts` |
| Cache discovery, version selection, filesystem watching | `src/cache/discover.ts`, `src/cache/storybook-version.ts`, `src/cache/watch.ts` |
| Cache HTTP endpoints and file operations | `src/cache/routes.ts`, `src/cache/read.ts`, `src/cache/write.ts` |
| Uninstall detection and cleanup | `src/commands/uninstall.ts` and `src/utils/` |
| Dashboard UI and styling | `src/dashboard/components/`, `src/dashboard/app.tsx`, `src/dashboard/styles.css` |
| Dashboard state and actions | `src/dashboard/store/`, `src/dashboard/features/actions.ts` |
| Live event recovery and connection lifecycle | `src/dashboard/features/event-stream.ts` |
| Startup and snapshot restoration | `src/dashboard/features/runtime.ts` |
| Offline HTML export | `src/dashboard/features/snapshot-export.ts` |
| Pure dashboard logic | `src/dashboard/lib/` |
| Timeline rendering and geometry | `src/dashboard/features/timeline.ts`, `src/dashboard/lib/timeline-math.ts` |
| Unit tests | `specs/*.spec.ts`, `src/**/*.test.ts` |
| Browser tests and server fixtures | `e2e/*.e2e.ts`, `e2e/fixtures.ts` |
| Packaging and release checks | `scripts/check-package.mjs`, `scripts/release.test.mjs` |

`playground/package.json.fixture` is manual uninstall test data, not a
workspace package. Copy the playground to a temporary directory before
running the destructive command. Preserve the tracked `mocks/.cache/`
files used by browser tests; use temporary fixtures for new mutation tests.

## Contracts to preserve

Change these only when the task explicitly calls for a different contract:

- **Self-contained installation.** The npm package ships its executable,
  command exports, declarations, and dashboard through `dist/`. Running it
  with `npx` requires no additional setup.
- **One dashboard file.** `dist/event-log-dashboard.html` contains all its
  JavaScript and CSS. Keep assets inlined; the server and snapshot exporter
  depend on this artifact.
- **Interactive offline snapshots.** Exported HTML must work over `file://`,
  show baked events and cache state, support interaction, and make no
  network requests. Preserve the `fetch` and `EventSource` stubs.
- **Session-local preferences.** Use `src/dashboard/lib/session-storage.ts`,
  never `localStorage`. The helper clears this app's preferences when the
  server's `startedAt` changes and disables storage access in snapshots.
- **Independent cache and telemetry controls.** Cache visibility, stale-data
  visibility, and telemetry reconstruction must remain separate controls.

## Dashboard conventions

Keep shared reactive state in `store/`: most signals and derived values are
in `signals.ts`; cache and modal state have their own modules. Components
read signals during render. Route user actions through `features/actions.ts`
or the existing store module; `store/actions.ts` re-exports those actions.
Prefer `computed` for derived state and pure helpers in `lib/` for logic
that can be tested without a browser. Avoid new globals or inline HTML event
handlers.

When adding state to an offline snapshot, update both the bake in
`features/snapshot-export.ts` and restoration in `features/runtime.ts`,
including any endpoint stubs and preferences that state needs. The normal
export path starts with the prebuilt HTML. Keep live-DOM cloning limited to
its existing fallback; do not make the live DOM the primary export format.

The sidebar's cache controls are all off in a fresh dashboard:

| Control | Internal state | Behavior |
| --- | --- | --- |
| Show cache operations | `cacheAllHidden = true` initially; the toggle is its inverse | Shows/hides cache operations independently of telemetry |
| Show stale cache data | `showStaleCache = false` | Includes entries whose mtime predates `serverStartedAt` |
| Reconstruct telemetry | `reconstructFromCache = false` | Synthesizes telemetry from `dev-server/lastEvents` |

Reconstructed events use `_source: 'cache-recon'`; cache watcher events use
`_source: 'cache-watch'`. Enabling reconstruction must not enable cache
visibility. Apply stale-data rules during both ingestion/reconstruction and
filtering. When a cache appears after startup, watcher attachment uses
`emitColdStart: true` to expose its existing contents.

Keep SSE cleanup on page exit. Avoid redundant startup requests: open SSE
connections can consume the browser's per-origin connection slots and block
other requests across multiple tabs.

## Build and release constraints

`pnpm build` runs tsdown for the CLI/server, then Vite for the dashboard.
CLI builds can clean `dist/`; build the dashboard afterward before starting
`event-logger`. The README describes the separate server and HMR workflow.

Preserve the `bin` and `exports` entries in `package.json` and both release
hooks: `prerelease` builds before npm validates executable metadata;
`prepack` rebuilds after Auto updates the version. The published CLI must
report that version and include the dashboard. Keep full Git history in the
release workflow so Auto can find earlier release tags.

Use the package/release tests for validation. Run `pnpm release` only as part
of a requested release, since it can publish to npm and GitHub.

## Verification

Choose checks based on the changed behavior; the full CI sequence is in
[README.md](README.md#commands-and-checks).

| Change | Local verification |
| --- | --- |
| Documentation only | Check paths, links, commands, and claims against the source; run `git diff --check` |
| CLI/server or pure helpers | `pnpm typecheck` and `pnpm test --run`; add a focused regression test for changed behavior |
| Dashboard or server/browser interaction | The above checks plus `pnpm test:e2e`; use the existing server fixtures |
| Build, package metadata, or release lifecycle | `pnpm test:release` and `pnpm test:package`; also run E2E when changing shipped dashboard assets |

For visible UI or snapshot behavior changes, also inspect the affected live
view and exported offline snapshot. Tests should assert behavior, not mirror
the implementation. Run builds, package checks, and E2E sequentially because
they share `dist/`. Report failures and unrun checks explicitly.

When changing commands, endpoints, defaults, or release hooks, update the
corresponding README section. Keep this file focused on durable constraints
and navigation; implementation detail belongs beside the code, and release
history belongs in the changelog.
