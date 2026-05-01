### @hipster/sb-utils

A small CLI of useful Storybook utilities.

```sh
npx @hipster/sb-utils <command>
```

Commands:

- [`uninstall`](#uninstall) — remove Storybook from a project
- [`event-logger`](#event-logger) — real-time telemetry debugger with a dashboard UI

---

## `uninstall`

Removes Storybook from the current project. By default it scans from the
project root and will:

- delete every `.storybook` config directory it finds
- delete every `*.stories.*` and story-related `.mdx` file
- strip Storybook packages (and any `storybook`/`@storybook/*` scripts) out
  of each `package.json`
- remove the Storybook plugin from Vitest config files

You'll see a summary and a multiselect prompt before anything is touched.

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

The dashboard opens at `http://localhost:6007`. Events arrive live via SSE.
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

### HTTP API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/event-log` | Ingest a single telemetry event (JSON body) |
| `GET`  | `/event-log?type=&sessionId=` | All captured events, with optional filters |
| `GET`  | `/event-log/count` | Summary (total, counts by type and session) |
| `GET`  | `/event-log/export?type=&sessionId=&explanation=` | Download a re-importable `{ version, explanation, events }` JSON file |
| `POST` | `/event-log/import?name=<name>` | Bulk-import a `{ events, explanation? }` batch |
| `POST` | `/clear` | Drop all captured events |
| `GET`  | `/sse` | Real-time SSE stream of incoming events |

---

## Debugging with AI

`event-logger` is built to be driven by an AI agent (Claude Code, Cursor,
etc.) when you want help investigating telemetry.

**How it works.** When the CLI detects an AI agent in the environment
(`std-env`'s `isAgent`), it automatically switches to a machine-friendly
mode:

- A single JSON `ready` line is written to **stderr** with the dashboard
  URL, API endpoints, and a `usage` block describing what each endpoint
  does.
- Every ingested event is printed to **stdout** as NDJSON — one event per
  line — so the agent can stream-parse them without hitting the HTTP API.
- The interactive TUI is suppressed so it doesn't pollute the agent's
  context.

You can force this mode anywhere with `--json`.

### Suggested workflow for an agent

1. **Start the collector** in the background:
   ```sh
   npx @hipster/sb-utils event-logger --json
   ```
   Read the first stderr line to get `telemetryUrl`.

2. **Run Storybook** against it:
   ```sh
   STORYBOOK_TELEMETRY_URL=<telemetryUrl> storybook dev
   ```

3. **Observe.** Either tail stdout (NDJSON) as events arrive, or query the
   API for a summary:
   ```sh
   curl http://localhost:6007/event-log/count
   curl 'http://localhost:6007/event-log?type=build'
   ```

4. **Save a JSON artifact** directly from the agent:
   ```sh
   curl -OJ 'http://localhost:6007/event-log/export?explanation=Repro%20for%20issue%20%23123'
   ```
   The `-OJ` flag respects the server's `Content-Disposition`, so the file
   lands as `telemetry-<iso>.json`. The body is the same wrapped shape the
   dashboard exports (`{ version, explanation, events }`), filterable with
   `?type=` and `?sessionId=`.

5. **Share the session.** From the dashboard, export an HTML snapshot with
   an explanation describing what you did. The snapshot is a single file
   that opens offline and preserves filters, sessions, and the note — drop
   it into a bug report or attach it to a Claude Code session so the next
   investigator starts with full context.

6. **Re-import.** Another agent (or a human) can drop the exported
   `.json` file onto the dashboard, or preload with
   `--import path/to/run.json`, to continue from the same state.

### Sample prompt

Drop this into Claude Code (or any coding agent with shell access) to kick
off an investigation. Replace the reproduction steps with your own.

> Start `@hipster/sb-utils event-logger` in the background and read the
> ready line from stderr to get the collector URL. Then run
> `STORYBOOK_TELEMETRY_URL=<that-url> storybook dev` in my project and
> exercise the following scenario:
>
> 1. Open the Button story
> 2. Switch to the Docs tab
> 3. Reload the page
>
> Once the scenario is done, query `/event-log/count` for a summary and
> `/event-log` for the full event list. Look for anything that indicates
> which add-ons loaded, how long the boot took, and whether any error
> events fired. Summarize what you found, then save the session with
> `GET /event-log/export?explanation=<your-summary>` and give me the
> resulting file path so I can attach it to a bug report.

The agent gets everything it needs from the ready line and the HTTP API —
no extra context files required.

### Tips

- Use `--max-events` on long-running sessions so memory doesn't grow
  unboundedly.
- Use `/clear` between reproduction steps to keep each batch of events
  scoped to a single hypothesis.
- The JSON export format is `{ version, explanation?, events }`. Let the
  agent write the explanation — it's a good prompt for summarizing what
  the run was about.
