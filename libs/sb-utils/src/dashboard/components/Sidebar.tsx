/**
 * Sidebar — reactive Preact rendering of the four data-driven sections
 * (Event Types, Cache Operations, Sessions, Imports) plus the static
 * Shortcuts list. Reads signal state for counts/visibility/active flags
 * and dispatches user actions through the legacy action bridge until
 * the imperative core is gone.
 */

import {
  activeFilter,
  activeSession,
  activeImport,
  hiddenTypes,
  hiddenSessions,
  hiddenImports,
  cacheAllHidden,
  reconstructFromCache,
  showStaleCache,
  staleCacheCount,
  typeCounts,
  sessionMap,
  imports,
  telemetryCount,
  cacheOperationsCount,
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
  const total = telemetryCount.value
  const hidden = hiddenTypes.value
  const isAllActive = activeFilter.value === 'all'
  const types = Object.keys(counts).filter((t) => {
    // Don't list cache:write/cache:delete in the Event Types section —
    // they live in the Cache Operations section.
    return !['cache:write', 'cache:delete'].includes(t)
  })
  // "All hidden" derives from individual hidden state so the master
  // eye and the per-row eyes always agree. Lets the user click
  // "Hide all" to populate `hiddenTypes` with every type, then click
  // a single row to un-hide just that one — the "isolate" gesture.
  const allHidden = types.length > 0 && types.every((t) => hidden.has(t))

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
              title={allHidden ? 'Show all telemetry events' : 'Hide all telemetry events'}
              onClick={(e) => {
                e.stopPropagation()
                actions().toggleAllEventTypesHidden()
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
// ── Cache Operations ──
// The whole section is just a stack of toggles — no per-cache-key list,
// no aggregate "All operations" row, no popover. The three toggles
// default OFF, so a fresh dashboard is opt-in for cache visibility,
// reconstruction, and stale data — surfacing each only when the user
// asks for it.
function CacheOpsSection() {
  const showOps = !cacheAllHidden.value
  const reconstruct = reconstructFromCache.value
  const stale = showStaleCache.value
  const staleCount = staleCacheCount.value
  // Count the OPERATIONS the user would see on flipping the toggle
  // on — that's events, not entries-on-disk. A single entry can be
  // touched many times and each touch is its own row. cacheOperationsCount
  // already reflects the current staleness state (events.value is
  // re-filtered on stale toggle, ingestion drops stale by default).
  const opsCount = cacheOperationsCount.value
  // The "Show stale cache data" row only renders when stale entries
  // actually exist OR the toggle is currently on (so the user can
  // turn it off). If we hid it on `stale=true && staleCount==0`
  // there'd be no way to flip it back.
  const showStaleRow = staleCount > 0 || stale

  return (
    <div class="sidebar-section">
      <div class="sidebar-section-title">Cache Operations</div>
      <div class="cache-ops-toggles" id="cacheOpsToggles">
        <CacheOpsToggle
          id="cacheOpsShowToggle"
          title="Show cache operations"
          pill={
            opsCount > 0
              ? `${opsCount} ${opsCount === 1 ? 'operation' : 'operations'} detected`
              : null
          }
          hint="Surface cache:write / cache:delete events in the dashboard, timeline, and counts."
          on={showOps}
          onToggle={() => actions().toggleCacheAllHidden()}
        />
        {showStaleRow && (
          <CacheOpsToggle
            id="cacheOpsStaleToggle"
            title="Show stale cache data"
            pillTone="warning"
            pill={
              staleCount > 0
                ? `${staleCount} ${staleCount === 1 ? 'entry' : 'entries'} detected`
                : null
            }
            hint={
              staleCount > 0
                ? `${staleCount} cache ${staleCount === 1 ? 'entry was' : 'entries were'} written before this session started. Toggle on to surface ${staleCount === 1 ? 'it' : 'them'}.`
                : 'Cache entries written before this session started are hidden by default.'
            }
            on={stale}
            onToggle={() => actions().setShowStaleCache(!stale)}
          />
        )}
        <CacheOpsToggle
          id="cacheOpsReconstructToggle"
          title="Reconstruct telemetry from cache"
          hint={
            <>
              Replays Storybook's <code>lastEvents</code> cache as synthetic
              telemetry until real events arrive.
            </>
          }
          on={reconstruct}
          onToggle={() => actions().setReconstructFromCache(!reconstruct)}
        />
      </div>
    </div>
  )
}

function CacheOpsToggle({
  id,
  title,
  hint,
  pill,
  pillTone = 'info',
  on,
  onToggle,
}: {
  id: string
  title: string
  hint: preact.ComponentChildren
  pill?: string | null
  /** `info` (blue, default) for neutral counts like "N entries
   * detected" on the cache-ops toggle. `warning` (yellow) for
   * states the user might want to act on, like stale data. */
  pillTone?: 'info' | 'warning'
  on: boolean
  onToggle: () => void
}) {
  return (
    <label class="cache-ops-menu-row">
      <span class="cache-ops-menu-label">
        <span class="cache-ops-menu-title">
          {title}
          {pill && (
            <span class={'cache-ops-menu-pill cache-ops-menu-pill-' + pillTone}>
              {pill}
            </span>
          )}
        </span>
        <span class="cache-ops-menu-hint">{hint}</span>
      </span>
      <button
        type="button"
        id={id}
        class={'cache-ops-toggle' + (on ? ' on' : '')}
        role="switch"
        aria-checked={on}
        onClick={onToggle}
      >
        <span class="cache-ops-toggle-knob" />
      </button>
    </label>
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
