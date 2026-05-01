/**
 * Bridge from the legacy imperative `state` object (in legacy-app.ts) into
 * the signal store. The legacy code mutates a plain object 122 times across
 * the file; instead of replacing every mutation site, we expose a single
 * `mirror()` call that copies the relevant slices into signals (creating
 * fresh references for arrays/sets so signal subscribers re-run).
 *
 * This lets Preact components subscribe to live state without the legacy
 * code knowing about signals at all. As components migrate they begin
 * writing to signals directly, and the corresponding reads in this file
 * lose their last consumer and can be deleted.
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
  imports,
  type StoredEvent,
  type View,
} from './signals'

type LegacyState = {
  events: StoredEvent[]
  view: View
  paused: boolean
  pausedWhileCount: number
  autoScroll: boolean
  expandAll: boolean
  expandedCards: Set<string>
  searchQuery: string
  activeFilter: string
  activeSession: string | null
  activeImport: string | null
  activeCacheKey: string | null
  hiddenTypes: Set<string>
  hiddenSessions: Set<string>
  hiddenImports: Set<string>
  hiddenCacheKeys: Set<string>
  cacheAllHidden: boolean
  telemetryAllHidden: boolean
  realTelemetryDetected: boolean
  importMap?: Record<string, { id: string; name: string; importedAt: number; explanation?: string }>
}

/**
 * Copy the legacy state into signals. Arrays / Sets get fresh references so
 * `@preact/signals` notices the change. Scalars only re-publish when they
 * differ to avoid unnecessary subscriber wakeups.
 */
export function mirror(s: LegacyState): void {
  // Arrays: always new reference (cheap and Preact dedupes via .value)
  events.value = s.events.slice()

  // Scalars: only update if changed.
  if (view.value !== s.view) view.value = s.view
  if (paused.value !== s.paused) paused.value = s.paused
  if (pausedWhileCount.value !== s.pausedWhileCount) pausedWhileCount.value = s.pausedWhileCount
  if (autoScroll.value !== s.autoScroll) autoScroll.value = s.autoScroll
  if (expandAll.value !== s.expandAll) expandAll.value = s.expandAll
  if (searchQuery.value !== s.searchQuery) searchQuery.value = s.searchQuery
  if (activeFilter.value !== s.activeFilter) activeFilter.value = s.activeFilter
  if (activeSession.value !== s.activeSession) activeSession.value = s.activeSession
  if (activeImport.value !== s.activeImport) activeImport.value = s.activeImport
  if (activeCacheKey.value !== s.activeCacheKey) activeCacheKey.value = s.activeCacheKey
  if (cacheAllHidden.value !== s.cacheAllHidden) cacheAllHidden.value = s.cacheAllHidden
  if (telemetryAllHidden.value !== s.telemetryAllHidden) telemetryAllHidden.value = s.telemetryAllHidden
  if (realTelemetryDetected.value !== s.realTelemetryDetected) realTelemetryDetected.value = s.realTelemetryDetected

  // Sets: copy contents into a new Set so signal subscribers see a
  // reference change. Cheap because every set in the legacy state is small.
  expandedCards.value = new Set(s.expandedCards)
  hiddenTypes.value = new Set(s.hiddenTypes)
  hiddenSessions.value = new Set(s.hiddenSessions)
  hiddenImports.value = new Set(s.hiddenImports)
  hiddenCacheKeys.value = new Set(s.hiddenCacheKeys)

  if (s.importMap) {
    imports.value = Object.values(s.importMap)
  }
}

/**
 * Schedule a mirror at the next microtask. Cheap idempotent batcher — all
 * mutations within a synchronous block coalesce into one signal update.
 */
let scheduled = false
let lastState: LegacyState | null = null
export function scheduleMirror(s: LegacyState): void {
  lastState = s
  if (scheduled) return
  scheduled = true
  queueMicrotask(() => {
    scheduled = false
    if (lastState) mirror(lastState)
  })
}
