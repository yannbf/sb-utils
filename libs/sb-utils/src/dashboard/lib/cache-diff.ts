/**
 * Pure cache-diff helpers — no HTML strings, no DOM. Produces an
 * abstract row list (`SxsRow`) that the Preact <DiffView> component
 * renders. The legacy HTML-string output and document-level click
 * delegation are gone.
 */

import { lcsLineDiff } from './lcs-diff'

export type SxsOp =
  | { op: 'eq'; left: string; right: string; li: number; ri: number }
  | { op: 'change'; left: string; right: string; li: number; ri: number }
  | { op: 'del'; left: string; li: number }
  | { op: 'add'; right: string; ri: number }

export type SxsRow =
  | { kind: 'op'; op: SxsOp }
  | { kind: 'collapsed'; hidden: SxsOp[]; firstLi: number; lastLi: number }

/**
 * Number of unchanged lines kept around each change as visible context.
 * Larger runs of `eq` ops get collapsed into a single expander row that
 * reveals them on click — same UX as GitHub's PR diff.
 */
export const SXS_CONTEXT = 3

export type DeepDiffEntry =
  | { kind: 'changed'; path: Array<string | number>; from: unknown; to: unknown }
  | { kind: 'added'; path: Array<string | number>; to: unknown }
  | { kind: 'removed'; path: Array<string | number>; from: unknown }

/**
 * Recursively walk previousContent vs content and yield a flat list of
 * leaf-level changes with full key paths. Stops recursing into arrays
 * (they're treated as primitives — reordering doesn't render well as a
 * line-by-line diff).
 */
export function deepDiffLeaves(
  prev: unknown,
  next: unknown,
  basePath: Array<string | number> = [],
  out: DeepDiffEntry[] = [],
): DeepDiffEntry[] {
  const isPlainObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v)

  if (!isPlainObj(prev) || !isPlainObj(next)) {
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      out.push({ kind: 'changed', path: basePath, from: prev, to: next })
    }
    return out
  }

  for (const k of Object.keys(prev)) {
    if (!(k in next)) {
      out.push({ kind: 'removed', path: basePath.concat(k), from: prev[k] })
    }
  }
  for (const k of Object.keys(next)) {
    if (!(k in prev)) {
      out.push({ kind: 'added', path: basePath.concat(k), to: next[k] })
      continue
    }
    if (JSON.stringify(prev[k]) === JSON.stringify(next[k])) continue
    if (isPlainObj(prev[k]) && isPlainObj(next[k])) {
      deepDiffLeaves(prev[k], next[k], basePath.concat(k), out)
    } else {
      out.push({ kind: 'changed', path: basePath.concat(k), from: prev[k], to: next[k] })
    }
  }
  return out
}

/**
 * Pretty-print a JSON-serializable value for the diff. Returns lines so
 * the caller can feed them straight into the LCS diff. `undefined` is
 * treated as zero lines (used for create/delete cases).
 */
export function jsonLines(value: unknown): string[] {
  if (value === undefined) return []
  if (value === null) return ['null']
  let json: string
  try {
    json = JSON.stringify(value, null, 2)
  } catch {
    json = String(value)
  }
  if (typeof json !== 'string') json = String(json)
  return json.split('\n')
}

/**
 * Walk the LCS ops list and pair every contiguous run of `del`s followed
 * by `add`s into single `change` rows so before/after values appear on
 * the same baseline. Leftover unpaired ops (when the run lengths differ)
 * stay as plain `del` / `add` rows.
 */
export function pairAdjacentChanges(
  ops: ReturnType<typeof lcsLineDiff>,
): SxsOp[] {
  const out: SxsOp[] = []
  let i = 0
  while (i < ops.length) {
    if (ops[i].op === 'del') {
      const dels: SxsOp[] = []
      while (i < ops.length && ops[i].op === 'del') {
        dels.push(ops[i] as SxsOp)
        i++
      }
      const adds: SxsOp[] = []
      while (i < ops.length && ops[i].op === 'add') {
        adds.push(ops[i] as SxsOp)
        i++
      }
      const n = Math.max(dels.length, adds.length)
      for (let j = 0; j < n; j++) {
        const d = dels[j] as Extract<SxsOp, { op: 'del' }> | undefined
        const a = adds[j] as Extract<SxsOp, { op: 'add' }> | undefined
        if (d && a) {
          out.push({ op: 'change', left: d.left, right: a.right, li: d.li, ri: a.ri })
        } else if (d) {
          out.push(d)
        } else if (a) {
          out.push(a)
        }
      }
    } else if (ops[i].op === 'add') {
      while (i < ops.length && ops[i].op === 'add') {
        out.push(ops[i] as SxsOp)
        i++
      }
    } else {
      out.push(ops[i] as SxsOp)
      i++
    }
  }
  return out
}

/**
 * Walk the paired ops list and decide which lines to keep visible vs
 * collapse into "Expand N unchanged lines" rows. Always keeps
 * `SXS_CONTEXT` lines of context next to each change.
 */
export function buildSxsRows(ops: SxsOp[]): SxsRow[] {
  const rows: SxsRow[] = []
  let i = 0
  while (i < ops.length) {
    const op = ops[i]
    if (op.op !== 'eq') {
      rows.push({ kind: 'op', op })
      i++
      continue
    }

    let runStart = i
    while (i < ops.length && ops[i].op === 'eq') i++
    const run = ops.slice(runStart, i) as Array<Extract<SxsOp, { op: 'eq' }>>

    const isFirst = runStart === 0
    const isLast = i === ops.length
    const ctx = SXS_CONTEXT

    const keepHead = isFirst ? 0 : Math.min(ctx, run.length)
    const keepTail = isLast ? 0 : Math.min(ctx, run.length - keepHead)
    const hiddenLen = run.length - keepHead - keepTail

    for (let k = 0; k < keepHead; k++) rows.push({ kind: 'op', op: run[k] })

    if (hiddenLen > 0) {
      const hidden = run.slice(keepHead, keepHead + hiddenLen)
      rows.push({
        kind: 'collapsed',
        hidden,
        firstLi: hidden[0].li,
        lastLi: hidden[hidden.length - 1].li,
      })
    }

    for (let k = run.length - keepTail; k < run.length; k++)
      rows.push({ kind: 'op', op: run[k] })
  }
  return rows
}

/**
 * Top-level: take a cache-write payload and produce the data the
 * <DiffView> component needs (header labels, ops, row layout, stats).
 * Returns `null` when there's nothing to diff.
 */
export type DiffData = {
  headerLeft: string
  headerRight: string
  rows: SxsRow[]
  added: number
  removed: number
  empty: false
}
export type DiffEmpty = { empty: true; message: string }

export function buildCacheDiff(
  payload: { operation?: string; previousContent?: unknown; content?: unknown } | null,
): DiffData | DiffEmpty {
  if (!payload) return { empty: true, message: 'No diff data on this event.' }
  const { operation: op, previousContent: prev, content: next } = payload

  let leftLines: string[]
  let rightLines: string[]
  let headerLeft: string
  let headerRight: string

  if (op === 'create') {
    leftLines = []
    rightLines = jsonLines(next)
    headerLeft = 'Before (empty)'
    headerRight = 'Created'
  } else if (op === 'delete') {
    leftLines = jsonLines(prev)
    rightLines = []
    headerLeft = 'Deleted'
    headerRight = 'After (gone)'
  } else {
    if (JSON.stringify(prev) === JSON.stringify(next)) {
      return { empty: true, message: 'No detected changes between the previous and current value.' }
    }
    leftLines = jsonLines(prev)
    rightLines = jsonLines(next)
    headerLeft = 'Before'
    headerRight = 'After'
  }

  const ops = pairAdjacentChanges(lcsLineDiff(leftLines, rightLines))
  const rows = buildSxsRows(ops)

  let added = 0
  let removed = 0
  for (const o of ops) {
    if (o.op === 'add') added++
    else if (o.op === 'del') removed++
    else if (o.op === 'change') {
      added++
      removed++
    }
  }
  return { headerLeft, headerRight, rows, added, removed, empty: false }
}
