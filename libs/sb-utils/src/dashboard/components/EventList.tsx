/**
 * Main event list — renders cards interleaved with session separators.
 * The "filtered out" / "no events" empty state is mode-aware: shows the
 * STORYBOOK_TELEMETRY_URL hint when there are zero events, and a
 * filter-clearing hint when filters hid everything.
 */

import { useEffect, useRef } from 'preact/hooks'
import { events, autoScroll } from '../store/signals'
import { matchesFilters } from '../lib/filters'
import { EventCard } from './EventCard'

function SessionSeparator({ sessionId, filteredOut }: { sessionId: string; filteredOut: boolean }) {
  return (
    <div
      class={'session-separator' + (filteredOut ? ' filtered-out' : '')}
      data-session-id={sessionId}
    >
      <span class="session-label">Session {sessionId.slice(0, 8)}</span>
    </div>
  )
}

export function EventList() {
  const all = events.value

  // Auto-scroll to bottom whenever new events arrive (and the toggle
  // is on). Tracks the previous count via a ref so we only scroll on
  // growth, never on filter changes.
  const containerRef = useRef<HTMLDivElement>(null)
  const lastCount = useRef(0)
  useEffect(() => {
    if (!autoScroll.value) {
      lastCount.current = all.length
      return
    }
    if (all.length > lastCount.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
    lastCount.current = all.length
  })

  // Build the interleaved children: session separator before each first
  // event of a session run, then the card. matchesFilters reads filter
  // signals directly so this component re-renders when filters change.
  const children: preact.JSX.Element[] = []
  let lastSession: string | null = null
  let anyVisible = false
  for (const ev of all) {
    const visible = matchesFilters(ev)
    if (visible) anyVisible = true
    if (ev.sessionId && ev.sessionId !== lastSession) {
      children.push(
        <SessionSeparator
          key={'sep-' + ev.sessionId + '-' + ev._index}
          sessionId={ev.sessionId}
          filteredOut={!visible}
        />,
      )
      lastSession = ev.sessionId
    }
    children.push(<EventCard key={ev._index} event={ev} />)
  }

  const isEmpty = all.length === 0
  const showEmptyHint = isEmpty || !anyVisible

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
