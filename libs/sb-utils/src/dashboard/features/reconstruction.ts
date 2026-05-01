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

export function reconstructTelemetryFromCacheWrite(cacheEvent: CacheWriteEvent): void {
  if (realTelemetryDetected.value) return
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
 */
export function ingestSyntheticCacheCreate(
  entry: any,
  cacheRoot: string | null,
  projectRoot: string | null,
): void {
  if (!entry || !entry.key) return
  const ts = typeof entry.mtime === 'number' ? entry.mtime : Date.now()
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
 * `cache:write op=create` events, and reconstruct the telemetry stream
 * from `lastEvents`. Best-effort — silent failure just means the
 * dashboard boots empty.
 */
export async function backfillFromCache(): Promise<void> {
  try {
    const res = await fetch('/cache/entries')
    if (!res.ok) return
    const data = await res.json()
    const entries: any[] = data && Array.isArray(data.entries) ? data.entries : []
    if (entries.length === 0) return

    const sorted = entries.slice().sort((a, b) => (a.mtime || 0) - (b.mtime || 0))
    for (const entry of sorted) {
      ingestSyntheticCacheCreate(entry, data.cacheRoot, data.projectRoot)
    }

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
