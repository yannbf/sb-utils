/**
 * Reconstruction + cache backfill. When STORYBOOK_TELEMETRY_URL isn't
 * set, Storybook still writes outgoing telemetry to the dev-server
 * `lastEvents` cache. We tail those writes (and seed from existing
 * entries on load) and synthesize matching telemetry events so the
 * dashboard works even without instrumentation. The instant a real
 * telemetry event arrives we flip `realTelemetryDetected` and stop
 * reconstructing.
 */

import {
  events,
  realTelemetryDetected,
  reconstructFromCache,
  showStaleCache,
  serverStartedAt,
  paused,
  pausedWhileCount,
  appendEvent,
  sortEventsByTime,
  nextReconstructIndex,
  type StoredEvent,
} from '../store/signals'
import { cacheKeyOf as _cacheKeyOf } from '../lib/event-helpers'
import { timelineApi } from '../components/Timeline'

type CacheWriteEvent = {
  _source?: string
  _receivedAt?: number
  payload?: {
    key?: string
    namespace?: string
    operation?: string
    content?: unknown
    previousContent?: unknown
  }
}

/**
 * Live-path entry: called by the SSE watcher every time a cache:write
 * event fires. Self-cancels once a real instrumented telemetry event
 * has arrived, so we don't double-report the same data through two
 * channels. The user-facing `reconstructFromCache` toggle gates this
 * entirely.
 */
export function reconstructTelemetryFromCacheWrite(cacheEvent: CacheWriteEvent): void {
  if (!reconstructFromCache.value) return
  if (realTelemetryDetected.value) return
  reconstructTelemetryFromCacheWriteInner(cacheEvent)
}

/**
 * Inner implementation with no live-cancel gate. Used both by the live
 * SSE path (above) and the on-toggle "replay everything in cache now"
 * path (`reconstructFromCacheNow` below) — the latter is an explicit
 * user opt-in so it must NOT respect realTelemetryDetected. Dedup by
 * eventId still keeps it idempotent.
 */
function reconstructTelemetryFromCacheWriteInner(cacheEvent: CacheWriteEvent): void {
  if (!cacheEvent || !cacheEvent.payload) return
  const p = cacheEvent.payload
  // Only the lastEvents key under dev-server is the telemetry log.
  if (p.key !== 'lastEvents' || p.namespace !== 'dev-server') return
  if (p.operation === 'delete') return

  const next = (p.content && typeof p.content === 'object' ? p.content : {}) as Record<string, any>
  const prev = (p.previousContent && typeof p.previousContent === 'object'
    ? p.previousContent
    : {}) as Record<string, any>

  // First pass: collect candidates that are actually new or changed AND
  // not already present (by eventId) in events.value. Sort them by
  // their cache-recorded timestamp before assigning indices, so the
  // displayed `#N` follows chronology.
  const candidates: Array<{ body: any; timestamp: number }> = []
  const existing = events.value
  for (const eventType of Object.keys(next)) {
    const entry = next[eventType]
    if (!entry || typeof entry !== 'object' || !entry.body) continue
    const prevEntry = prev[eventType]
    if (prevEntry && JSON.stringify(prevEntry) === JSON.stringify(entry)) continue
    const body = entry.body
    if (body && body.eventId && existing.some((e) => e.eventId === body.eventId)) continue
    candidates.push({
      body,
      timestamp:
        typeof entry.timestamp === 'number'
          ? entry.timestamp
          : cacheEvent._receivedAt || Date.now(),
    })
  }
  candidates.sort((a, b) => a.timestamp - b.timestamp)

  if (candidates.length === 0) return

  const built: StoredEvent[] = candidates.map((c) =>
    Object.assign({}, c.body, {
      _source: 'cache-recon',
      _index: nextReconstructIndex(),
      _receivedAt: c.timestamp,
    }),
  )
  events.value = [...events.value, ...built]
  if (paused.value) pausedWhileCount.value += built.length
  timelineApi.value?.invalidate()
}

/**
 * Synthesize a `cache:write` event for a pre-existing cache entry so it
 * shows up in the timeline / Cache Operations sidebar with the right
 * timestamp. Used by the on-load backfill — we lose nothing since we
 * also have the live watcher running for subsequent changes.
 *
 * Stale entries (mtime < server startedAt) are skipped unless the user
 * has flipped the `Show stale cache data` gear toggle. Without this
 * the dashboard would dump every pre-existing cache file as a
 * synthetic op on every boot, drowning the live operations.
 */
export function ingestSyntheticCacheCreate(
  entry: any,
  cacheRoot: string | null,
  projectRoot: string | null,
): void {
  if (!entry || !entry.key) return
  const ts = typeof entry.mtime === 'number' ? entry.mtime : Date.now()
  const started = serverStartedAt.value
  if (!showStaleCache.value && started != null && ts < started) return
  // Dedupe: don't re-synthesize a cache event for a (file, mtime) we've
  // already represented. A baked snapshot's `update` write at the
  // current mtime means we've already shown this state; adding a
  // synthetic `create` would be a duplicate.
  if (
    events.value.some(
      (e) =>
        e._source === 'cache-watch' &&
        e.payload &&
        (e.payload as any).file === entry.file &&
        e._receivedAt === ts,
    )
  )
    return

  const synthetic: StoredEvent = {
    eventType: 'cache:write',
    _source: 'cache-watch',
    _index: nextReconstructIndex(),
    _receivedAt: ts,
    payload: {
      key: entry.key,
      namespace: entry.namespace,
      file: entry.file,
      operation: 'create',
      content: entry.content,
      previousContent: null,
      diff: null,
    },
    context: { cacheRoot: cacheRoot || null, projectRoot: projectRoot || null },
  } as StoredEvent
  appendEvent(synthetic)
  if (paused.value) pausedWhileCount.value++
}

/**
 * On page load: fetch every existing cache entry, materialize them as
 * `cache:write op=create` events (skipping stale ones unless the
 * user has opted in), and reconstruct the telemetry stream from
 * `lastEvents` (likewise opt-in). Best-effort — silent failure just
 * means the dashboard boots empty.
 *
 * Fetches /config in parallel with /cache/entries so the staleness
 * cutoff is known before we start ingesting; ingestSyntheticCacheCreate
 * reads `serverStartedAt.value` directly.
 */
export async function backfillFromCache(): Promise<void> {
  try {
    const [cacheRes, configRes] = await Promise.all([
      fetch('/cache/entries'),
      serverStartedAt.value == null ? fetch('/config') : Promise.resolve(null),
    ])
    if (configRes && configRes.ok) {
      try {
        const cfg = await configRes.json()
        if (typeof cfg?.startedAt === 'number') serverStartedAt.value = cfg.startedAt
      } catch {
        /* ignore */
      }
    }
    if (!cacheRes.ok) return
    const data = await cacheRes.json()
    const entries: any[] = data && Array.isArray(data.entries) ? data.entries : []
    if (entries.length === 0) return

    const sorted = entries.slice().sort((a, b) => (a.mtime || 0) - (b.mtime || 0))
    for (const entry of sorted) {
      ingestSyntheticCacheCreate(entry, data.cacheRoot, data.projectRoot)
    }

    // reconstructTelemetryFromCacheWrite gates itself on the
    // user-facing `reconstructFromCache` signal, so this is a no-op
    // unless the user has opted in via the Cache Operations gear menu.
    if (!realTelemetryDetected.value) {
      const lastEvents = entries.find(
        (e) => e.key === 'lastEvents' && e.namespace === 'dev-server',
      )
      if (lastEvents && lastEvents.content && typeof lastEvents.content === 'object') {
        reconstructTelemetryFromCacheWrite({
          _source: 'cache-watch',
          _receivedAt: Date.now(),
          payload: {
            key: 'lastEvents',
            namespace: 'dev-server',
            operation: 'update',
            previousContent: {},
            content: lastEvents.content,
          },
        })
      }
    }

    sortEventsByTime()
    timelineApi.value?.invalidate()
  } catch {
    /* best-effort */
  }
}

export const cacheKeyOf = _cacheKeyOf

/**
 * Fetch the current cache state and reconstruct telemetry from
 * `lastEvents` *now*. Used when the user flips the
 * "Reconstruct telemetry from cache" toggle on after boot — the
 * normal backfill path already ran (with reconstruction gated off),
 * so this re-runs just the reconstruction step.
 *
 * Idempotent: relies on the eventId dedup inside
 * reconstructTelemetryFromCacheWrite, so repeat toggling won't
 * duplicate events.
 */
export async function reconstructFromCacheNow(): Promise<void> {
  try {
    const res = await fetch('/cache/entries')
    if (!res.ok) return
    const data = await res.json()
    const entries: any[] = data && Array.isArray(data.entries) ? data.entries : []
    const lastEvents = entries.find(
      (e) => e.key === 'lastEvents' && e.namespace === 'dev-server',
    )
    if (!lastEvents || !lastEvents.content || typeof lastEvents.content !== 'object') return
    // Use the inner (un-gated) form: this is an explicit user opt-in
    // so we must replay even if real telemetry has already been seen
    // in this session. Dedup by eventId keeps it idempotent.
    reconstructTelemetryFromCacheWriteInner({
      _source: 'cache-watch',
      _receivedAt: Date.now(),
      payload: {
        key: 'lastEvents',
        namespace: 'dev-server',
        operation: 'update',
        previousContent: {},
        content: lastEvents.content,
      },
    })
    sortEventsByTime()
    timelineApi.value?.invalidate()
  } catch {
    /* best-effort */
  }
}
