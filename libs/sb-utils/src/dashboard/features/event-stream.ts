// @ts-nocheck
/**
 * Live event stream + on-load recovery. Owns:
 *
 * - The SSE connection to `/sse` with auto-reconnect handling.
 * - Dedup-by-eventId / dedup-by-_index against state.events.
 * - The "real telemetry detected" flip that switches off cache
 *   reconstruction once an instrumented event lands.
 * - On-load: GET `/event-log` (existing events), then run the cache
 *   backfill + reconstruction passes, then open the SSE channel.
 * - On reconnect: re-sync against `/event-log` to pick up events that
 *   may have arrived during the disconnect.
 *
 * Bridges into:
 * - state (passed in) for the actual storage
 * - update* helpers for the legacy parallel maps (kept until the
 *   legacy mirror disappears)
 * - Timeline / CacheView via helpers for downstream invalidation
 * - reconstructTelemetryFromCacheWrite for cache:write fan-out
 */

export type EventStreamHelpers = {
  state: any
  updateTypeCounts: (e: any) => void
  updateSessionMap: (e: any) => void
  updateImportMap: (e: any) => void
  updateCacheMap: (e: any) => void
  rerenderAll: () => void
  updateCounters: () => void
  pausedCountElGet: () => HTMLElement
  statusDotGet: () => HTMLElement
  reconstructTelemetryFromCacheWrite: (e: any) => void
  backfillFromCache: () => Promise<void>
  Timeline: () => { invalidate: () => void } | null
  CacheView: () => { onCacheEvent: (e: any) => void } | null
}

export function setupEventStream(h: EventStreamHelpers) {
  const { state } = h
  let eventSource: EventSource | null = null

  function ingest(event: any) {
    state.events.push(event)
    h.updateTypeCounts(event)
    h.updateSessionMap(event)
    h.updateImportMap(event)
    h.updateCacheMap(event)
  }

  function connect() {
    eventSource = new EventSource('/sse')
    eventSource.onmessage = (e) => {
      const event = JSON.parse(e.data)
      // Dedup by eventId (canonical) then by _index (server ordinal —
      // covers SSE replay after reconnect). Synthetic events use a high
      // _index range so this can't false-positive on small server indices.
      if (event.eventId && state.events.some((ex: any) => ex.eventId === event.eventId)) return
      if (event._index != null && state.events.some((ex: any) => ex._index === event._index)) return

      // First real instrumented event → shut off reconstruction.
      if (!event._source && !state.realTelemetryDetected) {
        state.realTelemetryDetected = true
      }

      ingest(event)

      if (state.paused) {
        state.pausedWhileCount++
        const el = h.pausedCountElGet()
        if (el) el.textContent = String(state.pausedWhileCount)
      }
      h.updateCounters()
      const tl = h.Timeline()
      if (tl) tl.invalidate()
      const cv = h.CacheView()
      if (event._source === 'cache-watch' && cv) cv.onCacheEvent(event)
      if (event._source === 'cache-watch') h.reconstructTelemetryFromCacheWrite(event)
    }
    eventSource.onopen = () => {
      const sd = h.statusDotGet()
      if (sd) {
        sd.className = 'status-dot'
        sd.title = 'Connected'
      }
      void recoverMissedEvents()
    }
    eventSource.onerror = () => {
      const sd = h.statusDotGet()
      if (sd) {
        sd.className = 'status-dot disconnected'
        sd.title = 'Disconnected - retrying...'
      }
    }
  }

  async function recoverMissedEvents() {
    try {
      const res = await fetch('/event-log')
      const serverEvents = await res.json()
      let recovered = 0
      for (const event of serverEvents) {
        if (event.eventId && state.events.some((ex: any) => ex.eventId === event.eventId)) continue
        if (event._index != null && !state.events.some((ex: any) => ex._index === event._index)) {
          state.events.push(event)
          h.updateTypeCounts(event)
          h.updateSessionMap(event)
          h.updateImportMap(event)
          recovered++
        }
      }
      if (recovered > 0) {
        state.events.sort((a: any, b: any) => (a._index || 0) - (b._index || 0))
        if (!state.paused) h.rerenderAll()
        h.updateCounters()
      }
    } catch {
      /* best-effort */
    }
  }

  async function loadExisting() {
    try {
      const res = await fetch('/event-log')
      const existing = await res.json()
      for (const event of existing) ingest(event)
      // Always backfill from the cache: synthesize cache:write events for
      // every existing entry, and reconstruct the telemetry stream from
      // `lastEvents`. Reconstruction stops itself the moment a real
      // instrumented telemetry event arrives via SSE.
      await h.backfillFromCache()
      if (state.events.length > 0) h.rerenderAll()
      const tl = h.Timeline()
      if (tl) tl.invalidate()
      h.updateCounters()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load existing events:', e)
    }
  }

  // Boot sequence: load existing → connect SSE.
  void loadExisting().then(() => connect())

  return { connect, recoverMissedEvents, loadExisting }
}
