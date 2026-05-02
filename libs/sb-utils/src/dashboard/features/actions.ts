/**
 * All sidebar / header actions, operating directly on signals. Replaces
 * the `window.__sbDashActions` bridge — components import from here.
 *
 * Two helpers are still needed from the imperative runtime:
 * - `Timeline.invalidate()` for canvas refresh on filter/visibility
 *   changes (until Timeline migrates to Preact)
 * - `CacheView.refresh()` for the cache view's edit-mode redraw
 *
 * They're injected via `wireRuntimeBridges()` from runtime.ts at boot.
 */

import {
  events,
  view,
  paused,
  pausedWhileCount,
  autoScroll,
  expandAll,
  expandedCards,
  searchQuery,
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
  realTelemetryDetected,
  reconstructFromCache,
  showStaleCache,
  serverStartedAt,
  pushToast,
  type View,
  type StoredEvent,
} from '../store/signals'
import { exportHtmlSnapshot as _exportHtmlSnapshot } from './snapshot-export'
import { reconstructFromCacheNow, backfillFromCache } from './reconstruction'
import { writePref } from '../lib/session-storage'

// ── Imperative bridges (filled at boot from runtime.ts) ────────────
type Bridges = {
  invalidateTimeline: () => void
  refreshCache: () => void
}
let bridges: Bridges = {
  invalidateTimeline: () => {},
  refreshCache: () => {},
}
export function wireRuntimeBridges(b: Bridges): void {
  bridges = b
}

// ── Filter / sidebar actions ───────────────────────────────────────

/** Click on an event-type row (or "All events"). Toggles back to 'all' if already active. */
export function setFilter(type: string): void {
  activeFilter.value = activeFilter.value === type ? 'all' : type
  bridges.invalidateTimeline()
}

export function setSession(sid: string | null): void {
  activeSession.value = sid
  bridges.invalidateTimeline()
}

export function setActiveImport(id: string | null): void {
  activeImport.value = id
  bridges.invalidateTimeline()
}

export function setActiveCacheKey(key: string | null): void {
  activeCacheKey.value = key
  bridges.invalidateTimeline()
}

const toggleSet = (
  sig: { value: Set<string> },
  key: string,
): void => {
  const next = new Set(sig.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  sig.value = next
}

export function toggleHiddenType(type: string): void {
  toggleSet(hiddenTypes, type)
  bridges.invalidateTimeline()
}
export function toggleHiddenSession(sid: string): void {
  toggleSet(hiddenSessions, sid)
  bridges.invalidateTimeline()
}
export function toggleHiddenImport(id: string): void {
  toggleSet(hiddenImports, id)
  bridges.invalidateTimeline()
}
export function toggleHiddenCacheKey(key: string): void {
  toggleSet(hiddenCacheKeys, key)
  bridges.invalidateTimeline()
}
export function toggleCacheAllHidden(): void {
  cacheAllHidden.value = !cacheAllHidden.value
  bridges.invalidateTimeline()
}

/**
 * Toggle telemetry reconstruction from the dev-server `lastEvents` cache.
 * Persists the choice to localStorage so it survives reload.
 *
 * Flipping ON: un-hides cache (so the operations behind the synthesized
 * telemetry are visible), then immediately materializes any telemetry
 * the cache already holds.
 *
 * Flipping OFF: drops every previously-reconstructed event from the
 * dashboard. Without this, the user can't actually un-see the
 * reconstructed entries — they'd just stop receiving NEW ones, which
 * is surprising.
 */
/**
 * Toggle "show stale cache data". Off by default — entries with mtime
 * < the server's startedAt timestamp are dropped at backfill time so a
 * fresh `event-logger` run starts with a clean slate. Flipping ON
 * re-runs the backfill so the previously-skipped pre-existing entries
 * appear; flipping OFF removes them again.
 */
export function setShowStaleCache(on: boolean): void {
  if (showStaleCache.value === on) return
  showStaleCache.value = on
  writePref('showStaleCache', on ? '1' : '0')
  if (on) {
    void backfillFromCache().then(async () => {
      // backfillFromCache calls the LIVE-path reconstruction (gated
      // by `realTelemetryDetected` — won't run if a real event has
      // arrived). Force the explicit on-toggle path too, so the
      // user's "make stale data visible" intent doesn't silently
      // skip telemetry reconstruction when both toggles are on.
      if (reconstructFromCache.value) await reconstructFromCacheNow()
      bridges.invalidateTimeline()
    })
  } else {
    // Drop synthetic stale events. Live cache writes (mtime
    // >= startedAt) stay. Reconstructed telemetry events that
    // predate the session also drop — the toggle is meant to read as
    // "show what existed BEFORE this session", and that includes
    // both the cache:write entries and the telemetry replayed from
    // their contents. Recent recon events stay, so live
    // reconstruction (when reconstructFromCache is also on) is
    // unaffected.
    const cutoff = serverStartedAt.value
    if (cutoff != null) {
      events.value = events.value.filter((e) => {
        if (e._source !== 'cache-watch' && e._source !== 'cache-recon') return true
        return (e._receivedAt || 0) >= cutoff
      })
      bridges.invalidateTimeline()
    }
  }
}

export function setReconstructFromCache(on: boolean): void {
  if (reconstructFromCache.value === on) return
  reconstructFromCache.value = on
  writePref('reconstruct', on ? '1' : '0')
  if (on) {
    if (cacheAllHidden.value) cacheAllHidden.value = false
    void reconstructFromCacheNow().then(() => bridges.invalidateTimeline())
  } else {
    events.value = events.value.filter((e) => e._source !== 'cache-recon')
    bridges.invalidateTimeline()
  }
}
export function toggleTelemetryAllHidden(): void {
  telemetryAllHidden.value = !telemetryAllHidden.value
  bridges.invalidateTimeline()
}

// ── Delete actions ─────────────────────────────────────────────────

export function deleteEventsByType(type: string): void {
  events.value = events.value.filter((e) => e.eventType !== type)
  hiddenTypes.value = setMinus(hiddenTypes.value, [type])
  if (activeFilter.value === type) activeFilter.value = 'all'
  bridges.invalidateTimeline()
}

export function deleteEventsBySession(sid: string): void {
  events.value = events.value.filter((e) => e.sessionId !== sid)
  hiddenSessions.value = setMinus(hiddenSessions.value, [sid])
  if (activeSession.value === sid) activeSession.value = null
  bridges.invalidateTimeline()
}

export function deleteEventsByImport(id: string): void {
  events.value = events.value.filter((e) => !(e._import && e._import.id === id))
  hiddenImports.value = setMinus(hiddenImports.value, [id])
  if (activeImport.value === id) activeImport.value = null
  bridges.invalidateTimeline()
}

export function deleteEventsByCacheKey(key: string): void {
  const eq = (e: StoredEvent) => {
    if (e._source !== 'cache-watch' || !e.payload) return false
    const p = e.payload as Record<string, unknown>
    return (p.namespace || '') + '/' + (p.key || '') === key
  }
  events.value = events.value.filter((e) => !eq(e))
  hiddenCacheKeys.value = setMinus(hiddenCacheKeys.value, [key])
  if (activeCacheKey.value === key) activeCacheKey.value = null
  bridges.invalidateTimeline()
}

export function deleteAllTelemetryEvents(): void {
  events.value = events.value.filter((e) => e._source === 'cache-watch')
  hiddenTypes.value = new Set()
  hiddenSessions.value = new Set()
  hiddenImports.value = new Set()
  if (activeFilter.value !== 'all') activeFilter.value = 'all'
  activeSession.value = null
  activeImport.value = null
  bridges.invalidateTimeline()
}

export function deleteAllCacheEvents(): void {
  events.value = events.value.filter((e) => e._source !== 'cache-watch')
  hiddenCacheKeys.value = new Set()
  cacheAllHidden.value = false
  activeCacheKey.value = null
  bridges.invalidateTimeline()
}

// ── Header actions ─────────────────────────────────────────────────

export function setPaused(v: boolean): void {
  paused.value = v
  if (!v) pausedWhileCount.value = 0
}

export function setAutoScroll(v: boolean): void {
  autoScroll.value = v
}

export function setExpandAll(v: boolean): void {
  expandAll.value = v
  // When expanding via the global toggle, clear per-card overrides so
  // collapsing doesn't leave stragglers stuck open / closed.
  if (!v) expandedCards.value = new Set()
}

export function setSearchQuery(q: string): void {
  searchQuery.value = q
  bridges.invalidateTimeline()
}

export function setView(v: View): void {
  if (v !== 'dashboard' && v !== 'timeline' && v !== 'cache') v = 'dashboard'
  view.value = v
  // Persisted in sessionStorage and namespaced by the server's
  // startedAt — see lib/session-storage.ts. A new CLI run resets it.
  writePref('view', v)
  document.body.classList.toggle('view-timeline', v === 'timeline')
  document.body.classList.toggle('view-dashboard', v === 'dashboard')
  document.body.classList.toggle('view-cache', v === 'cache')
  // Legacy DOM containers — still toggled imperatively until Timeline /
  // CacheView migrate to Preact (their roots are JSX shells the IIFEs
  // mount into; this hides/shows the right one for the active view).
  const ec = document.getElementById('eventContainer')
  const tv = document.getElementById('timelineView')
  const cv = document.getElementById('cacheView')
  if (ec) ec.style.display = v === 'dashboard' ? '' : 'none'
  if (tv) tv.style.display = v === 'timeline' ? '' : 'none'
  if (cv) cv.style.display = v === 'cache' ? '' : 'none'
  if (v === 'timeline') bridges.invalidateTimeline()
  if (v === 'cache') bridges.refreshCache()
}

export function exportEvents(): Promise<void> {
  // Imported lazily so we don't pull the modal store into actions
  // unless someone actually exports.
  return import('../store/modal').then(({ openSaveModal }) => doExportEvents(openSaveModal))
}

async function doExportEvents(
  openSaveModal: (opts: any) => Promise<{ filename: string; explanation: string } | null>,
): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const result = await openSaveModal({
    kind: 'json',
    defaultName: 'telemetry-' + stamp + '.json',
    extension: 'json',
    withExplanation: true,
  })
  if (!result) return
  // Keep `_receivedAt` in the export — without it, re-importing the
  // file would stamp every event with `Date.now()` and the timeline
  // collapses every dot onto the import moment. `_index` is dropped:
  // it's a server-local ordinal that gets re-assigned on import.
  const cleaned = events.value.map((e) => {
    const { _index, ...rest } = e
    return rest
  })
  const payload = { version: 1, explanation: result.explanation, events: cleaned }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  a.click()
  URL.revokeObjectURL(url)
  pushToast('Exported ' + cleaned.length + ' event' + (cleaned.length === 1 ? '' : 's'))
}

export function exportHtmlSnapshot(): Promise<void> {
  return _exportHtmlSnapshot()
}

export async function clearAll(): Promise<void> {
  await fetch('/clear', { method: 'POST' })
  events.value = []
  pausedWhileCount.value = 0
  expandedCards.value = new Set()
  hiddenTypes.value = new Set()
  hiddenSessions.value = new Set()
  hiddenImports.value = new Set()
  hiddenCacheKeys.value = new Set()
  cacheAllHidden.value = false
  telemetryAllHidden.value = false
  activeFilter.value = 'all'
  activeSession.value = null
  activeImport.value = null
  activeCacheKey.value = null
  realTelemetryDetected.value = false
  // imports is a computed signal derived from events — it'll empty on its own.
  bridges.invalidateTimeline()
  bridges.refreshCache()
  pushToast('Cleared all events')
}

// ── Helpers ────────────────────────────────────────────────────────

function setMinus<T>(s: Set<T>, removed: T[]): Set<T> {
  const next = new Set(s)
  for (const x of removed) next.delete(x)
  return next
}
