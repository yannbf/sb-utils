/**
 * Pure timeline-math helpers — extracted from features/timeline.ts so
 * they can be unit-tested without booting the canvas engine. The engine
 * imports from here at boot.
 */

export type TimelineSegment = {
  srcStart: number
  srcEnd: number
  dispStart: number
  dispEnd: number
  type: 'data' | 'gap'
  /** Original gap length in source-time ms (only set for type==='gap'). */
  srcLen?: number
}

/**
 * Returns [first, last] _receivedAt range across events. Falls back to a
 * synthetic 60s window ending at `now` when there are no events.
 * Guarantees `last - first >= 1000` so range math doesn't divide by zero.
 */
export function computeDataRange(
  events: Array<{ _receivedAt?: number }>,
  now: number = Date.now(),
): [number, number] {
  let first = Infinity
  let last = -Infinity
  for (const e of events) {
    if (!e._receivedAt) continue
    if (e._receivedAt < first) first = e._receivedAt
    if (e._receivedAt > last) last = e._receivedAt
  }
  if (!isFinite(first)) return [now - 60000, now]
  if (last - first < 1000) last = first + 1000
  return [first, last]
}

/**
 * Build piecewise time-mapping segments. When `collapseGaps` is true,
 * any inter-event gap > threshold (max(3000ms, median*8)) is compressed
 * to `gapSegDispMs` of display space. Otherwise a single data segment
 * spans first→last.
 *
 * Returned segments cover the full first→last range with no holes.
 */
export function buildSegments(
  stamps: number[],
  options: { collapseGaps: boolean; gapSegDispMs?: number } = { collapseGaps: false },
): TimelineSegment[] {
  const gapSegDispMs = options.gapSegDispMs ?? 400
  if (stamps.length === 0) return []
  if (stamps.length === 1) {
    const s = stamps[0]
    return [{ srcStart: s, srcEnd: s, dispStart: 0, dispEnd: 0, type: 'data' }]
  }
  const sorted = stamps.slice().sort((a, b) => a - b)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (!options.collapseGaps || sorted.length < 2) {
    return [{ srcStart: first, srcEnd: last, dispStart: 0, dispEnd: last - first, type: 'data' }]
  }

  const gaps: number[] = []
  for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i] - sorted[i - 1])
  const sortedGaps = gaps.slice().sort((a, b) => a - b)
  const median = sortedGaps[Math.floor(sortedGaps.length / 2)] || 0
  const threshold = Math.max(3000, median * 8)

  const segs: TimelineSegment[] = []
  let disp = 0
  let segStart = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i] - sorted[i - 1]
    if (gap > threshold) {
      const dataLen = sorted[i - 1] - segStart
      segs.push({
        srcStart: segStart,
        srcEnd: sorted[i - 1],
        dispStart: disp,
        dispEnd: disp + dataLen,
        type: 'data',
      })
      disp += dataLen
      segs.push({
        srcStart: sorted[i - 1],
        srcEnd: sorted[i],
        dispStart: disp,
        dispEnd: disp + gapSegDispMs,
        type: 'gap',
        srcLen: gap,
      })
      disp += gapSegDispMs
      segStart = sorted[i]
    }
  }
  const dataLen = sorted[sorted.length - 1] - segStart
  segs.push({
    srcStart: segStart,
    srcEnd: sorted[sorted.length - 1],
    dispStart: disp,
    dispEnd: disp + dataLen,
    type: 'data',
  })
  return segs
}

/**
 * Map a source-time millisecond value into display-space using the
 * piecewise segments. Linearly extrapolates past the last segment so
 * dispToSrc stays a round-trip identity for every value.
 */
export function srcToDisp(srcMs: number, segs: TimelineSegment[]): number {
  if (segs.length === 0) return 0
  if (srcMs <= segs[0].srcStart) return segs[0].dispStart + (srcMs - segs[0].srcStart)
  const lastSeg = segs[segs.length - 1]
  if (srcMs >= lastSeg.srcEnd) return lastSeg.dispEnd + (srcMs - lastSeg.srcEnd)
  for (const s of segs) {
    if (srcMs >= s.srcStart && srcMs <= s.srcEnd) {
      if (s.type === 'data') return s.dispStart + (srcMs - s.srcStart)
      const frac = (srcMs - s.srcStart) / Math.max(1, s.srcEnd - s.srcStart)
      return s.dispStart + frac * (s.dispEnd - s.dispStart)
    }
  }
  return segs[0].dispStart
}

export function dispToSrc(dispMs: number, segs: TimelineSegment[]): number {
  if (segs.length === 0) return 0
  if (dispMs <= segs[0].dispStart) return segs[0].srcStart + (dispMs - segs[0].dispStart)
  const lastSeg = segs[segs.length - 1]
  if (dispMs >= lastSeg.dispEnd) return lastSeg.srcEnd + (dispMs - lastSeg.dispEnd)
  for (const s of segs) {
    if (dispMs >= s.dispStart && dispMs <= s.dispEnd) {
      if (s.type === 'data') return s.srcStart + (dispMs - s.dispStart)
      const frac = (dispMs - s.dispStart) / Math.max(1, s.dispEnd - s.dispStart)
      return s.srcStart + frac * (s.srcEnd - s.srcStart)
    }
  }
  return segs[0].srcStart
}

/**
 * Pick a tick interval in ms targeting roughly `totalPx / pxPerTick`
 * ticks across `rangeMs` of view. Always returns one of a curated set
 * of "nice" values (1s, 2s, 5s, …, 1h).
 */
export function chooseTickInterval(rangeMs: number, pxPerTick: number, totalPx: number): number {
  const candidates = [1000, 2000, 5000, 10000, 15000, 30000, 60000, 120000, 300000, 600000, 1800000, 3600000]
  const targetTicks = Math.max(4, Math.floor(totalPx / pxPerTick))
  const ideal = rangeMs / targetTicks
  for (const c of candidates) if (c >= ideal) return c
  return candidates[candidates.length - 1]
}

/**
 * Returns the navigable list for an event in the timeline drawer. Cache
 * pseudo-events form one chronological list across all keys (drawer
 * prev/next walks every cache write in time order, regardless of
 * namespace/key — same UX as scrubbing cache edits in a folder). All
 * other events navigate within their session.
 *
 * The optional `matches` predicate filters out events the user has
 * hidden in the sidebar (sessions, types, search, cache visibility,
 * etc.). Without it, prev/next would happily land on dots that aren't
 * even visible on the canvas. The currently-selected event itself
 * always stays in the list — even if it'd be filtered out — so its
 * `pos` lookup in TimelineDrawer doesn't return -1 mid-navigation.
 */
export function navigableEventsFor<
  E extends { _source?: string; sessionId?: string; _receivedAt?: number },
>(event: E, all: E[], matches?: (e: E) => boolean): E[] {
  if (!event) return []
  const byTime = (a: E, b: E) => (a._receivedAt || 0) - (b._receivedAt || 0)
  const keep = (e: E) => e === event || !matches || matches(e)
  if (event._source === 'cache-watch') {
    return all.filter((e) => e._source === 'cache-watch' && keep(e)).slice().sort(byTime)
  }
  if (event.sessionId) {
    return all.filter((e) => e.sessionId === event.sessionId && keep(e)).slice().sort(byTime)
  }
  return []
}

/**
 * Decide whether a dot is currently outside the visible slice of the
 * canvas (the canvas width minus the drawer overlay on the right and a
 * small left/right padding). Used to decide whether a navigate or
 * canvas-click should pan the view to bring the dot back into view.
 */
export function shouldPanToFocus(opts: {
  dotX: number
  canvasW: number
  drawerW: number
  labelColW: number
  pad?: number
}): boolean {
  const { dotX, canvasW, drawerW, labelColW } = opts
  const pad = opts.pad ?? 24
  const visibleLeft = labelColW + pad
  const visibleRight = canvasW - drawerW - pad
  if (visibleRight <= visibleLeft) return false
  return dotX < visibleLeft || dotX > visibleRight
}

/**
 * Compute the new viewStart/viewEnd disp-space window so a dot at
 * `dotDisp` is centered in the visible slice (canvas minus drawer).
 * Returns `null` when the visible slice is too small to make sense
 * (e.g. drawer wider than the canvas).
 */
export function centerOnDot(opts: {
  dotDisp: number
  viewStartDisp: number
  viewEndDisp: number
  canvasW: number
  drawerW: number
  labelColW: number
  pad?: number
}): { viewStartDisp: number; viewEndDisp: number } | null {
  const { dotDisp, viewStartDisp, viewEndDisp, canvasW, drawerW, labelColW } = opts
  const pad = opts.pad ?? 24
  const visibleLeft = labelColW + pad
  const visibleRight = canvasW - drawerW - pad
  if (visibleRight <= visibleLeft) return null
  const viewRange = viewEndDisp - viewStartDisp
  if (viewRange <= 0) return null
  const contentW = canvasW - labelColW
  if (contentW <= 0) return null
  const visibleCenter = (visibleLeft + visibleRight) / 2
  const dispPerPx = viewRange / contentW
  const desiredStart = dotDisp - (visibleCenter - labelColW) * dispPerPx
  return { viewStartDisp: desiredStart, viewEndDisp: desiredStart + viewRange }
}
