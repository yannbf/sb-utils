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

/**
 * Stable per-user identity key for an event, or null if it carries
 * none. Storybook telemetry attaches two install-scoped identities:
 * `metadata.userSince` (the ms timestamp of when the user was first
 * seen) is stable across ALL of a user's sessions, while
 * `context.anonymousId` is a per-install hash that varies session to
 * session. Grouping by user therefore keys on `userSince` first — so a
 * user's many sessions actually collapse into one group — and only
 * falls back to `anonymousId` when a session has no `userSince` at all.
 * The whole session inherits the first non-null key found across its
 * events (see `userKeyForSession` in timeline-math).
 */
export function userKeyOf(ev: StoredEvent | null | undefined): string | null {
  const md = ev?.metadata as Record<string, unknown> | undefined
  const us = md?.userSince
  if (typeof us === 'number' && Number.isFinite(us)) return 'since:' + us
  if (typeof us === 'string' && us) return 'since:' + us
  const ctx = ev?.context as Record<string, unknown> | undefined
  const anon = ctx?.anonymousId
  if (typeof anon === 'string' && anon) return 'anon:' + anon
  return null
}

/**
 * Short, human-readable label for a user key. Hashes (anonymousId)
 * truncate to their first 8 chars; `since:<ms>` keys render as a date
 * so the group header reads "user since Apr 14" rather than an opaque
 * epoch. Used by the timeline group-by-user header + tooltip.
 */
export function shortUserLabel(key: string): string {
  if (key.startsWith('since:')) {
    const raw = key.slice('since:'.length)
    let n = Number(raw)
    if (!Number.isFinite(n)) return key
    // userSince is a Unix timestamp; some telemetry emits it in seconds
    // rather than ms. Anything below 1e12 (i.e. before year 2001 in ms)
    // is almost certainly seconds, so scale it up before formatting.
    if (n > 0 && n < 1e12) n = n * 1000
    const d = new Date(n)
    // Implausible timestamps (placeholder values like 1) would format to
    // a misleading ~1970 date — show the raw id instead.
    if (d.getFullYear() < 2015) return 'user #' + raw
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }
  if (key.startsWith('anon:')) return key.slice('anon:'.length, 'anon:'.length + 8)
  return key.slice(0, 8)
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
 * common descriptive fields. Returns an empty string when there's
 * nothing useful.
 *
 * Field set is intentionally generic so new event types pick up a
 * sensible label without per-type code:
 *   - `eventType` (e.g. boot's "dev")
 *   - `step` (e.g. init-step's "playwright-install")
 *   - `item` (e.g. onboarding-checklist-status's "moreStories")
 *   - `type` / `name`
 *   - `status` / `result` (init-step's "installed",
 *     onboarding-checklist-status's "done")
 *   - `error` (special-cased to surface the message)
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
    if (p.step) parts.push(String(p.step))
    if (p.item) parts.push(String(p.item))
    if (p.type) parts.push(String(p.type))
    if (p.name) parts.push(String(p.name))
    if (p.status) parts.push(String(p.status))
    if (p.result) parts.push(String(p.result))
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

/**
 * Whether a value should count as "actually populated" for error
 * detection. JS truthy already filters null/undefined/''/0/false/NaN;
 * we additionally treat empty arrays / objects / whitespace-only
 * strings as not-real so an event with `payload: { error: {} }` or
 * `payload: { errorMessage: '' }` doesn't get flagged.
 */
function isMeaningful(v: unknown): boolean {
  if (v == null) return false
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0 && !Number.isNaN(v)
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length > 0
  return true
}

/**
 * Single source of truth for "is this {key, value} pair an error
 * indicator?". Reused both for event-level detection
 * (`hasErrorPayload`) and per-key highlighting in the JSON tree (the
 * red squiggle on the matching property in the Payload tab).
 *
 * Rule: lowercased key contains 'error' or 'fail' AND the value is
 * meaningful (see `isMeaningful` — null / undefined / '' / 0 / false /
 * empty array / empty object don't count).
 */
export function isErrorEntry(key: string, value: unknown): boolean {
  const lk = key.toLowerCase()
  if (!lk.includes('error') && !lk.includes('fail')) return false
  return isMeaningful(value)
}

/**
 * Heuristic: does this event's `payload` carry a populated error/fail
 * field anywhere in its tree? Drives the red error outline on the
 * timeline canvas dot and the event-type badge. Walks the payload
 * (with a depth cap and a visited-set against cycles) because real
 * error info is often nested — e.g. `payload.analysis.uniqueErrorCount`
 * or `payload.result.categorizedErrors`.
 *
 * Cache:* events are intentionally excluded — their payload often
 * carries content fields that mention errors descriptively (e.g. an
 * `errorMessage` key written into the cache by some other process)
 * without indicating that the cache operation itself failed. Only
 * real telemetry (and reconstructed telemetry) gets the highlight.
 */
export function hasErrorPayload(
  ev: { payload?: unknown; _source?: string } | null | undefined,
): boolean {
  if (ev?._source === 'cache-watch') return false
  const p = ev?.payload
  if (!p || typeof p !== 'object') return false
  const seen = new WeakSet<object>()
  const MAX_DEPTH = 6
  const walk = (node: unknown, depth: number): boolean => {
    if (depth > MAX_DEPTH) return false
    if (!node || typeof node !== 'object') return false
    if (seen.has(node as object)) return false
    seen.add(node as object)
    if (Array.isArray(node)) {
      for (const item of node) if (walk(item, depth + 1)) return true
      return false
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (isErrorEntry(k, v)) return true
      if (v && typeof v === 'object' && walk(v, depth + 1)) return true
    }
    return false
  }
  return walk(p, 0)
}
