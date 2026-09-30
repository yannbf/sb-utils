import { describe, it, expect } from 'vitest'
import { TYPE_COLORS, getColor } from '../src/dashboard/lib/colors'

describe('getColor', () => {
  it('returns the hand-picked color for known event types', () => {
    expect(getColor('boot')).toEqual(TYPE_COLORS.boot)
    expect(getColor('error')).toEqual(TYPE_COLORS.error)
    expect(getColor('save-story')).toEqual(TYPE_COLORS['save-story'])
  })

  it('returns a deterministic fallback for unknown types', () => {
    const a = getColor('unknown-flavor')
    const b = getColor('unknown-flavor')
    expect(a).toEqual(b)
  })

  it('different unknown types map to one of the 8 fallback hues', () => {
    const palette = new Set([
      '#6c9ef8',
      '#4ade80',
      '#c084fc',
      '#fbbf24',
      '#22d3ee',
      '#fb923c',
      '#f472b6',
      '#f87171',
    ])
    for (const t of ['foo', 'bar', 'baz', 'quux', 'beep', 'boop', 'ack', 'flit']) {
      expect(palette.has(getColor(t).fg)).toBe(true)
    }
  })

  it('fg and bg fallback are paired (rgba(...,0.12) of fg)', () => {
    const out = getColor('a-fresh-type')
    // bg is rgba with alpha 0.12, derived from fg.
    expect(out.bg).toMatch(/rgba\(\d{1,3},\d{1,3},\d{1,3},0\.12\)/)
  })
})
