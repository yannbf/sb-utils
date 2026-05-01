import { describe, expect, it } from 'vitest'
import { escapeHtml, formatGapDuration } from '../src/dashboard/lib/format'

describe('escapeHtml', () => {
  it('escapes the four characters that break HTML attributes and text', () => {
    expect(escapeHtml(`a&b<c>d"e`)).toBe('a&amp;b&lt;c&gt;d&quot;e')
  })

  it('handles already-escaped & without double-escaping further chars', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })

  it('returns identical input for safe strings', () => {
    expect(escapeHtml('hello world 123')).toBe('hello world 123')
  })
})

describe('formatGapDuration', () => {
  it('renders sub-second durations in milliseconds', () => {
    expect(formatGapDuration(0)).toBe('0ms')
    expect(formatGapDuration(147)).toBe('147ms')
    expect(formatGapDuration(999)).toBe('999ms')
  })

  it('renders sub-minute durations as seconds with one decimal', () => {
    expect(formatGapDuration(1000)).toBe('1.0s')
    expect(formatGapDuration(3450)).toBe('3.5s')
    expect(formatGapDuration(59_999)).toBe('60.0s')
  })

  it('renders sub-hour durations as rounded minutes', () => {
    expect(formatGapDuration(60_000)).toBe('1m')
    expect(formatGapDuration(150_000)).toBe('3m')
    expect(formatGapDuration(3_599_000)).toBe('60m')
  })

  it('renders hour-plus durations with one decimal', () => {
    expect(formatGapDuration(3_600_000)).toBe('1.0h')
    expect(formatGapDuration(5_400_000)).toBe('1.5h')
  })
})
