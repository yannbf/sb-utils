/**
 * Pure formatting helpers used across the dashboard. Extracted from the
 * original inline script so they can be reused (and unit-tested) without
 * pulling in the rest of the imperative dashboard code.
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Coarse human-readable duration. Tuned for the timeline's gap labels —
 * "147ms", "3.4s", "12m", "1.2h". Anything under a second keeps the raw
 * millisecond count; anything under a minute keeps one decimal of seconds;
 * minutes are rounded; hours go back to one decimal.
 */
export function formatGapDuration(ms: number): string {
  if (ms < 1000) return Math.round(ms) + 'ms'
  if (ms < 60_000) return (ms / 1000).toFixed(1) + 's'
  if (ms < 3_600_000) return Math.round(ms / 60_000) + 'm'
  return (ms / 3_600_000).toFixed(1) + 'h'
}

/** Wall-clock "HH:MM" or "HH:MM:SS" — used by the timeline tooltip / drawer. */
export function formatClockTime(ms: number, includeSeconds = false): string {
  const d = new Date(ms)
  const pad2 = (n: number) => (n < 10 ? '0' + n : '' + n)
  const base = pad2(d.getHours()) + ':' + pad2(d.getMinutes())
  return includeSeconds ? base + ':' + pad2(d.getSeconds()) : base
}

/**
 * "MM:SS" or "MM:SS.mmm" elapsed since `firstMs`. Negative deltas clamp
 * to zero — used for "how far into the run was this event" labels where
 * "−00:01" looks like a bug.
 */
export function formatRelTime(ms: number, firstMs: number, withMs = false): string {
  const d = Math.max(0, ms - firstMs)
  const m = Math.floor(d / 60_000)
  const s = Math.floor((d % 60_000) / 1000)
  const pad2 = (n: number) => (n < 10 ? '0' + n : '' + n)
  const base = pad2(m) + ':' + pad2(s)
  if (!withMs) return base
  const mm = Math.floor(d % 1000)
  return base + '.' + (mm < 10 ? '00' + mm : mm < 100 ? '0' + mm : '' + mm)
}
