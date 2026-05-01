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
  activeCacheKey,
  hiddenTypes,
  hiddenSessions,
  hiddenImports,
  hiddenCacheKeys,
  cacheAllHidden,
  telemetryAllHidden,
  searchQuery,
  type StoredEvent,
} from '../store/signals'
import { cacheKeyOf } from './event-helpers'

export function matchesFilters(event: StoredEvent): boolean {
  if (hiddenTypes.value.has(event.eventType)) return false
  if (event.sessionId && hiddenSessions.value.has(event.sessionId)) return false

  // Cache events filter independently from telemetry — the master
  // toggles ("All operations" / "All events") let users isolate one
  // stream without touching the other.
  if (event._source === 'cache-watch') {
    if (cacheAllHidden.value) return false
    const ck = cacheKeyOf(event)
    if (ck && hiddenCacheKeys.value.has(ck)) return false
    if (activeCacheKey.value && ck !== activeCacheKey.value) return false
  } else {
    if (telemetryAllHidden.value) return false
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
