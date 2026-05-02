/**
 * One event card. Header + body fully native Preact: tab content uses
 * <JsonView /> for payload/metadata/context/raw and <DiffView /> for
 * the cache:write Diff tab. No more dangerouslySetInnerHTML, no more
 * renderers bridge.
 */

import { useState } from 'preact/hooks'
import {
  expandAll,
  expandedCards,
  type StoredEvent,
} from '../store/signals'
import { getColor } from '../lib/colors'
import { formatDelta } from '../lib/event-helpers'
import { JsonView } from './JsonView'
import { DiffView } from './DiffView'

type Tab = { key: string; label: string }

function tabsFor(ev: StoredEvent): Tab[] {
  const isCache = ev._source === 'cache-watch'
  const tabs: Tab[] = []
  if (isCache) tabs.push({ key: 'diff', label: 'Diff' })
  if (ev.payload && Object.keys(ev.payload).length > 0) tabs.push({ key: 'payload', label: 'Payload' })
  if (ev.metadata && Object.keys(ev.metadata).length > 0) tabs.push({ key: 'metadata', label: 'Metadata' })
  if (ev.context && Object.keys(ev.context).length > 0) tabs.push({ key: 'context', label: 'Context' })
  tabs.push({ key: 'raw', label: 'Raw' })
  return tabs
}

function summaryFor(ev: StoredEvent): string {
  if (ev._source === 'cache-watch' && ev.payload) {
    const p = ev.payload as Record<string, unknown>
    return (p.namespace || '') + '/' + (p.key || '')
  }
  const parts: string[] = []
  const p = ev.payload as Record<string, unknown> | undefined
  if (p) {
    if (p.eventType) parts.push(String(p.eventType))
    if (p.type) parts.push(String(p.type))
    if (p.name) parts.push(String(p.name))
    if (p.status) parts.push(String(p.status))
    if (p.error) {
      const err = p.error as { message?: string } | string
      parts.push(
        'error: ' +
          (typeof err === 'string' ? err : err && err.message ? err.message : 'unknown'),
      )
    }
  }
  return parts.join(' · ')
}

function TabPanel({ event, tabKey }: { event: StoredEvent; tabKey: string }) {
  if (tabKey === 'diff') return <DiffView payload={event.payload as any} />
  const data = tabKey === 'raw' ? event : ((event as any)[tabKey] as unknown)
  return <JsonView value={data} />
}

export function EventCard({
  event,
  displayIdx,
  prevVisible,
}: {
  event: StoredEvent
  /**
   * Position among the visible (filter-matching) events, 1-based. The
   * #N tag in the card header shows this — so hiding cache events
   * leaves telemetry numbered 1, 2, 3 instead of 1, 4, 6.
   */
  displayIdx?: number
  /**
   * The previous visible event in chronological order, used to render
   * the +Xms delta. Null = this is the first visible event.
   */
  prevVisible?: StoredEvent | null
}) {
  // Card-level expanded state: a card is expanded if Expand-All is on OR
  // the user explicitly toggled it (tracked in expandedCards signal).
  const idx = event._index != null ? event._index : 0
  const idxStr = String(idx)
  const expanded = expandAll.value || expandedCards.value.has(idxStr)
  // Never expose the raw _index in the UI: synthetic events use a
  // 1e9-range counter (kept opaque, just a stable id) which would
  // render as "#1000000007".
  const shownIdx = displayIdx ?? 0

  const time = event._receivedAt ? new Date(event._receivedAt).toLocaleTimeString() : ''
  const color = getColor(event.eventType || 'unknown')
  const sessionShort = event.sessionId ? event.sessionId.slice(0, 8) : ''
  const deltaMs =
    prevVisible && prevVisible._receivedAt && event._receivedAt
      ? event._receivedAt - prevVisible._receivedAt
      : null
  const deltaStr = deltaMs != null ? formatDelta(deltaMs) : ''

  const isCache = event._source === 'cache-watch'
  const isReconstructed = event._source === 'cache-recon'
  const summary = summaryFor(event)
  const tabs = tabsFor(event)

  const [active, setActive] = useState(tabs[0]?.key ?? 'raw')

  const toggleExpanded = () => {
    const next = new Set(expandedCards.value)
    if (next.has(idxStr)) next.delete(idxStr)
    else next.add(idxStr)
    expandedCards.value = next
  }

  const copyJson = () => {
    const { _index, _receivedAt, ...rest } = event as StoredEvent
    void navigator.clipboard.writeText(JSON.stringify(rest, null, 2))
  }
  const copyCurl = () => {
    const { _index, _receivedAt, ...rest } = event as StoredEvent
    const url = location.origin + '/event-log'
    const body = JSON.stringify(rest)
    const cmd = `curl -X POST '${url}' -H 'Content-Type: application/json' -d '${body.replace(/'/g, "'\\''")}'`
    void navigator.clipboard.writeText(cmd)
  }

  return (
    <div
      class={
        'event-card' +
        (expanded ? ' expanded' : '') +
        (isCache ? ' cache-event' : '')
      }
      data-event-type={event.eventType || ''}
      data-session-id={event.sessionId || ''}
      data-index={String(idx)}
      data-cache-event={isCache ? 'true' : undefined}
      data-source={isReconstructed ? 'cache-recon' : undefined}
    >
      <div class="event-header" onClick={toggleExpanded}>
        <span class="expand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
        <span class="event-index">#{shownIdx}</span>
        <span
          class="event-badge"
          style={{ background: color.bg, color: color.fg }}
        >
          {event.eventType || 'unknown'}
        </span>
        <span class="event-summary">{summary}</span>
        {isReconstructed && (
          <span
            class="event-recon-badge"
            title="Reconstructed from a lastEvents cache write — STORYBOOK_TELEMETRY_URL was not set"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
            </svg>
            from cache
          </span>
        )}
        {sessionShort && <span class="event-session">{sessionShort}</span>}
        <span class="event-time-group">
          {deltaStr && <span class="event-delta">{deltaStr}</span>}
          <span class="event-time">{time}</span>
        </span>
        <div class="event-actions">
          <button
            type="button"
            title="Copy JSON"
            onClick={(e) => {
              e.stopPropagation()
              copyJson()
            }}
          >
            Copy
          </button>
          <button
            type="button"
            title="Copy as cURL"
            onClick={(e) => {
              e.stopPropagation()
              copyCurl()
            }}
          >
            cURL
          </button>
        </div>
      </div>
      {expanded && (
        <div class="event-body">
          <div class="event-tabs">
            {tabs.map((t) => (
              <div
                key={t.key}
                class={'event-tab' + (active === t.key ? ' active' : '')}
                data-tab={t.key}
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(t.key)
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
          <div class="event-tab-content" data-tab-content={active}>
            <TabPanel event={event} tabKey={active} />
          </div>
        </div>
      )}
    </div>
  )
}
