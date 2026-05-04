# v0.0.16 (Mon May 04 2026)

#### 🐛 Bug Fix

- Refactor event logger to use Preact [#20](https://github.com/yannbf/sb-utils/pull/20) ([@yannbf](https://github.com/yannbf))
- fix reconstruction ([@yannbf](https://github.com/yannbf))
- improve timeline and cluster-like experience ([@yannbf](https://github.com/yannbf))
- track mocks/.cache fixture so CI's eventLoggerWithCache can discover it ([@yannbf](https://github.com/yannbf))
- merge main, discard 24ba25a (superseded by this branch) ([@yannbf](https://github.com/yannbf))
- final cleanup ([@yannbf](https://github.com/yannbf))
- revamp cache to use toggles instead ([@yannbf](https://github.com/yannbf))
- update mocks ([@yannbf](https://github.com/yannbf))
- significantly improve performance ([@yannbf](https://github.com/yannbf))
- update docs ([@yannbf](https://github.com/yannbf))
- auto detect node modules cache dir once it's created ([@yannbf](https://github.com/yannbf))
- improve stale cache and telemetry reconstruction logic ([@yannbf](https://github.com/yannbf))
- indicate stale cache data ([@yannbf](https://github.com/yannbf))
- fix stale cache in export ([@yannbf](https://github.com/yannbf))
- make server sessions handling more resilient ([@yannbf](https://github.com/yannbf))
- Cache + telemetry reconstruction improvements ([@yannbf](https://github.com/yannbf))
- IMPROVEMENTS.md: final shape after the follow-up sweep ([@yannbf](https://github.com/yannbf))
- e2e: add paused buffer, Cmd+F, snapshot-explain, cache edit-mode tests ([@yannbf](https://github.com/yannbf))
- vitest: specs for cache-diff, colors, and computed signals ([@yannbf](https://github.com/yannbf))
- preact: status dot reads connectionStatus signal ([@yannbf](https://github.com/yannbf))
- preact: drop @ts-nocheck from features/timeline.ts; both tsconfigs typecheck ([@yannbf](https://github.com/yannbf))
- preact: native TimelineDrawer + drop lib/legacy-html ([@yannbf](https://github.com/yannbf))
- IMPROVEMENTS.md — final state ([@yannbf](https://github.com/yannbf))
- preact: clarify Timeline @ts-nocheck rationale ([@yannbf](https://github.com/yannbf))
- preact: drop legacy state object + mirror — signals are the only source ([@yannbf](https://github.com/yannbf))
- preact: Timeline component wraps the imperative engine ([@yannbf](https://github.com/yannbf))
- preact: native CacheView component (drop the IIFE) ([@yannbf](https://github.com/yannbf))
- preact: actions module on signals + keyboard module ([@yannbf](https://github.com/yannbf))
- preact: extract SSE / ingest / load to features/event-stream.ts ([@yannbf](https://github.com/yannbf))
- preact: extract exportHtmlSnapshot to features/snapshot-export.ts ([@yannbf](https://github.com/yannbf))
- preact: SnapshotBanner component + remove inline banner injection ([@yannbf](https://github.com/yannbf))
- preact: native JsonView + DiffView components, drop renderers bridge ([@yannbf](https://github.com/yannbf))
- IMPROVEMENTS.md — remaining migration work + carve-outs ([@yannbf](https://github.com/yannbf))
- fix: timeline missing cacheKeyOf after extraction ([@yannbf](https://github.com/yannbf))
- preact migration: rename legacy-app.ts → features/runtime.ts ([@yannbf](https://github.com/yannbf))
- preact migration: route getColor through lib/colors ([@yannbf](https://github.com/yannbf))
- preact migration: extract JSON renderer + cache-diff to lib/ ([@yannbf](https://github.com/yannbf))
- preact migration: extract reconstruction to features/reconstruction.ts ([@yannbf](https://github.com/yannbf))
- preact migration: strip dead code from stubbed renderers ([@yannbf](https://github.com/yannbf))
- preact migration: extract CacheView to features/cache-view.ts ([@yannbf](https://github.com/yannbf))
- preact migration: extract Timeline to features/timeline.ts ([@yannbf](https://github.com/yannbf))
- preact migration: EventList + EventCard ([@yannbf](https://github.com/yannbf))
- preact migration: Header + PausedBanner ([@yannbf](https://github.com/yannbf))
- preact migration: Sidebar (EventTypes / CacheOps / Sessions / Imports) ([@yannbf](https://github.com/yannbf))
- preact migration: DropOverlay component owns drag-drop import ([@yannbf](https://github.com/yannbf))
- preact migration: Modal component + drop-old-shell ([@yannbf](https://github.com/yannbf))
- preact migration: signals store + Toast component ([@yannbf](https://github.com/yannbf))
- DECISIONS.md + lib/colors + mealdrop launch config ([@yannbf](https://github.com/yannbf))
- ignore Playwright test-results ([@yannbf](https://github.com/yannbf))
- add Playwright E2E suite covering all dashboard scenarios ([@yannbf](https://github.com/yannbf))
- port telemetry reconstruction + cache backfill features into Preact build ([@yannbf](https://github.com/yannbf))
- wip: Preact + Vite + plugin-singlefile dashboard refactor ([@yannbf](https://github.com/yannbf))

#### ⚠️ Pushed to `main`

- fix release ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.14 (Fri May 01 2026)

#### 🐛 Bug Fix

- add cache inspector [#19](https://github.com/yannbf/sb-utils/pull/19) ([@yannbf](https://github.com/yannbf))
- add cache inspector ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.13 (Fri May 01 2026)

#### ⚠️ Pushed to `main`

- add json export endpoint ([@yannbf](https://github.com/yannbf))
- improve explanation feature ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.12 (Sat Apr 18 2026)

#### ⚠️ Pushed to `main`

- add snapshot explanation ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.11 (Fri Apr 17 2026)

#### ⚠️ Pushed to `main`

- export button improvements ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.10 (Fri Apr 17 2026)

#### 🐛 Bug Fix

- add json import feature [#18](https://github.com/yannbf/sb-utils/pull/18) ([@yannbf](https://github.com/yannbf))
- add json import feature ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.9 (Fri Apr 17 2026)

#### 🐛 Bug Fix

- Add event logger [#17](https://github.com/yannbf/sb-utils/pull/17) ([@yannbf](https://github.com/yannbf))
- add timeline feature ([@yannbf](https://github.com/yannbf))
- update clack and fix colors ([@yannbf](https://github.com/yannbf))
- add event logger ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.8 (Fri Mar 27 2026)

#### 🐛 Bug Fix

- Feat: Add vitest uninstall command [#16](https://github.com/yannbf/sb-utils/pull/16) ([@yannbf](https://github.com/yannbf))
- vitest uninstall command ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.7 (Fri Dec 19 2025)

#### 🐛 Bug Fix

- Refactor project structure and use tsdown [#14](https://github.com/yannbf/sb-utils/pull/14) ([@yannbf](https://github.com/yannbf))
- cleanup ([@yannbf](https://github.com/yannbf))
- add --keep-storybook-dir flag [#13](https://github.com/yannbf/sb-utils/pull/13) ([@yannbf](https://github.com/yannbf))
- export types ([@yannbf](https://github.com/yannbf))
- refactor structure ([@yannbf](https://github.com/yannbf))
- CLI: Add component analyzer ([@yannbf](https://github.com/yannbf))
- fix ([@yannbf](https://github.com/yannbf))
- fix types ([@yannbf](https://github.com/yannbf))
- expose node entrypoints ([@yannbf](https://github.com/yannbf))
- Move uninstall command to its own file ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.6 (Mon Dec 08 2025)

#### 🐛 Bug Fix

- Revamp CLI package [#12](https://github.com/yannbf/sb-utils/pull/12) ([@yannbf](https://github.com/yannbf))
- add binary ([@yannbf](https://github.com/yannbf))
- revamp package ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.5 (Mon Apr 28 2025)

#### ⚠️ Pushed to `main`

- add keep stories flag ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.4 (Sun Apr 27 2025)

#### ⚠️ Pushed to `main`

- add improvements and testing playground ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.3 (Sun Apr 27 2025)

#### ⚠️ Pushed to `main`

- add yes flag ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.2 (Sun Apr 27 2025)

#### ⚠️ Pushed to `main`

- fix ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))
