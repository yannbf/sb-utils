/**
 * One event card. Header + body fully native Preact: tab content uses
 * <JsonView /> for payload/metadata/context/raw and <DiffView /> for
 * the cache:write Diff tab. No more dangerouslySetInnerHTML, no more
 * renderers bridge.
 */

import { useState } from 'preact/hooks'
import {
  events,
  expandAll,
  expandedCards,
  type StoredEvent,
} from '../store/signals'
import { getColor } from '../lib/colors'
import { formatDelta, getPreviousEventTime } from '../lib/event-helpers'
import { matchesFilters } from '../lib/filters'
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

export function EventCard({ event }: { event: StoredEvent }) {
  // Card-level expanded state: a card is expanded if Expand-All is on OR
  // the user explicitly toggled it (tracked in expandedCards signal).
  const idx = event._index != null ? event._index : events.value.indexOf(event)
  const idxStr = String(idx)
  const expanded = expandAll.value || expandedCards.value.has(idxStr)
  const all = events.value
  const pos = all.indexOf(event)
  const displayIdx = pos >= 0 ? pos + 1 : idx

  const time = event._receivedAt ? new Date(event._receivedAt).toLocaleTimeString() : ''
  const color = getColor(event.eventType || 'unknown')
  const sessionShort = event.sessionId ? event.sessionId.slice(0, 8) : ''
  const deltaMs = getPreviousEventTime(event, all)
  const deltaStr = deltaMs != null ? formatDelta(deltaMs) : ''

  const isCache = event._source === 'cache-watch'
  const isReconstructed = event._source === 'cache-recon'
  const summary = summaryFor(event)
  const tabs = tabsFor(event)
  const matched = matchesFilters(event)

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
        (matched ? '' : ' filtered-out') +
        (isCache ? ' cache-event' : '')
      }
      data-event-type={event.eventType || ''}
      data-session-id={event.sessionId || ''}
      data-index={String(idx)}
      data-search-text={JSON.stringify(event).toLowerCase()}
      data-cache-event={isCache ? 'true' : undefined}
      data-source={isReconstructed ? 'cache-recon' : undefined}
    >
      <div class="event-header" onClick={toggleExpanded}>
        <span class="expand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
        <span class="event-index">#{displayIdx}</span>
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
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15A9 9 0 1 1 5.64 5.64L23 10" />
            </svg>
            cache
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
        {tabs.map((t) => (
          <div
            key={t.key}
            class="event-tab-content"
            data-tab-content={t.key}
            style={active === t.key ? undefined : { display: 'none' }}
          >
            <TabPanel event={event} tabKey={t.key} />
          </div>
        ))}
      </div>
    </div>
  )
}
