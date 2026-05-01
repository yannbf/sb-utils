import { render } from 'preact'
import { App } from './app'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')
render(<App />, root)

// Move the rendered app shell to be a direct child of <body>. The legacy
// dashboard styles target body-level layout (e.g. `body.view-timeline` toggles
// position of `.layout`), and a few overlays use viewport-fixed positioning
// that's simpler to reason about when not nested inside a wrapper. Mounting
// into #root first lets Preact own the JSX; this hoist makes the runtime DOM
// match the structure the legacy CSS was written against.
while (root.firstChild) document.body.insertBefore(root.firstChild, root)
root.remove()

// Run the legacy app code after the DOM is in place. The legacy module
// queries elements by ID at top-level, so the import has to happen *after*
// Preact has committed and the hoist above has finished.
import('./legacy-app').then(() => {
  // Bind the master-row eye/trash icons. See the long comment at the same
  // spot in legacy-app.ts — the deferral is required because const values
  // declared further down in the legacy file aren't yet initialized when
  // its top-level code runs.
  const bind = (window as unknown as { __sbDashboardBind?: () => void }).__sbDashboardBind
  if (bind) bind()
})
