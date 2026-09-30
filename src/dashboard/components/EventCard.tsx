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
import { formatDelta, hasErrorPayload, summaryFor } from '../lib/event-helpers'
import { JsonView, JsonViewExpandToggle, type ForceMode } from './JsonView'
import { DiffView } from './DiffView'
import { CopyButton } from './CopyButton'

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

function TabPanel({
  event,
  tabKey,
  jsonMode,
  setJsonMode,
}: {
  event: StoredEvent
  tabKey: string
  jsonMode: ForceMode
  setJsonMode: (m: ForceMode) => void
}) {
  if (tabKey === 'diff') return <DiffView payload={event.payload as any} />
  const data = tabKey === 'raw' ? event : ((event as any)[tabKey] as unknown)
  // Only telemetry payload tabs get the red squiggle on error/fail
  // keys. Cache events are skipped (their content often carries
  // unrelated descriptive `error*` fields) and the other tabs
  // (metadata / context / raw) carry too many descriptive fields to
  // highlight without false positives.
  const highlight = tabKey === 'payload' && event._source !== 'cache-watch'
  // Controlled mode so the parent's sticky tab-tools row owns the
  // expand/collapse toggle alongside CopyButton.
  return (
    <JsonView
      value={data}
      highlightErrors={highlight}
      mode={jsonMode}
      setMode={setJsonMode}
    />
  )
}

// Same per-tab copy semantics as the TimelineDrawer: hand back the
// data each TabPanel actually renders. For raw, strip server-only
// bookkeeping (mirrors the row-level Copy button on the card header).
function copyValueFor(ev: StoredEvent, tabKey: string): unknown {
  if (tabKey === 'diff') return ev.payload
  if (tabKey === 'raw') {
    const { _index, _receivedAt, ...rest } = ev
    return rest
  }
  return (ev as any)[tabKey]
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
  const isError = hasErrorPayload(event)
  const summary = summaryFor(event)
  const tabs = tabsFor(event)

  const [active, setActive] = useState(tabs[0]?.key ?? 'raw')
  // JSON tree force-mode is owned at the card level so the sticky
  // tab-tools row's toggle stays in sync with the JsonView in the
  // active tab. Reset to default whenever the active tab changes
  // would be nicer, but the toggle re-syncs on render anyway.
  const [jsonMode, setJsonMode] = useState<ForceMode>('default')

  const toggleExpanded = () => {
    const next = new Set(expandedCards.value)
    if (next.has(idxStr)) next.delete(idxStr)
    else next.add(idxStr)
    expandedCards.value = next
  }

  // "Copied" flashes for the per-card Copy / cURL buttons. Mirrors
  // the icon CopyButton's behavior so users get the same visual
  // feedback whether they hit a text button or an icon button.
  const [copiedKind, setCopiedKind] = useState<'json' | 'curl' | null>(null)
  const flashCopied = (kind: 'json' | 'curl') => {
    setCopiedKind(kind)
    window.setTimeout(() => {
      setCopiedKind((k) => (k === kind ? null : k))
    }, 1200)
  }
  const copyJson = () => {
    const { _index, _receivedAt, ...rest } = event as StoredEvent
    void navigator.clipboard
      .writeText(JSON.stringify(rest, null, 2))
      .then(() => flashCopied('json'))
  }
  const copyCurl = () => {
    const { _index, _receivedAt, ...rest } = event as StoredEvent
    const url = location.origin + '/event-log'
    const body = JSON.stringify(rest)
    const cmd = `curl -X POST '${url}' -H 'Content-Type: application/json' -d '${body.replace(/'/g, "'\\''")}'`
    void navigator.clipboard.writeText(cmd).then(() => flashCopied('curl'))
  }

  return (
    <div
      class={
        'event-card' +
        (expanded ? ' expanded' : '') +
        (isCache ? ' cache-event' : '') +
        (isError ? ' error-event' : '')
      }
      data-event-type={event.eventType || ''}
      data-session-id={event.sessionId || ''}
      data-index={String(idx)}
      data-cache-event={isCache ? 'true' : undefined}
      data-source={isReconstructed ? 'cache-recon' : undefined}
      data-has-error={isError ? 'true' : undefined}
    >
      <div
        class="event-header"
        onClick={(e) => {
          // Allow text selection inside the header without expanding
          // the card on mouseup. If the user has just dragged a
          // selection, getSelection().isCollapsed is false — treat the
          // click as "finish selecting", not "toggle". A bare click on
          // text leaves the selection collapsed and toggles normally.
          const sel = typeof window !== 'undefined' ? window.getSelection?.() : null
          if (sel && !sel.isCollapsed) {
            const t = e.target as Node | null
            if (t && sel.containsNode(t, true)) return
          }
          toggleExpanded()
        }}
      >
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
            class={copiedKind === 'json' ? 'copied' : undefined}
            title={copiedKind === 'json' ? 'Copied!' : 'Copy JSON'}
            onClick={(e) => {
              e.stopPropagation()
              copyJson()
            }}
          >
            {copiedKind === 'json' ? '✓ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            class={copiedKind === 'curl' ? 'copied' : undefined}
            title={copiedKind === 'curl' ? 'Copied!' : 'Copy as cURL'}
            onClick={(e) => {
              e.stopPropagation()
              copyCurl()
            }}
          >
            {copiedKind === 'curl' ? '✓ Copied' : 'cURL'}
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
            {/*
              Sticky tools row: collapse/expand the JSON tree + copy
              the active tab's value. Lives at the top-right of the
              scroll container so both stay visible while the user
              scrolls long payloads. The Diff tab gets only the copy
              button — its content isn't a JSON tree.
            */}
            <div class="tab-tools">
              {active !== 'diff' && (
                <JsonViewExpandToggle
                  mode={jsonMode}
                  setMode={setJsonMode}
                  value={
                    active === 'raw'
                      ? event
                      : ((event as any)[active] as unknown)
                  }
                />
              )}
              <CopyButton getValue={() => copyValueFor(event, active)} title={`Copy ${active}`} />
            </div>
            <TabPanel
              event={event}
              tabKey={active}
              jsonMode={jsonMode}
              setJsonMode={setJsonMode}
            />
          </div>
        </div>
      )}
    </div>
  )
}
