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
  appendEvent,
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
    // Dedup by eventId (canonical), then by _index (server ordinal —
    // covers SSE replay after reconnect). Synthetic events use a high
    // _index range so this can't false-positive on small server indices.
    if (event.eventId && events.value.some((ex) => ex.eventId === event.eventId)) return
    if (event._index != null && events.value.some((ex) => ex._index === event._index)) return

    // First real instrumented event → shut off reconstruction.
    if (!event._source && !realTelemetryDetected.value) {
      realTelemetryDetected.value = true
    }

    appendEvent(event)
    if (paused.value) pausedWhileCount.value++
    timelineApi.value?.invalidate()
    if (event._source === 'cache-watch') {
      void refreshCacheEntries()
      reconstructTelemetryFromCacheWrite(event)
    }
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
    const additions: StoredEvent[] = []
    for (const event of serverEvents) {
      if (event.eventId && events.value.some((ex) => ex.eventId === event.eventId)) continue
      if (event._index != null && !events.value.some((ex) => ex._index === event._index)) {
        additions.push(event)
      }
    }
    if (additions.length > 0) {
      const merged = [...events.value, ...additions].sort(
        (a, b) => (a._index || 0) - (b._index || 0),
      )
      setEvents(merged)
    }
  } catch {
    /* best-effort */
  }
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
