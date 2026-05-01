import { render } from 'preact'
import { App } from './app'
import './styles.css'
import { installSxsExpandHandler } from './lib/legacy-html'

// Snapshot mode — when this page was loaded as an exported HTML
// snapshot, the bake set `window.__SNAPSHOT__ = true` (see
// features/snapshot-export.ts). Flag the body so snapshot-only CSS
// applies (hide live-only controls, switch the body to flex column).
if ((window as any).__SNAPSHOT__) {
  document.body.dataset.snapshot = 'true'
  // Reassert the title — the bake captured it but other scripts
  // (Preact mount, etc.) sometimes step on it during boot.
  const meta = ((window as any).__SNAPSHOT_META__ || {}) as {
    name?: string
    eventsCount?: number
  }
  if (meta.name) {
    document.title = meta.name + ' · Snapshot · ' + (meta.eventsCount || 0) + ' events'
  }
}

// The Timeline drawer still produces HTML-string side-by-side diffs that
// need a click handler for "Expand N unchanged lines" rows. Install it
// once at boot; the Preact <DiffView> in event cards has its own
// per-row useState and does not need this.
installSxsExpandHandler()

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')
render(<App />, root)

// Move the rendered app shell to be a direct child of <body>. The
// dashboard styles target body-level layout (e.g. `body.view-timeline`
// toggles position of `.layout`), and a few overlays use viewport-fixed
// positioning that's simpler to reason about when not nested inside a
// wrapper. Mounting into #root first lets Preact own the JSX; this hoist
// makes the runtime DOM match the structure the CSS was written against.
while (root.firstChild) document.body.insertBefore(root.firstChild, root)
root.remove()

// Boot the imperative runtime (SSE, ingestion, reconstruction, modal/
// snapshot/cache wiring). Lives in features/runtime.ts which queries
// elements by ID at top-level, so the import has to happen *after*
// Preact has committed and the hoist above has finished.
import('./features/runtime').then(() => {
  // Bind master-row hooks deferred because some `const` values used by
  // the binders are declared further down in features/runtime.ts —
  // calling at module top would TDZ. main runs after the runtime
  // module has finished evaluating, so all consts are initialized.
  const bind = (window as unknown as { __sbDashboardBind?: () => void }).__sbDashboardBind
  if (bind) bind()
})
