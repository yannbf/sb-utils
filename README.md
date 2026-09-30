# @hipster/sb-utils

A CLI for removing Storybook from a project and inspecting its telemetry and cache.
Requires Node.js 20 or newer.

```sh
npx @hipster/sb-utils <command>
```

Commands:

- [`uninstall`](#uninstall) — remove Storybook from a project
- [`event-logger`](#event-logger) — real-time telemetry debugger with a dashboard UI

For contributors: [development](#development), [releases](#releases), and
[agent instructions](AGENTS.md).

---

## `uninstall`

Removes Storybook from the current project. By default it scans from the
project root and will:

- delete every `.storybook` config directory it finds
- delete `*.stories.*`, `*.story.*`, and `.mdx` files containing `@storybook/`
- remove dependencies whose names contain `storybook` from `dependencies`
  and `devDependencies` in each `package.json`
- remove the Storybook Vitest plugin from Vite and Vitest config files
- remove Storybook lint configuration from supported ESLint and Oxlint files

You'll see a summary and a multiselect prompt before changes are applied,
unless you pass `--yes`. After uninstalling, review your package scripts and
run your package manager to refresh the lockfile and installed dependencies.

```sh
npx @hipster/sb-utils uninstall
```

### Options

| Flag | Description |
| --- | --- |
| `-y, --yes` | Skip all prompts and apply the default cleanup |
| `-k, --keep-stories` | Keep `.stories.*` and story MDX files |
| `-d, --keep-storybook-dir` | Rename `.storybook/` to `.storybook-original/` instead of deleting it |
| `--vitest-only` | Only remove the Storybook Vitest plugin from config files |
| `--stories-only` | Only remove story and MDX files |

### Examples

```sh
# Full uninstall, no prompts
npx @hipster/sb-utils uninstall -y

# Uninstall Storybook but preserve the .storybook/ config and stories for reference
npx @hipster/sb-utils uninstall -y -k -d

# Just detach the Storybook Vitest plugin, leave everything else alone
npx @hipster/sb-utils uninstall --vitest-only
```

---

## `event-logger`

Starts a local HTTP server that receives Storybook telemetry events and
displays them in a real-time dashboard. Useful for inspecting what events
Storybook is emitting during a dev session, a CI run, or a repro.

```sh
npx @hipster/sb-utils event-logger
```

Then point Storybook at the collector:

```sh
STORYBOOK_TELEMETRY_URL=http://localhost:6007/event-log storybook dev
```

Open `http://localhost:6007`, or pass `--open` to launch the browser. If the
port is occupied, the collector tries higher ports; use the URL it reports
for both the dashboard and `STORYBOOK_TELEMETRY_URL`. Events arrive live via SSE.
You can filter by event type or session, drop a `.json` export onto the
window to re-import a past run, or save the current state as a portable
single-file HTML snapshot (with an optional explanation note).

### Options

| Flag | Description | Default |
| --- | --- | --- |
| `-p, --port <port>` | Port to listen on | `6007` |
| `--open` | Auto-open the dashboard in your browser | off |
| `--json` | Stream events as NDJSON to stdout (auto-on under an AI agent) | off |
| `-q, --quiet` | Suppress all terminal output except errors | off |
| `--max-events <count>` | Cap events kept in memory (`0` = unlimited) | `0` |
| `--import <path>` | Preload events from a JSON file exported from the dashboard | — |
| `--project-root <path>` | Project to inspect the Storybook cache for. Defaults to walking up from cwd | auto |
| `--no-cache` | Disable automatic cache rediscovery and report cache as disabled by default | off |
| `--no-cache-watch` | Disable filesystem watching; cache inspection remains available | watching on |

### HTTP API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Dashboard HTML |
| `GET` | `/event-log-dashboard.html` | Standalone dashboard source used by snapshot export |
| `GET` | `/config` | Server start time and cache defaults |
| `POST` | `/event-log` | Ingest a single telemetry event (JSON body) |
| `GET`  | `/event-log?type=&sessionId=` | All captured events, with optional filters |
| `GET`  | `/event-log/count` | Summary (total, counts by type and session) |
| `GET`  | `/event-log/export?type=&sessionId=&explanation=` | Download a re-importable `{ version, explanation, events }` JSON file |
| `POST` | `/event-log/import?name=<name>` | Bulk-import a `{ events, explanation? }` batch |
| `POST` | `/clear` | Drop all captured events |
| `GET`  | `/sse` | Real-time SSE stream of incoming events |
| `GET` | `/events/:type` | Legacy alias for filtering events by type |
| `GET`  | `/cache/info` | Resolved Storybook cache layout (status, paths, version, namespaces) |
| `GET`  | `/cache/entries?key=&keyPrefix=&namespace=&projectRoot=` | List cache entries with optional filters |
| `GET`  | `/cache/entries/:key` | Read a single cache entry by logical key |
| `PUT`  | `/cache/entries/:key?namespace=&ttl=&createIfMissing=&version=` | Write a cache entry |
| `DELETE` | `/cache/entries/:key?namespace=` | Delete a single entry |
| `POST` | `/cache/clear` | Wipe all entries |
| `POST` | `/cache/project-root` | Switch the active project (body: `{ projectRoot }`; `null` restores discovery) |
| `POST` | `/cache/version` | Pin the active cache version (body: `{ version }`; `null` restores automatic selection) |

`/cache/info`, `/cache/entries`, `/cache/entries/:key`, and `/cache/clear`
accept `?projectRoot=` and `?version=` overrides for a single request.
URL-encode logical keys in `/cache/entries/:key` when they contain `/`.

---

## Cache inspector

`event-logger` looks for Storybook's cache in
`<project>/node_modules/.cache/storybook/`, then `<project>/.cache/storybook/`.
The Cache tab lets you switch between detected versions. It surfaces cache
contents and filesystem write/delete activity in three ways:

1. **Live timeline.** Every cache file write or delete becomes a
   `cache:write` / `cache:delete` pseudo-event in the timeline alongside
   real telemetry events. The payload includes the logical key, namespace,
   operation, full content, and a structural diff for updates.
2. **Cache view.** The "Cache" tab in the dashboard shows every
   entry in the resolved cache, grouped by namespace, with TTL info and
   "copy / edit / delete" affordances when writes are enabled.
3. **Mutation API.** `PUT /cache/entries/:key` lets you plant arbitrary
   cache state. Useful for reproducing bugs that depend on specific
   cached state (`ai-setup-pending`, `lastEvents`, etc.) without having
   to trigger the upstream CLI flow first.

The resolved project root is shown on the Cache tab; click "Change
root…" to switch projects on the fly — useful when running
`event-logger` from `~` while debugging a project elsewhere. If no
Storybook cache is detected, the dashboard renders a clear empty state
and telemetry capture continues to work.

Cache operations are hidden from the event list and timeline by default.
Use the independent sidebar toggles to show cache operations, include stale
cache data from before the collector started, or reconstruct telemetry from
`dev-server/lastEvents`. Cache inspection itself is available without these
toggles.

The Cache tab includes an "Edit mode" toggle that gates Edit / Delete /
Clear affordances client-side. Off by default; flipping it on shows a
banner so it's obvious you're operating on real on-disk state.

---

## Debugging with AI

`event-logger` enables JSON mode automatically when it detects an AI agent.
You can also request it explicitly:

```sh
npx @hipster/sb-utils event-logger --json
```

- **stderr:** JSON status messages. Wait for the message with
  `"status": "ready"` and read its `dashboard`, `telemetryUrl`, and `api`
  fields. Port-retry messages can arrive before it. When an agent is detected,
  the ready message also includes `agent` and `usage` information.
- **stdout:** incoming telemetry and cache events as NDJSON, one JSON object
  per line.

Point Storybook at the reported `telemetryUrl`. Use the HTTP API above to
query, clear, or export events; use `--max-events` to bound long sessions.
For example, with the default port:

```sh
curl 'http://localhost:6007/event-log?type=build'
curl -OJ 'http://localhost:6007/event-log/export?explanation=Reproduction%20notes'
```

JSON exports contain `{ version, explanation, events }`. Re-import one by
dropping it onto the dashboard or starting the collector with `--import`.
For an interactive artifact that opens offline, use the dashboard's HTML
snapshot export. It includes the captured events, cache state, and export
note.

A useful prompt for an agent:

> Start `@hipster/sb-utils event-logger --json` and wait for its ready message.
> Run Storybook with `STORYBOOK_TELEMETRY_URL` set to the reported URL, then
> reproduce [describe the steps]. Inspect `/event-log` and `/event-log/count`,
> summarize what happened, and save a JSON export with the reproduction notes.

## Development

This is a single-package repository; run commands from the repository root.
Use the Node.js version in [`.node-version`](.node-version) and the pnpm
version in [`package.json`](package.json)'s `packageManager` field.
`pnpm-workspace.yaml` stores dependency build permissions only.

```sh
pnpm install --frozen-lockfile
pnpm build
```

### Commands and checks

| Command | Purpose |
| --- | --- |
| `pnpm build` | Build the CLI with tsdown, then the dashboard with Vite, into `dist/` |
| `pnpm build:cli` | Build only the CLI and server |
| `pnpm build:dashboard` | Build only the self-contained dashboard HTML |
| `pnpm dev:cli` | Watch and rebuild the CLI; restart a running server to use changes |
| `pnpm dev:dashboard` | Start the dashboard Vite server with HMR |
| `pnpm typecheck` | Check CLI/server and dashboard TypeScript configurations |
| `pnpm test --run` | Run Vitest tests in `specs/` and `src/**/*.test.ts` |
| `pnpm test:e2e` | Build, then run Playwright against the production dashboard |
| `pnpm test:package` | Build and pack, install in a temporary consumer, and check the executable, exports, types, and dashboard |
| `pnpm test:release` | Check release lifecycle hooks with a minimal build and `npm publish --dry-run` in a temporary directory |

Install Chromium before the first E2E run:

```sh
pnpm exec playwright install chromium
```

The full CI checks can be run locally in this order:

```sh
pnpm typecheck
pnpm test --run
pnpm test:release
pnpm test:e2e
pnpm test:package
```

Run build, E2E, and package checks sequentially: builds can clean `dist/`
while an E2E server is using it. Package checks install dependencies from npm;
release dry runs can also access the registry. Neither check publishes.

### Dashboard development

After `pnpm build`, start the collector in one terminal:

```sh
node dist/bin.mjs event-logger --port 9009
```

In another terminal, run `pnpm dev:dashboard` and open
`http://localhost:5173/event-log-dashboard.html` (or the Vite-reported port).
The proxy in `vite.config.ts` targets the collector on port `9009`. Set
`STORYBOOK_TELEMETRY_URL=http://localhost:9009/event-log` in the Storybook
project you are debugging. Ensure the collector actually started on `9009`;
its automatic port fallback does not update the Vite proxy.

For CLI changes, `pnpm dev:cli` rebuilds on save. CLI builds can clean
`dist/`, so rebuild the dashboard before restarting `event-logger`, or use
`pnpm build` to rebuild both parts.

### Manual uninstall fixtures

`playground/` contains test inputs, not a second package or a configured
Storybook app. Copy it to a temporary directory, rename
`package.json.fixture` to `package.json` there, and run the built CLI from
that directory. Use an absolute path to the repository's `dist/bin.mjs`.
This keeps the original fixtures available for the next test.

See [AGENTS.md](AGENTS.md) for the code map and architectural constraints.

## Releases

[Auto's npm plugin](https://intuit.github.io/auto/docs/generated/npm) handles
version bumps, changelogs, tags, npm publishing, and GitHub releases.
Pull request labels determine the bump; avoid manually editing the package
version or generated changelog during normal development.

[CI](.github/workflows/ci.yml) runs on pull requests and is reused by the
[release workflow](.github/workflows/release.yml) on branch pushes. After
checks pass, the upstream repository runs `pnpm release`: stable releases
come from `main`, and other branches produce canaries. Runs for the same
branch are serialized. The workflow uses the `GH_TOKEN` and `NPM_TOKEN`
repository secrets.

Keep both build hooks:

1. `prerelease` builds before Auto starts, so npm's initial executable check
   finds `dist/bin.mjs`.
2. Auto updates `package.json`, then invokes npm publishing.
3. `prepack` rebuilds with the new version embedded in the CLI and includes
   the self-contained dashboard. It also runs for `npm pack`.

Use `pnpm test:release` and `pnpm test:package` to validate packaging.
`pnpm release` is the publishing command, not a local validation check.

Current releases use `v…` tags. Preserve the older `@hipster/sb-utils@…`
tags and the release workflow's full-history checkout: Auto uses the
previous GitHub release to determine the next release's changes.
[CHANGELOG.md](CHANGELOG.md) contains the package history;
[docs/monorepo-changelog.md](docs/monorepo-changelog.md) is the historical
repository-wide archive.
