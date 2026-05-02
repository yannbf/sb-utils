/**
 * Main event list — renders cards interleaved with session separators.
 * The "filtered out" / "no events" empty state is mode-aware: shows the
 * STORYBOOK_TELEMETRY_URL hint when there are zero events, and a
 * filter-clearing hint when filters hid everything.
 */

import { useEffect, useRef } from 'preact/hooks'
import { events, autoScroll, type StoredEvent } from '../store/signals'
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
      lastCount.current = all.length
      return
    }
    if (!autoScroll.value) {
      lastCount.current = all.length
      return
    }
    const added = all.length - lastCount.current
    if (added > 0 && added <= LIVE_BATCH_MAX && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
    lastCount.current = all.length
  })

  // Pre-compute the filter result once: each EventCard needs to know
  // its position among the *visible* events (so #N renders 1, 2, 3
  // even when cache-only events are hidden) plus the previous visible
  // event in chronological order (so the +Xms delta isn't measured
  // from an event the user can't see).
  const visibleSet = new Set<number>()
  let visibleCount = 0
  let anyVisible = false
  const visibleIdxOf = new Map<number, number>()
  const prevVisibleOf = new Map<number, StoredEvent>()
  let lastVisible: StoredEvent | null = null
  for (const ev of all) {
    const visible = matchesFilters(ev)
    if (!visible) continue
    anyVisible = true
    visibleSet.add(ev._index)
    visibleCount++
    visibleIdxOf.set(ev._index, visibleCount)
    if (lastVisible) prevVisibleOf.set(ev._index, lastVisible)
    lastVisible = ev
  }

  // Build the interleaved children: session separator before each first
  // event of a session run, then the card.
  const children: preact.JSX.Element[] = []
  let lastSession: string | null = null
  for (const ev of all) {
    const visible = visibleSet.has(ev._index)
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
    children.push(
      <EventCard
        key={ev._index}
        event={ev}
        displayIdx={visibleIdxOf.get(ev._index)}
        prevVisible={prevVisibleOf.get(ev._index) ?? null}
      />,
    )
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
