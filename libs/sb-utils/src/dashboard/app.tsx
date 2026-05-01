/**
 * App shell — static DOM structure for the dashboard. Mirrors the original
 * `<body>` of event-log-dashboard.html so the legacy app code (which queries
 * by ID/class) keeps working unchanged. Children are split into small
 * presentational components for navigability — they hold no React state.
 */

import { DropOverlay } from './components/DropOverlay'
import { Modal } from './components/Modal'
import { Header } from './components/Header'
import { PausedBanner } from './components/PausedBanner'
import { Sidebar } from './components/Sidebar'
import { EventList } from './components/EventList'
import { TimelineView } from './components/TimelineView'
import { CacheView } from './components/CacheView'
import { ToastContainer } from './components/Toast'
import { SnapshotBanner } from './components/SnapshotBanner'

export function App() {
  return (
    <>
      <SnapshotBanner />
      <DropOverlay />
      <Modal />
      <Header />
      <PausedBanner />
      <div class="layout" id="layout">
        <Sidebar />
        <EventList />
        <TimelineView />
        <CacheView />
      </div>
      <ToastContainer />
    </>
  )
}
