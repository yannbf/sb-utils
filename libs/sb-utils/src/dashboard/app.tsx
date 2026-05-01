/**
 * App shell — static DOM structure for the dashboard. Mirrors the original
 * `<body>` of event-log-dashboard.html so the legacy app code (which queries
 * by ID/class) keeps working unchanged. Children are split into small
 * presentational components for navigability — they hold no React state.
 */

import { DropOverlay } from './components/DropOverlay'
import { ModalShell } from './components/ModalShell'
import { Header } from './components/Header'
import { PausedBanner } from './components/PausedBanner'
import { Sidebar } from './components/Sidebar'
import { EventContainer } from './components/EventContainer'
import { TimelineView } from './components/TimelineView'
import { CacheViewShell } from './components/CacheViewShell'

export function App() {
  return (
    <>
      <DropOverlay />
      <ModalShell />
      <Header />
      <PausedBanner />
      <div class="layout" id="layout">
        <Sidebar />
        <EventContainer />
        <TimelineView />
        <CacheViewShell />
      </div>
    </>
  )
}
