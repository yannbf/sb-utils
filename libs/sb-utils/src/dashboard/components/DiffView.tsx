/**
 * Side-by-side cache write diff. Replaces the legacy renderCacheDiff
 * HTML-string output + document-level click delegation. Built on top of
 * `lib/cache-diff.ts` which produces a typed row list; this component
 * just renders it.
 *
 * Collapsed unchanged-line runs use `useState` per row so each is
 * individually expandable, matching the legacy UX.
 */

import { useState } from 'preact/hooks'
import { buildCacheDiff, type DiffData, type SxsOp } from '../lib/cache-diff'

type CachePayload = {
  operation?: string
  previousContent?: unknown
  content?: unknown
} | null

export function DiffView({ payload }: { payload: CachePayload }) {
  const data = buildCacheDiff(payload)
  if (data.empty) return <div class="diff-view-empty">{data.message}</div>

  if (data.mode === 'create' || data.mode === 'delete') {
    return <CreateOrDeleteDiff data={data} />
  }

  return (
    <div class="sxs-diff">
      <div class="sxs-header">
        <div class="sxs-header-cell">
          {data.headerLeft}{' '}
          <span class="sxs-stat sxs-stat-removed">−{data.removed}</span>
        </div>
        <div class="sxs-header-cell">
          {data.headerRight}{' '}
          <span class="sxs-stat sxs-stat-added">+{data.added}</span>
        </div>
      </div>
      <div class="sxs-body">
        {data.rows.map((row, i) =>
          row.kind === 'op' ? (
            <DiffRow key={i} op={row.op} />
          ) : (
            <CollapsedRows
              key={i}
              hidden={row.hidden}
              firstLi={row.firstLi}
              lastLi={row.lastLi}
            />
          ),
        )}
      </div>
    </div>
  )
}

// Threshold above which we render a placeholder instead of the full
// `<pre>`. Even a single `<pre>` with white-space: pre containing
// tens of thousands of lines requires the browser to lay out every
// line up-front to compute the natural height — slow enough to lock
// the tab when 20+ cards expand at once. Below the threshold we
// render the full content immediately; above it the user clicks to
// materialize (per-card).
const CREATE_AUTO_RENDER_LINES = 800

function CreateOrDeleteDiff({ data }: { data: DiffData }) {
  const isCreate = data.mode === 'create'
  const text = data.fullText ?? ''
  const lines = text ? text.split('\n') : []
  const lineCount = lines.length
  const heavy = lineCount > CREATE_AUTO_RENDER_LINES
  const [forceShow, setForceShow] = useState(false)
  const showRows = !heavy || forceShow
  return (
    <div class={'sxs-diff ' + (isCreate ? 'sxs-diff-create' : 'sxs-diff-delete')}>
      <div class="sxs-header">
        <div class="sxs-header-cell sxs-header-cell-single">
          {isCreate ? data.headerRight : data.headerLeft}{' '}
          {isCreate ? (
            <span class="sxs-stat sxs-stat-added">+{data.added}</span>
          ) : (
            <span class="sxs-stat sxs-stat-removed">−{data.removed}</span>
          )}
        </div>
      </div>
      {showRows ? (
        <div class="sxs-body">
          {lines.map((lineText, i) => (
            <CreateDeleteRow
              key={i}
              ri={i + 1}
              text={lineText}
              isCreate={isCreate}
            />
          ))}
        </div>
      ) : (
        <div class="sxs-body sxs-body-placeholder">
          <button
            type="button"
            class="sxs-expand-btn"
            onClick={() => setForceShow(true)}
            title="Render the full diff (may take a moment for very large payloads)"
          >
            Show {lineCount.toLocaleString()} lines
          </button>
          <span class="sxs-placeholder-hint">
            Hidden by default — large payloads can slow rendering when many cards are expanded.
          </span>
        </div>
      )}
    </div>
  )
}

// Per-line row for create / delete diffs. Mirrors the styling of
// `<DiffRow>`'s add/del rows (gutter + marker + cell) so the visual
// language is identical across all diff modes — line numbers, +/-
// markers, and the color-coded cell. Kept as a thin function so the
// `lines.map` above stays readable.
function CreateDeleteRow({
  ri,
  text,
  isCreate,
}: {
  ri: number
  text: string
  isCreate: boolean
}) {
  const cellCls = isCreate ? 'add-cell' : 'del-cell'
  const gutterCls = isCreate ? 'add-gutter' : 'del-gutter'
  const marker = isCreate ? '+' : '−'
  return (
    <div class={'sxs-row-create ' + (isCreate ? 'add' : 'del')}>
      <div class={'sxs-gutter ' + gutterCls}>{ri}</div>
      <div class={'sxs-cell ' + cellCls}>
        <span class="sxs-marker">{marker}</span>
        <Cell text={text} />
      </div>
    </div>
  )
}

function Cell({ text }: { text: string | null | undefined }) {
  return <pre class="sxs-cell-pre">{text == null ? '' : text}</pre>
}

function DiffRow({ op }: { op: SxsOp }) {
  if (op.op === 'eq') {
    return (
      <div class="sxs-row eq">
        <div class="sxs-gutter">{op.li}</div>
        <div class="sxs-cell">
          <Cell text={op.left} />
        </div>
        <div class="sxs-gutter">{op.ri}</div>
        <div class="sxs-cell">
          <Cell text={op.right} />
        </div>
      </div>
    )
  }
  if (op.op === 'change') {
    return (
      <div class="sxs-row change">
        <div class="sxs-gutter del-gutter">{op.li}</div>
        <div class="sxs-cell del-cell">
          <span class="sxs-marker">-</span>
          <Cell text={op.left} />
        </div>
        <div class="sxs-gutter add-gutter">{op.ri}</div>
        <div class="sxs-cell add-cell">
          <span class="sxs-marker">+</span>
          <Cell text={op.right} />
        </div>
      </div>
    )
  }
  if (op.op === 'del') {
    return (
      <div class="sxs-row del">
        <div class="sxs-gutter del-gutter">{op.li}</div>
        <div class="sxs-cell del-cell">
          <span class="sxs-marker">-</span>
          <Cell text={op.left} />
        </div>
        <div class="sxs-gutter" />
        <div class="sxs-cell empty" />
      </div>
    )
  }
  // add
  return (
    <div class="sxs-row add">
      <div class="sxs-gutter" />
      <div class="sxs-cell empty" />
      <div class="sxs-gutter add-gutter">{op.ri}</div>
      <div class="sxs-cell add-cell">
        <span class="sxs-marker">+</span>
        <Cell text={op.right} />
      </div>
    </div>
  )
}

function CollapsedRows({
  hidden,
  firstLi,
  lastLi,
}: {
  hidden: SxsOp[]
  firstLi: number
  lastLi: number
}) {
  const [expanded, setExpanded] = useState(false)
  if (expanded) {
    return (
      <>
        {hidden.map((op, i) => (
          <DiffRow key={i} op={op} />
        ))}
      </>
    )
  }
  return (
    <div class="sxs-row sxs-collapsed">
      <div class="sxs-collapsed-cell">
        <button type="button" class="sxs-expand-btn" onClick={() => setExpanded(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
            <polyline points="6 3 12 9 18 3" />
          </svg>{' '}
          Expand {hidden.length} unchanged line{hidden.length === 1 ? '' : 's'}{' '}
          <span class="sxs-collapsed-range">
            ({firstLi}–{lastLi})
          </span>
        </button>
      </div>
    </div>
  )
}
