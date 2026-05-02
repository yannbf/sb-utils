import { describe, it, expect } from 'vitest'
import {
  computeDataRange,
  buildSegments,
  srcToDisp,
  dispToSrc,
  chooseTickInterval,
  navigableEventsFor,
  shouldPanToFocus,
  centerOnDot,
} from '../src/dashboard/lib/timeline-math'

describe('computeDataRange', () => {
  it('returns a synthetic 60s window when there are no events', () => {
    const [a, b] = computeDataRange([], 1_000_000)
    expect(b - a).toBe(60_000)
    expect(b).toBe(1_000_000)
  })

  it('returns [first, last] across event _receivedAt values', () => {
    const [a, b] = computeDataRange([
      { _receivedAt: 1500 },
      { _receivedAt: 1000 },
      { _receivedAt: 5000 },
    ])
    expect(a).toBe(1000)
    expect(b).toBe(5000)
  })

  it('expands a too-narrow range so last - first >= 1000ms', () => {
    const [a, b] = computeDataRange([{ _receivedAt: 1000 }, { _receivedAt: 1100 }])
    expect(a).toBe(1000)
    expect(b - a).toBeGreaterThanOrEqual(1000)
  })

  it('ignores events with no _receivedAt', () => {
    const [a, b] = computeDataRange([{}, { _receivedAt: 7000 }, { _receivedAt: 9000 }] as any)
    expect(a).toBe(7000)
    expect(b).toBe(9000)
  })
})

describe('buildSegments', () => {
  it('returns one data segment when collapseGaps is off', () => {
    const segs = buildSegments([1000, 2000, 3000], { collapseGaps: false })
    expect(segs).toHaveLength(1)
    expect(segs[0].type).toBe('data')
    expect(segs[0].srcStart).toBe(1000)
    expect(segs[0].srcEnd).toBe(3000)
    expect(segs[0].dispEnd - segs[0].dispStart).toBe(2000)
  })

  it('inserts a gap segment for inter-event gaps above the threshold', () => {
    // Median gap = 100ms; threshold = max(3000, 800) = 3000ms.
    // The 5000ms gap exceeds threshold and should compress.
    const stamps = [0, 100, 200, 300, 5300, 5400]
    const segs = buildSegments(stamps, { collapseGaps: true, gapSegDispMs: 400 })
    expect(segs.some((s) => s.type === 'gap')).toBe(true)
    const gap = segs.find((s) => s.type === 'gap')!
    expect(gap.srcLen).toBe(5000)
    expect(gap.dispEnd - gap.dispStart).toBe(400)
  })

  it('produces no gap segments when no inter-event gap exceeds threshold', () => {
    const segs = buildSegments([0, 500, 1000, 1500, 2000], { collapseGaps: true })
    expect(segs.every((s) => s.type === 'data')).toBe(true)
  })

  it('handles a single timestamp as a zero-width data segment', () => {
    const segs = buildSegments([4242], { collapseGaps: true })
    expect(segs).toHaveLength(1)
    expect(segs[0].srcStart).toBe(4242)
    expect(segs[0].srcEnd).toBe(4242)
  })

  it('returns empty list when given no stamps', () => {
    expect(buildSegments([], { collapseGaps: false })).toEqual([])
  })
})

describe('srcToDisp / dispToSrc', () => {
  it('round-trips inside data segments', () => {
    const segs = buildSegments([0, 1000, 2000, 3000], { collapseGaps: false })
    for (const t of [0, 250, 1500, 2999, 3000]) {
      expect(dispToSrc(srcToDisp(t, segs), segs)).toBeCloseTo(t, 6)
    }
  })

  it('round-trips inside gap segments (after compression)', () => {
    const segs = buildSegments([0, 100, 6000, 6100], {
      collapseGaps: true,
      gapSegDispMs: 400,
    })
    // pick an interior point of the gap segment
    const gap = segs.find((s) => s.type === 'gap')!
    const mid = (gap.dispStart + gap.dispEnd) / 2
    const src = dispToSrc(mid, segs)
    expect(srcToDisp(src, segs)).toBeCloseTo(mid, 6)
  })

  it('extrapolates linearly past the last segment', () => {
    const segs = buildSegments([0, 1000], { collapseGaps: false })
    expect(srcToDisp(1500, segs)).toBe(1500) // disp range is 0..1000, +500 past
    expect(dispToSrc(1500, segs)).toBe(1500)
  })
})

describe('chooseTickInterval', () => {
  it('returns the smallest "nice" interval >= ideal', () => {
    // 60s range, want ~6 ticks → ideal = 10000ms → returns 10000
    expect(chooseTickInterval(60_000, 100, 600)).toBe(10_000)
  })
  it('clamps to the largest candidate when range is huge', () => {
    expect(chooseTickInterval(24 * 3600_000, 100, 600)).toBe(3_600_000)
  })
  it('caps target ticks at >= 4', () => {
    // Tiny totalPx → would imply 0 ticks; clamps to 4 ticks of 1s candidate
    expect(chooseTickInterval(1000, 100, 10)).toBe(1000)
  })
})

describe('navigableEventsFor', () => {
  const events = [
    { _index: 1, sessionId: 'a', _receivedAt: 100 },
    { _index: 2, sessionId: 'b', _receivedAt: 200 },
    { _index: 3, sessionId: 'a', _receivedAt: 300 },
    { _index: 4, _source: 'cache-watch', _receivedAt: 250 },
    { _index: 5, _source: 'cache-watch', _receivedAt: 50 },
  ] as const

  it('walks events for the same session, sorted by _receivedAt', () => {
    const list = navigableEventsFor(events[0] as any, events as any)
    expect(list.map((e) => e._index)).toEqual([1, 3])
  })

  it('walks all cache-watch events linearly by time', () => {
    const list = navigableEventsFor(events[3] as any, events as any)
    expect(list.map((e) => e._index)).toEqual([5, 4])
  })

  it('returns an empty list for an event with no session and not cache-watch', () => {
    expect(navigableEventsFor({ _index: 9 } as any, events as any)).toEqual([])
  })
})

describe('shouldPanToFocus', () => {
  it('returns false when the dot is inside the visible slice', () => {
    expect(
      shouldPanToFocus({ dotX: 600, canvasW: 1000, drawerW: 0, labelColW: 130 }),
    ).toBe(false)
  })
  it('returns true when the dot is left of the visible slice', () => {
    expect(
      shouldPanToFocus({ dotX: 100, canvasW: 1000, drawerW: 0, labelColW: 130 }),
    ).toBe(true)
  })
  it('returns true when the dot is right of (and behind) the drawer', () => {
    expect(
      shouldPanToFocus({ dotX: 900, canvasW: 1000, drawerW: 200, labelColW: 130 }),
    ).toBe(true)
  })
  it('returns false when the visible slice has collapsed (drawer too wide)', () => {
    expect(
      shouldPanToFocus({ dotX: 500, canvasW: 200, drawerW: 200, labelColW: 130 }),
    ).toBe(false)
  })
})

describe('centerOnDot', () => {
  it('returns a window of the same length, centered on the dot', () => {
    const out = centerOnDot({
      dotDisp: 500,
      viewStartDisp: 0,
      viewEndDisp: 200,
      canvasW: 1000,
      drawerW: 0,
      labelColW: 130,
    })
    expect(out).not.toBeNull()
    if (!out) return
    expect(out.viewEndDisp - out.viewStartDisp).toBeCloseTo(200, 6)
    // center of visible slice (130 + 24, 1000 - 0 - 24) = 553 → maps back to dot
    // disp at exactly dotDisp=500 (within tolerance for floating math).
    const visibleCenter = (130 + 24 + (1000 - 24)) / 2
    const contentW = 1000 - 130
    const dispPerPx = 200 / contentW
    const expectedStart = 500 - (visibleCenter - 130) * dispPerPx
    expect(out.viewStartDisp).toBeCloseTo(expectedStart, 6)
  })

  it('returns null when the visible slice has collapsed', () => {
    expect(
      centerOnDot({
        dotDisp: 500,
        viewStartDisp: 0,
        viewEndDisp: 200,
        canvasW: 100,
        drawerW: 200,
        labelColW: 130,
      }),
    ).toBeNull()
  })

  it('returns null when viewRange is zero or negative', () => {
    expect(
      centerOnDot({
        dotDisp: 500,
        viewStartDisp: 200,
        viewEndDisp: 200,
        canvasW: 1000,
        drawerW: 0,
        labelColW: 130,
      }),
    ).toBeNull()
  })
})
