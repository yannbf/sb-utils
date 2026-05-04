import { describe, expect, it } from 'vitest'
import { lcsLineDiff } from '../src/dashboard/lib/lcs-diff'

describe('lcsLineDiff', () => {
  it('returns all eq ops when both sides match', () => {
    const ops = lcsLineDiff(['a', 'b', 'c'], ['a', 'b', 'c'])
    expect(ops.map((o) => o.op)).toEqual(['eq', 'eq', 'eq'])
    expect(ops).toEqual([
      { op: 'eq', left: 'a', right: 'a', li: 1, ri: 1 },
      { op: 'eq', left: 'b', right: 'b', li: 2, ri: 2 },
      { op: 'eq', left: 'c', right: 'c', li: 3, ri: 3 },
    ])
  })

  it('marks pure additions', () => {
    const ops = lcsLineDiff([], ['a', 'b'])
    expect(ops).toEqual([
      { op: 'add', right: 'a', ri: 1 },
      { op: 'add', right: 'b', ri: 2 },
    ])
  })

  it('marks pure deletions', () => {
    const ops = lcsLineDiff(['a', 'b'], [])
    expect(ops).toEqual([
      { op: 'del', left: 'a', li: 1 },
      { op: 'del', left: 'b', li: 2 },
    ])
  })

  it('aligns common prefix and surfaces middle change as del+add', () => {
    const ops = lcsLineDiff(['a', 'b', 'c'], ['a', 'X', 'c'])
    expect(ops.map((o) => o.op)).toEqual(['eq', 'del', 'add', 'eq'])
    expect(ops[0]).toMatchObject({ op: 'eq', left: 'a', right: 'a' })
    expect(ops[1]).toMatchObject({ op: 'del', left: 'b' })
    expect(ops[2]).toMatchObject({ op: 'add', right: 'X' })
    expect(ops[3]).toMatchObject({ op: 'eq', left: 'c', right: 'c' })
  })

  it('produces stable line numbers (1-based) on each side', () => {
    const ops = lcsLineDiff(['a', 'b'], ['b', 'a'])
    // We don't pin the exact algorithm output here — just that li/ri are
    // 1-based integers in the right ranges, and the multiset of contents is
    // preserved across both sides.
    for (const o of ops) {
      if (o.op === 'eq') {
        expect(o.li).toBeGreaterThanOrEqual(1)
        expect(o.li).toBeLessThanOrEqual(2)
        expect(o.ri).toBeGreaterThanOrEqual(1)
        expect(o.ri).toBeLessThanOrEqual(2)
      }
    }
    const dels = ops.filter((o) => o.op === 'del').map((o: any) => o.left)
    const adds = ops.filter((o) => o.op === 'add').map((o: any) => o.right)
    const eqs = ops.filter((o) => o.op === 'eq').map((o: any) => o.left)
    // After applying the diff to ['a','b'], we should get ['b','a'].
    // Equivalently: deletions + equals match left, additions + equals match right.
    expect([...dels, ...eqs].sort()).toEqual(['a', 'b'])
    expect([...adds, ...eqs].sort()).toEqual(['a', 'b'])
  })
})
