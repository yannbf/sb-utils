/**
 * Live event stream + on-load recovery. Owns:
 *
 * - SSE connection to `/sse` with auto-reconnect
 * - Dedup-by-eventId / dedup-by-_index against the events signal
 * - "real telemetry detected" flip that switches off cache reconstruction
 * - Boot: GET `/event-log` + cache backfill, then open SSE
 * - Reconnect: re-sync against `/event-log` for any events that arrived
 *   during the disconnect
 */

import {
  events,
  realTelemetryDetected,
  paused,
  pausedWhileCount,
  connectionStatus,
  appendEvents,
  setEvents,
  type StoredEvent,
} from '../store/signals'
import { backfillFromCache, reconstructTelemetryFromCacheWrite } from './reconstruction'
import { refreshCacheEntries } from '../store/cache'
import { timelineApi } from '../components/Timeline'

function connect() {
  const eventSource = new EventSource('/sse')
  // Close the SSE socket eagerly when the tab unloads so the server
  // (and the browser's per-origin connection pool) can free the slot
  // immediately. Without this, refresh-under-multiple-tabs can stack
  // connections waiting on GC and starve the new tab's boot fetches —
  // browsers cap HTTP/1.1 to ~6 per origin.
  const cleanup = () => {
    try {
      eventSource.close()
    } catch {
      /* ignore */
    }
  }
  window.addEventListener('pagehide', cleanup)
  window.addEventListener('beforeunload', cleanup)

  eventSource.onmessage = (e) => {
    const event = JSON.parse(e.data) as StoredEvent
    enqueueIncoming(event)
  }
  eventSource.onopen = () => {
    connectionStatus.value = 'connected'
    void recoverMissedEvents()
  }
  eventSource.onerror = () => {
    connectionStatus.value = 'disconnected'
  }
}

async function recoverMissedEvents(): Promise<void> {
  try {
    const res = await fetch('/event-log')
    const serverEvents = (await res.json()) as StoredEvent[]
    const all = events.value
    const ids = seenEventIds(all)
    const idxs = seenIndices(all)
    const additions: StoredEvent[] = []
    for (const event of serverEvents) {
      if (event.eventId && ids.has(event.eventId)) continue
      if (event._index != null && !idxs.has(event._index)) {
        additions.push(event)
      }
    }
    if (additions.length > 0) {
      const merged = [...all, ...additions].sort(
        (a, b) => (a._index || 0) - (b._index || 0),
      )
      setEvents(merged)
    }
  } catch {
    /* best-effort */
  }
}

// Coalesce bursts of SSE messages (notably bulk imports — the server
// broadcasts every imported event individually) into a single store
// mutation per microtask so we don't trigger 200+ Preact renders for a
// single import. Dedup is applied across both the existing store and
// the in-flight pending batch; cache-watch side effects (refresh +
// reconstruction) still fire per-event but only after the batch
// commits.
let _pending: StoredEvent[] = []
const _pendingIds = new Set<string>()
const _pendingIdx = new Set<number>()
let _pendingFlush: number | null = null

function enqueueIncoming(event: StoredEvent): void {
  const all = events.value
  if (event.eventId) {
    if (_pendingIds.has(event.eventId)) return
    if (seenEventIds(all).has(event.eventId)) return
  }
  if (event._index != null) {
    if (_pendingIdx.has(event._index)) return
    if (seenIndices(all).has(event._index)) return
  }
  _pending.push(event)
  if (event.eventId) _pendingIds.add(event.eventId)
  if (event._index != null) _pendingIdx.add(event._index)
  if (_pendingFlush == null) {
    _pendingFlush = (typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame
      : (cb: any) => setTimeout(cb, 0))(flushPending) as unknown as number
  }
}

function flushPending(): void {
  _pendingFlush = null
  if (_pending.length === 0) return
  const batch = _pending
  _pending = []
  _pendingIds.clear()
  _pendingIdx.clear()

  // First real instrumented event → shut off reconstruction.
  if (!realTelemetryDetected.value) {
    for (const ev of batch) {
      if (!ev._source) {
        realTelemetryDetected.value = true
        break
      }
    }
  }

  appendEvents(batch)
  if (paused.value) pausedWhileCount.value += batch.length

  let sawCacheWrite = false
  for (const ev of batch) {
    if (ev._source === 'cache-watch') {
      sawCacheWrite = true
      reconstructTelemetryFromCacheWrite(ev)
    }
  }
  if (sawCacheWrite) void refreshCacheEntries()
  timelineApi.value?.invalidate()
}

// Per-snapshot Sets cached against the events array reference so we
// only rebuild them when the store actually changes. The signal swaps
// the array on every mutation (`events.value = [...]`), so identity
// comparison is sound.
let _idsSnapshot: StoredEvent[] | null = null
let _idsSet: Set<string> | null = null
let _idxSnapshot: StoredEvent[] | null = null
let _idxSet: Set<number> | null = null

function seenEventIds(arr: StoredEvent[]): Set<string> {
  if (_idsSnapshot === arr && _idsSet) return _idsSet
  const s = new Set<string>()
  for (const e of arr) if (e.eventId) s.add(e.eventId)
  _idsSnapshot = arr
  _idsSet = s
  return s
}

function seenIndices(arr: StoredEvent[]): Set<number> {
  if (_idxSnapshot === arr && _idxSet) return _idxSet
  const s = new Set<number>()
  for (const e of arr) if (e._index != null) s.add(e._index)
  _idxSnapshot = arr
  _idxSet = s
  return s
}

async function loadExisting(): Promise<void> {
  try {
    const res = await fetch('/event-log')
    const existing = (await res.json()) as StoredEvent[]
    if (existing.length > 0) setEvents([...events.value, ...existing])
    // Always backfill from the cache: synthesize cache:write events for
    // every existing entry, and reconstruct the telemetry stream from
    // `lastEvents`. Reconstruction stops itself the moment a real
    // instrumented telemetry event arrives via SSE.
    await backfillFromCache()
    timelineApi.value?.invalidate()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load existing events:', e)
  }
}

export function setupEventStream(): void {
  void loadExisting().then(() => connect())
}
