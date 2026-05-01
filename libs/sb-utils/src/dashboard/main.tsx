import { render } from 'preact'
import { App } from './app'
import './styles.css'

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
