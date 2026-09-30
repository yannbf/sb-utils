/**
 * Longest-common-subsequence based line diff. Powers the cache-event
 * side-by-side diff renderer. Pure and dependency-free so it can be
 * unit-tested without a DOM.
 */

export type DiffOp =
  | { op: 'eq'; left: string; right: string; li: number; ri: number }
  | { op: 'add'; right: string; ri: number }
  | { op: 'del'; left: string; li: number }

/**
 * Produce a flat sequence of `eq` / `add` / `del` ops describing how to
 * transform `leftLines` into `rightLines`. Output is in left-to-right /
 * top-to-bottom order, ready to drive a side-by-side renderer. `li` / `ri`
 * are 1-based line numbers on the respective sides.
 */
export function lcsLineDiff(leftLines: string[], rightLines: string[]): DiffOp[] {
  const m = leftLines.length
  const n = rightLines.length
  const dp: Int32Array[] = []
  for (let i = 0; i <= m; i++) dp.push(new Int32Array(n + 1))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  const ops: DiffOp[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      ops.push({ op: 'eq', left: leftLines[i - 1], right: rightLines[j - 1], li: i, ri: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ op: 'add', right: rightLines[j - 1], ri: j })
      j--
    } else {
      ops.push({ op: 'del', left: leftLines[i - 1], li: i })
      i--
    }
  }
  ops.reverse()
  return ops
}
