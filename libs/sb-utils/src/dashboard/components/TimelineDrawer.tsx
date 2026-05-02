/**
 * Timeline drawer — slides in from the right when an event is selected
 * on the canvas. Reads `selectedTimelineEvent` signal; navigates
 * prev/next within the same session (or cache-watch lane). Replaces
 * the imperative drawer DOM the engine used to manage by ID; tab
 * content is now native Preact via <JsonView /> + <DiffView />.
 */

import { useEffect, useState, useMemo } from 'preact/hooks'
import { events, selectedTimelineEvent, type StoredEvent } from '../store/signals'
import { getColor } from '../lib/colors'
import { cacheKeyOf } from '../lib/event-helpers'
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

function navigableEventsFor(ev: StoredEvent, all: StoredEvent[]): StoredEvent[] {
  if (!ev) return []
  if (ev._source === 'cache-watch') {
    return all
      .filter((e) => e._source === 'cache-watch')
      .slice()
      .sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0))
  }
  if (ev.sessionId) {
    return all
      .filter((e) => e.sessionId === ev.sessionId)
      .slice()
      .sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0))
  }
  return []
}

export function TimelineDrawer() {
  const ev = selectedTimelineEvent.value
  const open = ev !== null

  // Tabs default to the first one available; reset when the selected
  // event changes (e.g. user navigates prev/next or clicks a different
  // dot on the canvas).
  const tabs = useMemo(() => (ev ? tabsFor(ev) : []), [ev])
  const [active, setActive] = useState(tabs[0]?.key ?? 'raw')
  useEffect(() => {
    if (tabs.length === 0) return
    if (!tabs.some((t) => t.key === active)) setActive(tabs[0].key)
  }, [ev])

  // ── Navigation ──
  const all = events.value
  const list = ev ? navigableEventsFor(ev, all) : []
  const pos = ev ? list.findIndex((e) => e._index === ev._index) : -1
  const canPrev = pos > 0
  const canNext = pos !== -1 && pos < list.length - 1
  const navigate = (dir: number) => {
    if (!ev) return
    const target = list[pos + dir]
    if (target) selectedTimelineEvent.value = target
  }

  const close = () => {
    selectedTimelineEvent.value = null
  }

  // ── Header content ──
  const color = ev ? getColor(ev.eventType || 'unknown') : { bg: '', fg: '' }
  const isCache = ev?._source === 'cache-watch'
  const isReconstructed = ev?._source === 'cache-recon'
  const subLabel = ev
    ? isCache
      ? cacheKeyOf(ev) || 'cache'
      : ev.sessionId
        ? ev.sessionId.slice(0, 8)
        : '—'
    : ''
  const drawerDisplayIdx = ev
    ? (() => {
        const p = all.indexOf(ev)
        return p >= 0 ? p + 1 : ev._index
      })()
    : 0

  const navLabel = isCache ? 'cache operation' : 'session'

  return (
    <aside class={'tl-drawer' + (open ? ' open' : '')} id="tlDrawer">
      <div class="tl-drawer-header">
        <div class="tl-drawer-title" id="tlDrawerTitle">
          {ev && (
            <>
              <span
                class="event-badge"
                style={{ background: color.bg, color: color.fg }}
              >
                {ev.eventType || 'unknown'}
              </span>
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
              <span style={{ color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                #{drawerDisplayIdx} · {subLabel}
              </span>
            </>
          )}
        </div>
        <div class="tl-drawer-nav">
          <button
            type="button"
            class="tl-drawer-btn"
            id="tlDrawerPrev"
            title={`Previous ${navLabel} (←)`}
            aria-label="Previous event"
            disabled={!canPrev}
            onClick={() => navigate(-1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span class="tl-drawer-pos" id="tlDrawerPos">
            {pos === -1 ? '' : `${pos + 1} / ${list.length}`}
          </span>
          <button
            type="button"
            class="tl-drawer-btn"
            id="tlDrawerNext"
            title={`Next ${navLabel} (→)`}
            aria-label="Next event"
            disabled={!canNext}
            onClick={() => navigate(1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            type="button"
            class="tl-drawer-close"
            id="tlDrawerClose"
            title="Close (Esc)"
            onClick={close}
          >
            ✕
          </button>
        </div>
      </div>
      <div class="tl-drawer-body" id="tlDrawerBody">
        {ev && (
          <>
            <div class="event-tabs">
              {tabs.map((t) => (
                <div
                  key={t.key}
                  class={'event-tab' + (active === t.key ? ' active' : '')}
                  data-tab={t.key}
                  onClick={() => setActive(t.key)}
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
                {t.key === 'diff' ? (
                  <DiffView payload={ev.payload as any} />
                ) : (
                  <JsonView value={t.key === 'raw' ? ev : ((ev as any)[t.key] as unknown)} />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  )
}
