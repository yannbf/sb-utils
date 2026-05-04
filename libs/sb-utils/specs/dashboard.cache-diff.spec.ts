import { describe, it, expect } from 'vitest'
import {
  buildCacheDiff,
  pairAdjacentChanges,
  buildSxsRows,
  jsonLines,
  deepDiffLeaves,
} from '../src/dashboard/lib/cache-diff'

describe('jsonLines', () => {
  it('returns [] for undefined and ["null"] for null', () => {
    expect(jsonLines(undefined)).toEqual([])
    expect(jsonLines(null)).toEqual(['null'])
  })

  it('pretty-prints objects across multiple lines', () => {
    const lines = jsonLines({ a: 1, b: 2 })
    expect(lines.length).toBeGreaterThan(1)
    expect(lines[0]).toBe('{')
  })
})

describe('pairAdjacentChanges', () => {
  it('pairs adjacent del+add into change ops', () => {
    const ops = [
      { op: 'del' as const, left: 'a', li: 1 },
      { op: 'add' as const, right: 'A', ri: 1 },
    ]
    const out = pairAdjacentChanges(ops)
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ op: 'change', left: 'a', right: 'A', li: 1, ri: 1 })
  })

  it('keeps unmatched del / add as-is', () => {
    const ops = [
      { op: 'del' as const, left: 'a', li: 1 },
      { op: 'del' as const, left: 'b', li: 2 },
      { op: 'add' as const, right: 'A', ri: 1 },
    ]
    const out = pairAdjacentChanges(ops)
    expect(out).toEqual([
      { op: 'change', left: 'a', right: 'A', li: 1, ri: 1 },
      { op: 'del', left: 'b', li: 2 },
    ])
  })

  it('keeps add-only runs untouched', () => {
    const ops = [
      { op: 'eq' as const, left: 'x', right: 'x', li: 1, ri: 1 },
      { op: 'add' as const, right: 'A', ri: 2 },
    ]
    const out = pairAdjacentChanges(ops)
    expect(out).toEqual(ops)
  })
})

describe('buildSxsRows', () => {
  it('keeps SXS_CONTEXT lines around each change and collapses long eq runs', () => {
    // 10 unchanged lines, then one change, then 10 more unchanged.
    const ops: any[] = []
    for (let i = 1; i <= 10; i++) ops.push({ op: 'eq', left: 'a' + i, right: 'a' + i, li: i, ri: i })
    ops.push({ op: 'change', left: 'old', right: 'new', li: 11, ri: 11 })
    for (let i = 12; i <= 21; i++)
      ops.push({ op: 'eq', left: 'b' + i, right: 'b' + i, li: i, ri: i })

    const rows = buildSxsRows(ops)
    // First 10 are an "isFirst" run: keepHead=0, keepTail=3, hidden=7.
    // Then the change, then the trailing run: keepHead=3, keepTail=0, hidden=7.
    const collapsed = rows.filter((r) => r.kind === 'collapsed')
    expect(collapsed).toHaveLength(2)
    expect(collapsed[0]).toMatchObject({ firstLi: 1, lastLi: 7 })
    expect(collapsed[1]).toMatchObject({ firstLi: 15, lastLi: 21 })
  })

  it('does not collapse short eq runs', () => {
    const ops: any[] = [
      { op: 'eq', left: 'a', right: 'a', li: 1, ri: 1 },
      { op: 'eq', left: 'b', right: 'b', li: 2, ri: 2 },
      { op: 'change', left: 'c', right: 'C', li: 3, ri: 3 },
    ]
    const rows = buildSxsRows(ops)
    expect(rows.filter((r) => r.kind === 'collapsed')).toHaveLength(0)
  })
})

describe('buildCacheDiff', () => {
  it('returns empty for null payload', () => {
    expect(buildCacheDiff(null)).toMatchObject({ empty: true })
  })

  it('handles create operation as a "new file" — right-only, all additions', () => {
    const r = buildCacheDiff({ operation: 'create', content: { a: 1 } })
    if (r.empty) throw new Error('expected diff data')
    expect(r.mode).toBe('create')
    expect(r.headerLeft).toBe('')
    expect(r.headerRight).toBe('New file')
    expect(r.removed).toBe(0)
    expect(r.added).toBeGreaterThan(0)
  })

  it('handles delete operation as all removals', () => {
    const r = buildCacheDiff({ operation: 'delete', previousContent: { a: 1 } })
    if (r.empty) throw new Error('expected diff data')
    expect(r.headerLeft).toBe('Deleted')
    expect(r.headerRight).toBe('After (gone)')
    expect(r.added).toBe(0)
    expect(r.removed).toBeGreaterThan(0)
  })

  it('returns empty for update with identical content', () => {
    const r = buildCacheDiff({
      operation: 'update',
      previousContent: { a: 1 },
      content: { a: 1 },
    })
    expect(r.empty).toBe(true)
  })

  it('counts adds and removes for a real update', () => {
    const r = buildCacheDiff({
      operation: 'update',
      previousContent: { a: 1, b: 2 },
      content: { a: 1, b: 3 },
    })
    if (r.empty) throw new Error('expected diff data')
    // One line changed (b: 2 → b: 3).
    expect(r.added).toBe(1)
    expect(r.removed).toBe(1)
  })
})

describe('deepDiffLeaves', () => {
  it('reports added / removed / changed leaves', () => {
    const out = deepDiffLeaves(
      { a: 1, b: { c: 2, d: 3 } },
      { a: 1, b: { c: 5 }, e: 9 },
    )
    // b.c changed from 2 → 5
    // b.d removed
    // e added
    const kinds = out.map((x) => `${x.kind}:${x.path.join('.')}`)
    expect(kinds.sort()).toEqual(['added:e', 'changed:b.c', 'removed:b.d'])
  })

  it('treats arrays as leaf values (no per-element diff)', () => {
    const out = deepDiffLeaves({ tags: ['x'] }, { tags: ['y'] })
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ kind: 'changed', path: ['tags'] })
  })
})
