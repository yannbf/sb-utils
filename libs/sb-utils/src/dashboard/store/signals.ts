/**
 * Reactive store. Each piece of dashboard state is a `@preact/signals`
 * signal so Preact components subscribe granularly. The legacy module
 * still mutates a `state` object imperatively; `mirrorState` copies the
 * relevant slices into signals after each mutation so components stay in
 * sync. As the legacy module shrinks the mirror layer disappears and
 * components write to signals directly.
 */

import { signal, computed } from '@preact/signals'
import { cacheEntries } from './cache'

export type StoredEvent = {
  eventType: string
  eventId?: string
  sessionId?: string
  payload?: Record<string, unknown>
  metadata?: Record<string, unknown>
  context?: Record<string, unknown>
  _index: number
  _receivedAt: number
  _source?: string
  _import?: { id: string; name: string; importedAt: number; explanation?: string }
}

export type View = 'dashboard' | 'timeline' | 'cache'

// ── Core data ────────────────────────────────────────────
export const events = signal<StoredEvent[]>([])

// ── UI mode ──────────────────────────────────────────────
export const view = signal<View>('dashboard')
export const paused = signal(false)
export const pausedWhileCount = signal(0)
export const autoScroll = signal(true)
export const expandAll = signal(false)
export const expandedCards = signal<Set<string>>(new Set())

// ── Filter / hide state ──────────────────────────────────
export const searchQuery = signal('')
export const activeFilter = signal<string>('all')
export const activeSession = signal<string | null>(null)
export const activeImport = signal<string | null>(null)
export const hiddenTypes = signal<Set<string>>(new Set())
export const hiddenSessions = signal<Set<string>>(new Set())
export const hiddenImports = signal<Set<string>>(new Set())
// Cache events are HIDDEN by default. The sidebar surfaces a single
// "Show cache operations" toggle that flips this flag — the user opts
// in when they want cache:write/cache:delete events in the dashboard,
// timeline, and counts. Pre-existing (stale) entries are also gated
// independently via `showStaleCache` (see below). `cacheAllHidden=true`
// keeps the legacy semantics of the underlying flag (true=hidden) while
// flipping the default so a fresh boot starts quiet.
export const cacheAllHidden = signal(true)

/**
 * Show cache entries with mtime < server startedAt. Off by default —
 * a fresh `event-logger` run shouldn't dump every pre-existing cache
 * file as a synthetic `cache:write` op the user has to scroll past.
 * Toggling this on backfills the previously-skipped entries.
 */
export const showStaleCache = signal(false)

/**
 * Timeline view's "Collapse gaps" mode. On by default: long quiet
 * stretches between event bursts compress to a fixed display width
 * (see `buildSegments` in `lib/timeline-math.ts`), giving dense
 * regions more room and helping labels fit. The toolbar toggle in
 * `features/timeline.ts` writes here; runtime restores from
 * sessionStorage on boot and snapshot mode bakes the live value.
 */
export const collapseTimelineGaps = signal(true)

/**
 * Wall-clock time the event-logger process booted, fetched from
 * `/config`. Cache entries with mtime < this are considered stale.
 * Null until /config has been read; cache backfill waits for it.
 */
export const serverStartedAt = signal<number | null>(null)

/**
 * Number of cache entries currently considered stale (mtime <
 * serverStartedAt). Drives the "Show stale cache data" row's pill
 * + visibility, and the cache-ops pill's "what would surface if
 * the user flipped the toggle on" math.
 *
 * Derived rather than stored: when storybook overwrites a previously
 * stale entry, that entry's mtime ticks past startedAt and it stops
 * being stale. A snapshot-style write of this count at boot would
 * miss those transitions; a computed always reflects the current
 * cacheEntries snapshot.
 */
export const staleCacheCount = computed<number>(() => {
  const cutoff = serverStartedAt.value
  if (cutoff == null) return 0
  let n = 0
  for (const entry of cacheEntries.value) {
    const ts = typeof entry?.mtime === 'number' ? entry.mtime : null
    if (ts != null && ts < cutoff) n++
  }
  return n
})

// ── Reconstruction flag ──────────────────────────────────
export const realTelemetryDetected = signal(false)

// User-facing toggle for telemetry reconstruction from the dev-server
// `lastEvents` cache. Off by default — Storybook only writes to the
// cache as a fallback when STORYBOOK_TELEMETRY_URL isn't set, and most
// users don't want a cache-write to manifest as synthetic telemetry.
// The Cache Operations gear menu in the sidebar surfaces this toggle.
export const reconstructFromCache = signal(false)

// ── Toasts ───────────────────────────────────────────────
export type Toast = { id: number; text: string }
export const toasts = signal<Toast[]>([])
let _toastId = 0
export function pushToast(text: string, ttlMs = 2000) {
  const id = ++_toastId
  toasts.value = [...toasts.value, { id, text }]
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, ttlMs)
}

// ── Modal ────────────────────────────────────────────────
// Three modes: 'save' (filename + optional explanation), 'explain' (read-only
// view of an existing explanation), or null (closed). Resolution flows back
// through the modal state itself: callers `await openSaveModal({...})` and
// the user's submit/cancel resolves the promise.
export type SaveModalSpec = {
  kind: 'save'
  title: string
  defaultName: string
  extension: string
  withExplanation: boolean
}
export type ExplainModalSpec = {
  kind: 'explain'
  title: string
  text: string
}
export type ModalSpec = SaveModalSpec | ExplainModalSpec
export const modal = signal<ModalSpec | null>(null)

// ── Imports ──────────────────────────────────────────────
export type ImportBatch = {
  id: string
  name: string
  importedAt: number
  explanation?: string
  count?: number
}

/**
 * Derived from events.value. The `_import` metadata is set on each
 * event when ingested via the import endpoint, so the Sidebar's
 * Imports section follows automatically.
 */
export const imports = computed<ImportBatch[]>(() => {
  const out: Record<string, ImportBatch> = {}
  for (const e of events.value) {
    const imp = e._import
    if (!imp || !imp.id) continue
    if (!out[imp.id]) {
      out[imp.id] = {
        id: imp.id,
        name: imp.name || imp.id,
        importedAt: imp.importedAt || Date.now(),
        explanation: imp.explanation,
        count: 0,
      }
    } else if (
      !out[imp.id].explanation &&
      typeof imp.explanation === 'string' &&
      imp.explanation
    ) {
      out[imp.id].explanation = imp.explanation
    }
    out[imp.id].count = (out[imp.id].count || 0) + 1
  }
  return Object.values(out).sort((a, b) => b.importedAt - a.importedAt)
})

// ── Computed: counts and groupings ───────────────────────
// Derived from `events.value` so they auto-update whenever a new event is
// pushed. Computeds memoize until their inputs change.

export const typeCounts = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {}
  for (const e of events.value) {
    const t = e.eventType || 'unknown'
    out[t] = (out[t] || 0) + 1
  }
  return out
})

export type SessionInfo = { count: number; firstSeen: number }

export const sessionMap = computed<Record<string, SessionInfo>>(() => {
  const out: Record<string, SessionInfo> = {}
  for (const e of events.value) {
    if (!e.sessionId) continue
    if (!out[e.sessionId]) out[e.sessionId] = { count: 0, firstSeen: e._receivedAt || Date.now() }
    out[e.sessionId].count++
  }
  return out
})

// Total count of telemetry events (everything except `cache-watch`).
// The Sidebar's "Event Types" section reads this for the "All events"
// row count. Memoized so it only recomputes when events.value changes.
export const telemetryCount = computed(() => {
  let n = 0
  for (const e of events.value) if (e._source !== 'cache-watch') n++
  return n
})

/**
 * Count of cache operations the user would see if they flipped the
 * "Show cache operations" toggle on. Counts events (cache:write /
 * cache:delete), NOT entries on disk: a single entry can be touched
 * many times by a workload and each touch is its own operation.
 *
 * The current staleness state is already baked into `events.value` —
 * when `showStaleCache` is off, stale synthetic events are filtered
 * at ingestion time and `setShowStaleCache(false)` drops them — so
 * counting cache-watch events directly here gives the right number
 * for both states without re-applying the stale gate.
 */
export const cacheOperationsCount = computed(() => {
  let n = 0
  for (const e of events.value) if (e._source === 'cache-watch') n++
  return n
})

// ── Event ingestion ──────────────────────────────────────
// Helpers used by features/event-stream.ts and features/reconstruction.ts
// to write into the events signal without leaking signal mechanics into
// imperative consumers.

export function appendEvent(event: StoredEvent): void {
  events.value = [...events.value, event]
}

export function appendEvents(toAdd: StoredEvent[]): void {
  if (toAdd.length === 0) return
  events.value = [...events.value, ...toAdd]
}

export function setEvents(arr: StoredEvent[]): void {
  events.value = arr
}

export function sortEventsByTime(): void {
  const sorted = events.value.slice().sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0))
  events.value = sorted
}

/**
 * Currently-selected event in the Timeline drawer (null = drawer closed).
 * The Timeline canvas writes here when a dot is clicked; the drawer
 * component reads here to render. Navigation (prev/next) updates this.
 */
export const selectedTimelineEvent = signal<StoredEvent | null>(null)


/**
 * SSE connection status — read by the Header's status dot.
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'
export const connectionStatus = signal<ConnectionStatus>('connecting')

/**
 * Set when the SSE has been in `connecting` state long enough that the
 * most likely culprit is the browser's per-origin HTTP/1.1 connection
 * cap (~6 in Chrome). Drives a banner that tells the user to close
 * other tabs pointing at this dashboard. Cleared once SSE actually
 * opens.
 */
export const tooManyTabs = signal<boolean>(false)

// Synthetic events (cache reconstruction + cache-create from backfill)
// use a high _index range that the server's eventCounter (which starts
// at 0 and increments by ~1 per event) will never realistically reach.
// This keeps SSE dedup-by-_index correct: real live events have small
// indices, synthetic ones have large ones, no collisions.
let _syntheticIndexCounter = 1e9
export function nextReconstructIndex(): number {
  return _syntheticIndexCounter++
}

// Reset everything (used by the Clear All flow).
export function resetAll() {
  events.value = []
  pausedWhileCount.value = 0
  expandedCards.value = new Set()
  hiddenTypes.value = new Set()
  hiddenSessions.value = new Set()
  hiddenImports.value = new Set()
  cacheAllHidden.value = true
  activeFilter.value = 'all'
  activeSession.value = null
  activeImport.value = null
  // imports is a computed signal — it'll empty on its own once events
  // is cleared above.
  realTelemetryDetected.value = false
}
