/**
 * Pure event-shape helpers used by EventCard and the timeline drawer.
 * Take an event (and the full list when needed for relative deltas);
 * never read globals.
 */

import type { StoredEvent } from '../store/signals'

/** "+147ms", "+3.4s", "+12m3s", "+1h2m" — used as the inter-event delta on cards. */
export function formatDelta(ms: number): string {
  // Reconstructed and snapshot events can have fractional millisecond
  // timestamps (e.g. mtime from filesystem stat), so round before
  // rendering — "+6.651611328125ms" looks like a bug to users.
  if (ms < 1000) return '+' + Math.round(ms) + 'ms'
  if (ms < 60_000) return '+' + (ms / 1000).toFixed(1) + 's'
  if (ms < 3_600_000) return '+' + Math.floor(ms / 60_000) + 'm' + Math.floor((ms % 60_000) / 1000) + 's'
  return '+' + Math.floor(ms / 3_600_000) + 'h' + Math.floor((ms % 3_600_000) / 60_000) + 'm'
}

/** Wall-clock delta from the previous event in chronological order; null for the first event. */
export function getPreviousEventTime(event: StoredEvent, all: StoredEvent[]): number | null {
  const idx = all.indexOf(event)
  if (idx <= 0) return null
  const prev = all[idx - 1]
  if (!prev._receivedAt || !event._receivedAt) return null
  return event._receivedAt - prev._receivedAt
}

/** `<namespace>/<key>` for cache:* pseudo-events. Returns null otherwise. */
export function cacheKeyOf(event: StoredEvent | null | undefined): string | null {
  if (!event || event._source !== 'cache-watch' || !event.payload) return null
  const p = event.payload as Record<string, unknown>
  return (p.namespace || '') + '/' + (p.key || '')
}

/**
 * Short human-readable summary of an event's payload. Used as
 * secondary info next to the event-type badge — on cards, in the
 * timeline tooltip, and in the drawer header. Cache events get
 * `<namespace>/<key>`; telemetry events get a `·`-joined list of
 * common descriptive fields (eventType / type / name / status /
 * error). Returns an empty string when there's nothing useful.
 */
export function summaryFor(ev: StoredEvent | null | undefined): string {
  if (!ev) return ''
  if (ev._source === 'cache-watch' && ev.payload) {
    const p = ev.payload as Record<string, unknown>
    return (p.namespace || '') + '/' + (p.key || '')
  }
  const parts: string[] = []
  const p = ev.payload as Record<string, unknown> | undefined
  if (p) {
    if (p.eventType) parts.push(String(p.eventType))
    if (p.type) parts.push(String(p.type))
    if (p.name) parts.push(String(p.name))
    if (p.status) parts.push(String(p.status))
    if (p.error) {
      const err = p.error as { message?: string } | string
      parts.push(
        'error: ' +
          (typeof err === 'string' ? err : err && err.message ? err.message : 'unknown'),
      )
    }
  }
  return parts.join(' · ')
}
