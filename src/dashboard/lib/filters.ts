/**
 * `matchesFilters(event)` — should this event be visible given the
 * current filter signals? Reads the relevant signals directly so any
 * Preact component that calls it inside a render function will
 * automatically re-render when filters change.
 */

import {
  activeFilter,
  activeSession,
  activeImport,
  hiddenTypes,
  hiddenSessions,
  hiddenImports,
  cacheAllHidden,
  showStaleCache,
  serverStartedAt,
  searchQuery,
  type StoredEvent,
} from '../store/signals'

export function matchesFilters(event: StoredEvent): boolean {
  if (hiddenTypes.value.has(event.eventType)) return false
  if (event.sessionId && hiddenSessions.value.has(event.sessionId)) return false

  // Cache events filter independently from telemetry — the
  // "Show cache operations" toggle lets users isolate one stream
  // without touching the other. Telemetry "Hide all" works by
  // populating `hiddenTypes` with every type, which the per-type
  // check above already handles — so there's no separate flag here.
  if (event._source === 'cache-watch') {
    if (cacheAllHidden.value) return false
    // Hide baked stale entries (mtime < server startedAt) unless the
    // user toggles "Show stale cache data" on. This catches snapshot
    // mode where stale entries were baked into events.value at export
    // time — at runtime ingestSyntheticCacheCreate filters them
    // before they reach events.value, so this branch is a no-op for
    // the live dashboard.
    if (
      !showStaleCache.value &&
      serverStartedAt.value != null &&
      event._receivedAt != null &&
      event._receivedAt < serverStartedAt.value
    ) {
      return false
    }
  }

  const importId = (event._import && event._import.id) || null
  if (importId && hiddenImports.value.has(importId)) return false
  if (activeImport.value && importId !== activeImport.value) return false

  if (activeFilter.value !== 'all' && event.eventType !== activeFilter.value) return false
  if (activeSession.value && event.sessionId !== activeSession.value) return false

  if (searchQuery.value) {
    const json = JSON.stringify(event).toLowerCase()
    if (!json.includes(searchQuery.value.toLowerCase())) return false
  }
  return true
}
