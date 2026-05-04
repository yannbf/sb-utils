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
import { cacheKeyOf, formatDelta, hasErrorPayload, summaryFor } from '../lib/event-helpers'
import { formatClockTime, formatRelTime } from '../lib/format'
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

  // Tab default + user-pick memory.
  //
  // - If the user has manually clicked a tab in this drawer session,
  //   honor that pick when the selected event changes — `userPickedTab`
  //   sticks until the user picks something else (or until the dashboard
  //   reloads). Falls back to the type-default if the new event doesn't
  //   have that tab (e.g. picked Metadata, next event has no metadata).
  // - Otherwise, telemetry events open on Payload (where the actual
  //   event content lives — that's what the user is here for 95% of
  //   the time). Cache events keep tabsFor()'s first entry, which is
  //   Diff.
  const tabs = useMemo(() => (ev ? tabsFor(ev) : []), [ev])
  const isCache = ev?._source === 'cache-watch'
  const isErrorEv = ev ? hasErrorPayload(ev) : false
  const [active, setActive] = useState(tabs[0]?.key ?? 'raw')
  const [userPickedTab, setUserPickedTab] = useState<string | null>(null)
  const pickTab = (key: string) => {
    setActive(key)
    setUserPickedTab(key)
  }
  useEffect(() => {
    if (tabs.length === 0) return
    // 1. Honor a sticky user pick if the new event has that tab.
    if (userPickedTab && tabs.some((t) => t.key === userPickedTab)) {
      setActive(userPickedTab)
      return
    }
    // 2. Telemetry default: Payload.
    if (!isCache && tabs.some((t) => t.key === 'payload')) {
      setActive('payload')
      return
    }
    // 3. Fall back to the first available tab if the current selection
    //    isn't one of them anymore (e.g. switching cache→telemetry).
    if (!tabs.some((t) => t.key === active)) setActive(tabs[0].key)
  }, [ev])

  // After the payload tab renders for an error event, scroll the
  // first error-keyed property into view inside the drawer body so
  // users land on the squiggle. Runs after layout (rAF) so the
  // .error-key element actually exists in the DOM, and uses the
  // drawer body as the scroll container so the tabs/header don't
  // scroll out of view.
  useEffect(() => {
    if (!ev || !isErrorEv || active !== 'payload') return
    const raf = requestAnimationFrame(() => {
      const body = document.getElementById('tlDrawerBody')
      const target = body?.querySelector('.error-key') as HTMLElement | null
      if (!body || !target) return
      const bodyRect = body.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      // Position the squiggle ~80px below the body's top so it's
      // visible but the surrounding context above is also readable.
      const desiredTopWithinBody = 80
      const delta = targetRect.top - bodyRect.top - desiredTopWithinBody
      body.scrollTop += delta
    })
    return () => cancelAnimationFrame(raf)
  }, [ev, isErrorEv, active])

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
  // `isCache` is declared earlier (alongside the tab default) — reused here.
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

  // ── Timing strip ──
  // Mirrors the canvas tooltip's clock / elapsed / since-prev fields so
  // the same numbers are reachable without hovering. "since selected"
  // is intentionally omitted: the drawer always shows the selected
  // event itself, so the row would always read "+0ms".
  //
  // `first` = earliest _receivedAt across ALL stored events (matches the
  // tooltip's `dataRange()[0]` semantics — elapsed is "into the run",
  // not "into the current filter set"). `prev` = previous same-lane
  // event in the navigable list, which already honors filters.
  let firstMs: number | null = null
  for (const e of all) {
    if (e._receivedAt == null) continue
    if (firstMs == null || e._receivedAt < firstMs) firstMs = e._receivedAt
  }
  const prev = pos > 0 ? list[pos - 1] : null
  const sincePrev =
    prev && prev._receivedAt != null && ev?._receivedAt != null
      ? formatDelta(ev._receivedAt - prev._receivedAt)
      : '—'
  const elapsed =
    ev?._receivedAt != null && firstMs != null
      ? '+' + formatRelTime(ev._receivedAt, firstMs, false)
      : '—'
  const clockTime = ev?._receivedAt != null ? formatClockTime(ev._receivedAt, true) : '—'

  return (
    <aside class={'tl-drawer' + (open ? ' open' : '') + (ev && hasErrorPayload(ev) ? ' error-event' : '')} id="tlDrawer">
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
            <>
              <span
                class="event-badge"
                style={{ background: color.bg, color: color.fg }}
              >
                {ev.eventType || 'unknown'}
              </span>
              {(() => {
                // Same payload-summary string the dashboard cards
                // and timeline tooltip use, e.g. "dev" for a boot
                // event with payload.eventType="dev". Renders as
                // muted text right after the badge.
                const summary = summaryFor(ev)
                return summary ? (
                  <span class="tl-drawer-summary">{summary}</span>
                ) : null
              })()}
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
      {ev && (
        <div class="tl-drawer-stats" aria-label="Event timing">
          <span class="tl-drawer-stat">
            <span class="tl-drawer-stat-k">time</span>
            <span class="tl-drawer-stat-v">{clockTime}</span>
          </span>
          <span class="tl-drawer-stat">
            <span class="tl-drawer-stat-k">elapsed</span>
            <span class="tl-drawer-stat-v">{elapsed}</span>
          </span>
          <span class="tl-drawer-stat">
            <span class="tl-drawer-stat-k">since prev</span>
            <span class="tl-drawer-stat-v">{sincePrev}</span>
          </span>
        </div>
      )}
      {ev && (
        // Tab strip lives OUTSIDE the scroll container so it stays
        // pinned at the top of the drawer while the user scrolls long
        // payloads. Was previously the first child of .tl-drawer-body
        // and scrolled away with the JSON tree. Click goes through
        // pickTab() so the user's selection sticks across navigation.
        <div class="event-tabs tl-drawer-tabs">
          {tabs.map((t) => (
            <div
              key={t.key}
              class={'event-tab' + (active === t.key ? ' active' : '')}
              data-tab={t.key}
              onClick={() => pickTab(t.key)}
            >
              {t.label}
            </div>
          ))}
        </div>
      )}
      <div class="tl-drawer-body" id="tlDrawerBody">
        {ev &&
          tabs.map((t) => (
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
                <JsonView
                  value={t.key === 'raw' ? ev : ((ev as any)[t.key] as unknown)}
                  highlightErrors={t.key === 'payload' && !isCache}
                />
              )}
            </div>
          ))}
      </div>
    </aside>
  )
}
