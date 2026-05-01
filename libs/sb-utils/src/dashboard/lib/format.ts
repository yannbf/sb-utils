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
  if (ms < 1000) return ms + 'ms'
  if (ms < 60_000) return (ms / 1000).toFixed(1) + 's'
  if (ms < 3_600_000) return Math.round(ms / 60_000) + 'm'
  return (ms / 3_600_000).toFixed(1) + 'h'
}
