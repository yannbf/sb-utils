/**
 * Sidebar — reactive Preact rendering of the four data-driven sections
 * (Event Types, Cache Operations, Sessions, Imports) plus the static
 * Shortcuts list. Reads signal state for counts/visibility/active flags
 * and dispatches user actions through the legacy action bridge until
 * the imperative core is gone.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import {
  activeFilter,
  activeSession,
  activeImport,
  activeCacheKey,
  hiddenTypes,
  hiddenSessions,
  hiddenImports,
  hiddenCacheKeys,
  cacheAllHidden,
  telemetryAllHidden,
  reconstructFromCache,
  showStaleCache,
  staleCacheCount,
  typeCounts,
  sessionMap,
  cacheMap,
  imports,
  telemetryCount,
  cacheCount,
} from '../store/signals'
import { actions } from '../store/actions'
import { getColor } from '../lib/colors'

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)
const GearIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

// ── Event Types ──
function EventTypesSection() {
  const counts = typeCounts.value
  const total = telemetryCount.value
  const hidden = hiddenTypes.value
  const allHidden = telemetryAllHidden.value
  const isAllActive = activeFilter.value === 'all'
  const types = Object.keys(counts).filter((t) => {
    // Don't list cache:write/cache:delete in the Event Types section —
    // they live in the Cache Operations section.
    return !['cache:write', 'cache:delete'].includes(t)
  })

  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title">Event Types</div>
      <div id="filterList">
        <div
          class={'filter-item' + (isAllActive ? ' active' : '') + (allHidden ? ' hidden-item' : '')}
          data-filter="all"
          onClick={() => actions().setFilter('all')}
        >
          <div class="label-row">
            <span>All events</span>
          </div>
          <div class="item-actions">
            <button
              class="item-action danger trash-btn"
              id="eventsAllTrashBtn"
              title="Delete all telemetry events"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Delete all telemetry events? Cache operations are kept.')) {
                  actions().deleteAllTelemetryEvents()
                }
              }}
            >
              <TrashIcon />
            </button>
            <button
              class="item-action eye-btn"
              id="eventsAllEyeBtn"
              title="Hide all telemetry events"
              onClick={(e) => {
                e.stopPropagation()
                actions().toggleTelemetryAllHidden()
              }}
            >
              {allHidden ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <span class="count" id="countAll">
            {total}
          </span>
        </div>
        {types.map((type) => {
          const isActive = activeFilter.value === type
          const isHidden = hidden.has(type)
          const color = getColor(type)
          return (
            <div
              key={type}
              class={
                'filter-item' + (isActive ? ' active' : '') + (isHidden ? ' hidden-item' : '')
              }
              data-filter={type}
              onClick={() => actions().setFilter(type)}
            >
              <div class="label-row">
                <span class="dot" style={{ background: color.fg }} />
                <span>{type}</span>
              </div>
              <div class="item-actions">
                <button
                  class="item-action danger trash-btn"
                  title="Delete all events of this type"
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().deleteEventsByType(type)
                  }}
                >
                  <TrashIcon />
                </button>
                <button
                  class="item-action eye-btn"
                  title={isHidden ? 'Show this event type' : 'Hide this event type'}
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().toggleHiddenType(type)
                  }}
                >
                  {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span class="count">{counts[type]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Small popover anchored to the gear button. Closes on outside click
// or Escape. Holds the per-section toggles that aren't worth a top-level
// row in the sidebar.
//
// Uses position: fixed with computed coords so it can render outside
// the sidebar's overflow:auto clip — without that, a 260px-wide menu
// hanging off a 230px sidebar gets cut.
function CacheOpsMenu({
  anchor,
  onClose,
}: {
  anchor: HTMLElement
  onClose: () => void
}) {
  const reconstruct = reconstructFromCache.value
  const stale = showStaleCache.value
  const staleCount = staleCacheCount.value
  // The "Show stale cache data" row only renders when stale entries
  // actually exist OR the toggle is currently on (so the user can
  // turn it off). If we hid it on `stale=true && staleCount==0`
  // there'd be no way to flip it back.
  const showStaleRow = staleCount > 0 || stale
  const ref = useRef<HTMLDivElement>(null)
  const rect = anchor.getBoundingClientRect()
  // Left-align the menu's left edge with the anchor (gear) and open
  // downward. Falls back to right-aligning if the menu would overflow
  // the right viewport edge.
  const MENU_W = 280
  const left = Math.min(rect.left, window.innerWidth - MENU_W - 8)
  // Start the menu just below the anchor; useLayoutEffect below will
  // flip it above (and/or clamp it inside the viewport) once we know
  // its rendered height. This matters when the sidebar is tall enough
  // to push the gear button down so the menu would otherwise hang off
  // the bottom of the screen — happens with cache fixtures that emit
  // many event types.
  const initialTop = rect.bottom + 6
  const [top, setTop] = useState(initialTop)

  useLayoutEffect(() => {
    if (!ref.current) return
    const menuH = ref.current.getBoundingClientRect().height
    const VIEWPORT_PAD = 8
    const fitsBelow = rect.bottom + 6 + menuH <= window.innerHeight - VIEWPORT_PAD
    if (fitsBelow) {
      setTop(rect.bottom + 6)
      return
    }
    // Try opening above the anchor.
    const above = rect.top - 6 - menuH
    if (above >= VIEWPORT_PAD) {
      setTop(above)
      return
    }
    // Neither side fits — clamp inside the viewport so the toggles
    // stay clickable. Worst case we cover the gear, which is fine
    // since the user is already interacting with the menu.
    setTop(Math.max(VIEWPORT_PAD, window.innerHeight - menuH - VIEWPORT_PAD))
  }, [rect.bottom, rect.top])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (ref.current.contains(e.target as Node)) return
      if (anchor.contains(e.target as Node)) return
      onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, anchor])

  return (
    <div
      class="cache-ops-menu"
      ref={ref}
      role="menu"
      aria-label="Cache options"
      style={{ left: `${Math.max(8, left)}px`, top: `${top}px`, width: `${MENU_W}px` }}
    >
      <label class="cache-ops-menu-row">
        <span class="cache-ops-menu-label">
          <span class="cache-ops-menu-title">Reconstruct telemetry from cache</span>
          <span class="cache-ops-menu-hint">
            Replays Storybook's <code>lastEvents</code> cache as synthetic
            telemetry until real events arrive.
          </span>
        </span>
        <button
          type="button"
          class={'cache-ops-toggle' + (reconstruct ? ' on' : '')}
          role="switch"
          aria-checked={reconstruct}
          onClick={() => actions().setReconstructFromCache(!reconstruct)}
        >
          <span class="cache-ops-toggle-knob" />
        </button>
      </label>
      {showStaleRow && (
        <label class="cache-ops-menu-row">
          <span class="cache-ops-menu-label">
            <span class="cache-ops-menu-title">
              Show stale cache data
              {staleCount > 0 && (
                <span class="cache-ops-menu-pill">
                  {staleCount} {staleCount === 1 ? 'entry' : 'entries'} detected
                </span>
              )}
            </span>
            <span class="cache-ops-menu-hint">
              {staleCount > 0
                ? `${staleCount} cache ${staleCount === 1 ? 'entry was' : 'entries were'} written before this session started. Toggle on to surface ${staleCount === 1 ? 'it' : 'them'}.`
                : 'Cache entries written before this session started are hidden by default.'}
            </span>
          </span>
          <button
            type="button"
            class={'cache-ops-toggle' + (stale ? ' on' : '')}
            role="switch"
            aria-checked={stale}
            onClick={() => actions().setShowStaleCache(!stale)}
          >
            <span class="cache-ops-toggle-knob" />
          </button>
        </label>
      )}
    </div>
  )
}

// ── Cache Operations ──
function CacheOpsSection() {
  const map = cacheMap.value
  const allHidden = cacheAllHidden.value
  const hidden = hiddenCacheKeys.value
  const active = activeCacheKey.value
  const total = cacheCount.value
  const keys = Object.keys(map).sort()
  const isAllActive = active === null
  const [menuOpen, setMenuOpen] = useState(false)
  const gearRef = useRef<HTMLButtonElement>(null)
  // Two badge variants on the gear icon:
  //   - 'modified' (blue): a cache option toggle is on, signaling the
  //     pipeline is in a non-default state.
  //   - 'attention' (yellow): stale cache data exists but no toggle
  //     is on — the user might be missing pre-existing data they'd
  //     want to surface, so we nudge them toward the gear.
  const hasModified = reconstructFromCache.value || showStaleCache.value
  const hasStaleAttention = !hasModified && staleCacheCount.value > 0
  const gearClass =
    'cache-ops-gear' +
    (menuOpen ? ' open' : '') +
    (hasModified ? ' modified' : '') +
    (hasStaleAttention ? ' attention' : '')
  const gearTitle = hasModified
    ? 'Cache options (modified from defaults)'
    : hasStaleAttention
      ? `Cache options (${staleCacheCount.value} stale ${staleCacheCount.value === 1 ? 'entry' : 'entries'} detected)`
      : 'Cache options'

  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title cache-ops-title">
        <span>Cache Operations</span>
        <button
          type="button"
          ref={gearRef}
          class={gearClass}
          id="cacheOpsGearBtn"
          title={gearTitle}
          aria-label="Cache options"
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
        >
          <GearIcon />
          {(hasModified || hasStaleAttention) && (
            <span class="cache-ops-gear-dot" aria-hidden="true" />
          )}
        </button>
        {menuOpen && gearRef.current && (
          <CacheOpsMenu anchor={gearRef.current} onClose={() => setMenuOpen(false)} />
        )}
      </div>
      <div id="cacheList">
        <div
          class={'filter-item' + (isAllActive ? ' active' : '') + (allHidden ? ' hidden-item' : '')}
          data-cache-key="__all__"
          onClick={() => actions().setActiveCacheKey(null)}
        >
          <div class="label-row">
            <span>All operations</span>
          </div>
          <div class="item-actions">
            <button
              class="item-action danger trash-btn"
              id="cacheAllTrashBtn"
              title="Delete all cache events"
              onClick={(e) => {
                e.stopPropagation()
                actions().deleteAllCacheEvents()
              }}
            >
              <TrashIcon />
            </button>
            <button
              class="item-action eye-btn"
              id="cacheAllEyeBtn"
              title="Hide all cache events"
              onClick={(e) => {
                e.stopPropagation()
                actions().toggleCacheAllHidden()
              }}
            >
              {allHidden ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <span class="count" id="cacheAllCount">
            {total}
          </span>
        </div>
        {keys.map((key) => {
          const info = map[key]
          const isActive = active === key
          const isHidden = hidden.has(key)
          return (
            <div
              key={key}
              class={
                'filter-item' +
                (isActive ? ' active' : '') +
                (isHidden ? ' hidden-item' : '')
              }
              data-cache-key={key}
              onClick={() => actions().setActiveCacheKey(key)}
            >
              <div class="label-row">
                <span>{key}</span>
              </div>
              {info.lastOp && <div class="filter-item-sub">{info.lastOp}</div>}
              <div class="item-actions">
                <button
                  class="item-action danger trash-btn"
                  title="Delete events for this cache key"
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().deleteEventsByCacheKey(key)
                  }}
                >
                  <TrashIcon />
                </button>
                <button
                  class="item-action eye-btn"
                  title={isHidden ? 'Show this cache key' : 'Hide this cache key'}
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().toggleHiddenCacheKey(key)
                  }}
                >
                  {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span class="count">{info.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Sessions ──
function SessionsSection() {
  const map = sessionMap.value
  const hidden = hiddenSessions.value
  const active = activeSession.value
  const sids = Object.keys(map).sort((a, b) => map[a].firstSeen - map[b].firstSeen)

  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title">Sessions</div>
      <div id="sessionList">
        {sids.length === 0 ? (
          <div class="sessions-empty" id="sessionsEmpty">
            No sessions yet
          </div>
        ) : (
          sids.map((sid) => {
            const isActive = active === sid
            const isHidden = hidden.has(sid)
            const label = sid.length > 20 ? sid.slice(0, 18) + '…' : sid
            return (
              <div
                key={sid}
                class={
                  'filter-item' +
                  (isActive ? ' active' : '') +
                  (isHidden ? ' hidden-item' : '')
                }
                data-session={sid}
                onClick={() => actions().setSession(isActive ? null : sid)}
              >
                <div class="label-row">
                  <span>{label}</span>
                </div>
                <div class="item-actions">
                  <button
                    class="item-action danger trash-btn"
                    title="Delete events for this session"
                    onClick={(e) => {
                      e.stopPropagation()
                      actions().deleteEventsBySession(sid)
                    }}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    class="item-action eye-btn"
                    title={isHidden ? 'Show this session' : 'Hide this session'}
                    onClick={(e) => {
                      e.stopPropagation()
                      actions().toggleHiddenSession(sid)
                    }}
                  >
                    {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <span class="count">{map[sid].count}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Imports ──
function ImportsSection() {
  const list = imports.value
  if (list.length === 0) {
    return <div class="sidebar-section" id="importsSection" style={{ display: 'none' }} />
  }
  const active = activeImport.value
  const hidden = hiddenImports.value
  return (
    <div class="sidebar-section" id="importsSection">
      <div class="sidebar-section-title">
        <span>Imports</span>
        <span class="sidebar-section-hint" id="importsHint">
          Drop a .json file anywhere
        </span>
      </div>
      <div id="importList">
        {list.map((b) => {
          const isActive = active === b.id
          const isHidden = hidden.has(b.id)
          return (
            <div
              key={b.id}
              class={
                'filter-item' + (isActive ? ' active' : '') + (isHidden ? ' hidden-item' : '')
              }
              data-import={b.id}
              onClick={() => actions().setActiveImport(isActive ? null : b.id)}
            >
              <div class="label-row">
                <span>{b.name}</span>
              </div>
              <div class="item-actions">
                <button
                  class="item-action danger trash-btn"
                  title="Delete imported events"
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().deleteEventsByImport(b.id)
                  }}
                >
                  <TrashIcon />
                </button>
                <button
                  class="item-action eye-btn"
                  title={isHidden ? 'Show this import' : 'Hide this import'}
                  onClick={(e) => {
                    e.stopPropagation()
                    actions().toggleHiddenImport(b.id)
                  }}
                >
                  {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ShortcutsSection() {
  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title">Shortcuts</div>
      <div class="shortcuts-list">
        <div class="shortcut-row">
          <kbd class="kbd">Space</kbd> Pause / Resume
        </div>
        <div class="shortcut-row">
          <kbd class="kbd">/</kbd> Search
        </div>
        <div class="shortcut-row">
          <kbd class="kbd">Esc</kbd> Clear search
        </div>
        <div class="shortcut-row">
          <kbd class="kbd">E</kbd> Expand / Collapse
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <div class="sidebar">
      <EventTypesSection />
      <CacheOpsSection />
      <SessionsSection />
      <ImportsSection />
      <ShortcutsSection />
    </div>
  )
}
