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
import { matchesFilters } from '../lib/filters'
import { navigableEventsFor } from '../lib/timeline-math'
import { JsonView } from './JsonView'
import { DiffView } from './DiffView'
import { CopyButton } from './CopyButton'

type Tab = { key: string; label: string }

// What the per-tab copy button puts on the clipboard. Mirrors the
// data each TabPanel renders so users get exactly what they see —
// payload/metadata/context for the named tab, the underlying cache
// payload for diff (the diff view itself isn't JSON-serializable),
// and the full event minus server-only bookkeeping for raw.
function copyValueFor(ev: StoredEvent, tabKey: string): unknown {
  if (tabKey === 'diff') return ev.payload
  if (tabKey === 'raw') {
    const { _index, _receivedAt, ...rest } = ev
    return rest
  }
  return (ev as any)[tabKey]
}

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
  // Honor the active sidebar filters so prev/next can't land on a dot
  // the user has hidden. The selected event itself stays in the list
  // even if it'd be filtered out (so its position lookup is stable).
  const all = events.value
  const list = ev ? navigableEventsFor(ev, all, matchesFilters) : []
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
  // Visible-only index: reflect ordering among events that pass the
  // current filters, so #N matches the dashboard cards. If the
  // selected event is itself filtered out (uncommon), fall back to its
  // 1-based position in the full list — never the raw _index, which
  // for synthetic events is a 1e9-range counter and would render as
  // "#1000000007" in the UI.
  const drawerDisplayIdx = ev
    ? (() => {
        let n = 0
        for (const e of all) {
          if (!matchesFilters(e)) continue
          n++
          if (e === ev) return n
        }
        const p = all.indexOf(ev)
        return p >= 0 ? p + 1 : 0
      })()
    : 0

  const navLabel = isCache ? 'cache operation' : 'session'

  return (
    <aside class={'tl-drawer' + (open ? ' open' : '')} id="tlDrawer">
      {ev && (
        <span class="tl-drawer-meta">
          <span class="tl-drawer-meta-id" aria-hidden="true">
            #{drawerDisplayIdx} · {subLabel}
          </span>
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
        </span>
      )}
      <div class="tl-drawer-header">
        <div class="tl-drawer-title" id="tlDrawerTitle">
          {ev && (
            <span
              class="event-badge"
              style={{ background: color.bg, color: color.fg }}
            >
              {ev.eventType || 'unknown'}
            </span>
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
                <CopyButton getValue={() => copyValueFor(ev, t.key)} title={`Copy ${t.label}`} />
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
