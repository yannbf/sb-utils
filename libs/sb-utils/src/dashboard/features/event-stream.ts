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
  tooManyTabs,
  appendEvents,
  setEvents,
  type StoredEvent,
} from '../store/signals'
import { backfillFromCache, reconstructTelemetryFromCacheWrite } from './reconstruction'
import { refreshCacheEntries } from '../store/cache'
import { timelineApi } from '../components/Timeline'

// How long the SSE may sit in CONNECTING before we suspect the
// browser's per-origin connection cap (~6 in Chrome HTTP/1.1) is full.
// SSE holds a slot for the lifetime of the tab, so 6+ tabs to the same
// dashboard origin starves the next one — the connection just queues
// without erroring. We disambiguate "server down" from "pool full" by
// pinging /config (which uses the same pool, so a slow ping likewise
// signals exhaustion vs an outright failure).
const CONNECT_TIMEOUT_MS = 4000

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
    if (timeoutHandle != null) clearTimeout(timeoutHandle)
  }
  window.addEventListener('pagehide', cleanup)
  window.addEventListener('beforeunload', cleanup)

  // Stuck-connecting detector. If onopen hasn't fired by the deadline,
  // probe /config — if THAT also hangs while the server is reachable
  // from elsewhere, we're almost certainly out of connection slots
  // (other tabs holding open SSE streams). Show the "too many tabs"
  // banner.
  const timeoutHandle = window.setTimeout(() => {
    if (eventSource.readyState !== EventSource.OPEN) {
      const ctrl =
        typeof AbortController !== 'undefined' ? new AbortController() : null
      const probeTimeout = window.setTimeout(() => ctrl?.abort(), 3000)
      fetch('/config', { signal: ctrl?.signal })
        .then(() => {
          // /config came back fine, so the server is alive and the
          // pool isn't fully starved. Don't blame open tabs.
          tooManyTabs.value = false
        })
        .catch(() => {
          // /config also stuck/aborted while the SSE has been queueing
          // → connection cap is almost certainly the cause. (The
          // alternative — total server outage — would be reflected by
          // the dot's `disconnected` state from the EventSource error
          // handler shortly after.)
          if (eventSource.readyState !== EventSource.OPEN) {
            tooManyTabs.value = true
          }
        })
        .finally(() => clearTimeout(probeTimeout))
    }
  }, CONNECT_TIMEOUT_MS)

  eventSource.onmessage = (e) => {
    const event = JSON.parse(e.data) as StoredEvent
    enqueueIncoming(event)
  }
  eventSource.onopen = () => {
    connectionStatus.value = 'connected'
    tooManyTabs.value = false
    if (timeoutHandle != null) clearTimeout(timeoutHandle)
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
    // Route through the same enqueue path the SSE onmessage uses so
    // dedup considers BOTH the committed store and any in-flight
    // pending batch. Without this, a /event-log fetch that resolves
    // while SSE-delivered events are still buffered for the next rAF
    // would re-add them as duplicates (tests sending three quick
    // postEvent() calls right after page load were the canary —
    // recoverMissedEvents fires on `onopen` and races the SSE
    // onmessage rAF coalesce).
    for (const event of serverEvents) enqueueIncoming(event)
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

  // The recoverMissedEvents fetch and SSE onmessage can race —
  // recoverMissedEvents iterates server events in `_index` order, but
  // an SSE onmessage that fires while that fetch is in flight queues
  // its event first. Sort the batch back into `_index` order so the
  // committed events are chronological. Synthetic events (cache-recon,
  // import) use the 1e9-range counter so they sort after live events,
  // which matches their "after-the-fact" semantics.
  if (batch.length > 1) {
    batch.sort((a, b) => (a._index ?? 0) - (b._index ?? 0))
  }

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
