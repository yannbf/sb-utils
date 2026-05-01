/**
 * Sidebar — reactive Preact rendering of the four data-driven sections
 * (Event Types, Cache Operations, Sessions, Imports) plus the static
 * Shortcuts list. Reads signal state for counts/visibility/active flags
 * and dispatches user actions through the legacy action bridge until
 * the imperative core is gone.
 */

import {
  events,
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
  typeCounts,
  sessionMap,
  cacheMap,
  imports,
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

// ── Event Types ──
function EventTypesSection() {
  const counts = typeCounts.value
  const total = events.value.filter((e) => e._source !== 'cache-watch').length
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
        >
          <div class="label-row" onClick={() => actions().setFilter('all')}>
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
            >
              <div class="label-row" onClick={() => actions().setFilter(type)}>
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

// ── Cache Operations ──
function CacheOpsSection() {
  const map = cacheMap.value
  const allHidden = cacheAllHidden.value
  const hidden = hiddenCacheKeys.value
  const active = activeCacheKey.value
  const total = events.value.filter((e) => e._source === 'cache-watch').length
  const keys = Object.keys(map).sort()
  const isAllActive = active === null

  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title">Cache Operations</div>
      <div id="cacheList">
        <div
          class={'filter-item' + (isAllActive ? ' active' : '') + (allHidden ? ' hidden-item' : '')}
          data-cache-key="__all__"
        >
          <div class="label-row" onClick={() => actions().setActiveCacheKey(null)}>
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
        {keys.length === 0 ? (
          <div class="sessions-empty" id="cacheListEmpty">
            No cache operations yet
          </div>
        ) : (
          keys.map((key) => {
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
              >
                <div class="label-row" onClick={() => actions().setActiveCacheKey(key)}>
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
          })
        )}
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
              >
                <div
                  class="label-row"
                  onClick={() => actions().setSession(isActive ? null : sid)}
                >
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
            >
              <div
                class="label-row"
                onClick={() => actions().setActiveImport(isActive ? null : b.id)}
              >
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
