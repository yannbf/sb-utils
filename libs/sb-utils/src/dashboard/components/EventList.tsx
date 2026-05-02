/**
 * Main event list — renders cards interleaved with session separators.
 * The "filtered out" / "no events" empty state is mode-aware: shows the
 * STORYBOOK_TELEMETRY_URL hint when there are zero events, and a
 * filter-clearing hint when filters hid everything.
 */

import { useEffect, useRef } from 'preact/hooks'
import { computed } from '@preact/signals'
import { events, autoScroll, type StoredEvent } from '../store/signals'
import { matchesFilters } from '../lib/filters'
import { EventCard } from './EventCard'

function SessionSeparator({ sessionId }: { sessionId: string }) {
  return (
    <div class="session-separator" data-session-id={sessionId}>
      <span class="session-label">Session {sessionId.slice(0, 8)}</span>
    </div>
  )
}

// Memoized visible-events pass: re-runs only when events.value or any
// filter signal `matchesFilters` reads from changes. Without this,
// every card re-render (toggling expand on a single card) would walk
// the whole event list again.
type VisibleRow = {
  ev: StoredEvent
  displayIdx: number
  prevVisible: StoredEvent | null
}

const visibleEvents = computed<VisibleRow[]>(() => {
  const out: VisibleRow[] = []
  let last: StoredEvent | null = null
  let displayIdx = 0
  for (const ev of events.value) {
    if (!matchesFilters(ev)) continue
    displayIdx++
    out.push({ ev, displayIdx, prevVisible: last })
    last = ev
  }
  return out
})

export function EventList() {
  const totalCount = events.value.length
  const visible = visibleEvents.value

  // Auto-scroll to bottom whenever new events arrive (and the toggle
  // is on). Two safeguards so the first paint stays at the top:
  //   1. A short settle window after mount (boot recovery + cache
  //      backfill + SSE recovery all dump batches in this window —
  //      jumping to the bottom would hide the chronologically first
  //      event).
  //   2. Only tail when the batch added since last render is small
  //      (live events arrive one at a time; a batch of 5+ at once is
  //      almost always a recovery / import / backfill, not live tail).
  const containerRef = useRef<HTMLDivElement>(null)
  const lastCount = useRef(0)
  const mountedAt = useRef(0)
  if (mountedAt.current === 0) mountedAt.current = Date.now()
  const SETTLE_MS = 1500
  const LIVE_BATCH_MAX = 5
  useEffect(() => {
    const sinceMount = Date.now() - mountedAt.current
    if (sinceMount < SETTLE_MS) {
      lastCount.current = totalCount
      return
    }
    if (!autoScroll.value) {
      lastCount.current = totalCount
      return
    }
    const added = totalCount - lastCount.current
    if (added > 0 && added <= LIVE_BATCH_MAX && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
    lastCount.current = totalCount
  })

  // Build the interleaved children: session separator before each first
  // event of a session run, then the card. Only visible events render —
  // filtered-out cards were `display:none` anyway so skipping them
  // entirely saves a lot of VDOM work with 200+ events.
  const children: preact.JSX.Element[] = []
  let lastSession: string | null = null
  for (const row of visible) {
    const ev = row.ev
    if (ev.sessionId && ev.sessionId !== lastSession) {
      children.push(
        <SessionSeparator
          key={'sep-' + ev.sessionId + '-' + ev._index}
          sessionId={ev.sessionId}
        />,
      )
      lastSession = ev.sessionId
    }
    children.push(
      <EventCard
        key={ev._index}
        event={ev}
        displayIdx={row.displayIdx}
        prevVisible={row.prevVisible}
      />,
    )
  }

  const isEmpty = totalCount === 0
  const showEmptyHint = isEmpty || visible.length === 0

  return (
    <div class="main" id="eventContainer" ref={containerRef}>
      <div
        class="empty-state"
        id="emptyState"
        style={showEmptyHint ? undefined : { display: 'none' }}
      >
        <div class="empty-icon" id="emptyIcon">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        {isEmpty ? (
          <>
            <h3 id="emptyTitle">Waiting for telemetry events</h3>
            <p id="emptySubtitle">
              Point Storybook at this collector to start capturing events
            </p>
            <code id="emptyCode">
              STORYBOOK_TELEMETRY_URL={typeof location !== 'undefined' ? location.origin : ''}
              /event-log
            </code>
          </>
        ) : (
          <>
            <h3 id="emptyTitle">No events match your filters</h3>
            <p id="emptySubtitle">Adjust filters in the sidebar or clear the search box.</p>
          </>
        )}
      </div>
      {children}
    </div>
  )
}
