/**
 * HTML-string renderers used by the Timeline drawer's imperative DOM.
 * Will go away once Timeline migrates to a Preact component (the
 * drawer becomes JSX with native <JsonView /> / <DiffView />).
 */

import { escapeHtml } from './format'
import { lcsLineDiff } from './lcs-diff'

export function renderJsonHtml(obj: unknown, depth: number, path: string): string {
  if (obj === null) return '<span class="json-null">null</span>'
  if (obj === undefined) return '<span class="json-null">undefined</span>'
  if (typeof obj === 'string') return '<span class="json-string">"' + escapeHtml(obj) + '"</span>'
  if (typeof obj === 'number') return '<span class="json-number">' + String(obj) + '</span>'
  if (typeof obj === 'boolean') return '<span class="json-boolean">' + String(obj) + '</span>'

  const isArray = Array.isArray(obj)
  const entries: Array<[string | number, unknown]> = isArray
    ? (obj as unknown[]).map((v, i) => [i, v] as [number, unknown])
    : Object.entries(obj as Record<string, unknown>)
  const open = isArray ? '[' : '{'
  const close = isArray ? ']' : '}'
  const id = 'j' + path.replace(/[^a-zA-Z0-9]/g, '_') + '_' + depth

  if (entries.length === 0) {
    return '<span class="json-bracket">' + open + close + '</span>'
  }

  const indent = '  '.repeat(depth + 1)
  const closingIndent = '  '.repeat(depth)
  const autoCollapse = depth >= 2 && entries.length > 3

  let html = '<span class="json-bracket">' + open + '</span>'
  html +=
    '<button class="json-toggle" data-target="' +
    id +
    '" onclick="__sbToggleJson(this)">' +
    (autoCollapse ? '&#9654;' : '&#9660;') +
    '</button>'
  html +=
    '<span class="json-collapsed-indicator" id="' +
    id +
    '-hint"' +
    (autoCollapse ? '' : ' style="display:none"') +
    '> ' +
    entries.length +
    (isArray ? ' items' : ' keys') +
    ' </span>'
  html += '<span id="' + id + '"' + (autoCollapse ? ' class="json-hidden"' : '') + '>\n'

  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i]
    html += indent
    if (!isArray) html += '<span class="json-key">"' + escapeHtml(String(key)) + '"</span>: '
    html += renderJsonHtml(val, depth + 1, path + '.' + key)
    if (i < entries.length - 1) html += ','
    html += '\n'
  }
  html += closingIndent + '</span><span class="json-bracket">' + close + '</span>'
  return html
}

/**
 * Toggle helper for the buttons emitted by renderJsonHtml. Exposed on
 * window from main.tsx so inline `onclick="__sbToggleJson(this)"` calls
 * resolve.
 */
export function toggleJsonHtml(btn: HTMLElement): void {
  const targetId = btn.dataset.target
  if (!targetId) return
  const target = document.getElementById(targetId)
  const hint = document.getElementById(targetId + '-hint')
  if (!target) return
  const collapsed = target.classList.toggle('json-hidden')
  btn.innerHTML = collapsed ? '&#9654;' : '&#9660;'
  if (hint) hint.style.display = collapsed ? '' : 'none'
}

const SXS_CONTEXT = 3

type LcsOp = ReturnType<typeof lcsLineDiff>[number]
type SxsOp =
  | { op: 'eq'; left: string; right: string; li: number; ri: number }
  | { op: 'change'; left: string; right: string; li: number; ri: number }
  | { op: 'del'; left: string; li: number }
  | { op: 'add'; right: string; ri: number }

function pairAdjacentChanges(ops: LcsOp[]): SxsOp[] {
  const out: SxsOp[] = []
  let i = 0
  while (i < ops.length) {
    if (ops[i].op === 'del') {
      const dels: any[] = []
      while (i < ops.length && ops[i].op === 'del') {
        dels.push(ops[i])
        i++
      }
      const adds: any[] = []
      while (i < ops.length && ops[i].op === 'add') {
        adds.push(ops[i])
        i++
      }
      const n = Math.max(dels.length, adds.length)
      for (let j = 0; j < n; j++) {
        const d = dels[j]
        const a = adds[j]
        if (d && a) out.push({ op: 'change', left: d.left, right: a.right, li: d.li, ri: a.ri })
        else if (d) out.push(d)
        else if (a) out.push(a)
      }
    } else if (ops[i].op === 'add') {
      while (i < ops.length && ops[i].op === 'add') {
        out.push(ops[i] as any)
        i++
      }
    } else {
      out.push(ops[i] as any)
      i++
    }
  }
  return out
}

function jsonLines(value: unknown): string[] {
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

function renderSxsRow(o: SxsOp): string {
  const cellHtml = (text: string | null | undefined) =>
    '<pre class="sxs-cell-pre">' + (text == null ? '' : escapeHtml(text)) + '</pre>'
  if (o.op === 'eq') {
    return (
      '<div class="sxs-row eq">' +
      '<div class="sxs-gutter">' +
      o.li +
      '</div>' +
      '<div class="sxs-cell">' +
      cellHtml(o.left) +
      '</div>' +
      '<div class="sxs-gutter">' +
      o.ri +
      '</div>' +
      '<div class="sxs-cell">' +
      cellHtml(o.right) +
      '</div>' +
      '</div>'
    )
  }
  if (o.op === 'change') {
    return (
      '<div class="sxs-row change">' +
      '<div class="sxs-gutter del-gutter">' +
      o.li +
      '</div>' +
      '<div class="sxs-cell del-cell"><span class="sxs-marker">-</span>' +
      cellHtml(o.left) +
      '</div>' +
      '<div class="sxs-gutter add-gutter">' +
      o.ri +
      '</div>' +
      '<div class="sxs-cell add-cell"><span class="sxs-marker">+</span>' +
      cellHtml(o.right) +
      '</div>' +
      '</div>'
    )
  }
  if (o.op === 'del') {
    return (
      '<div class="sxs-row del">' +
      '<div class="sxs-gutter del-gutter">' +
      o.li +
      '</div>' +
      '<div class="sxs-cell del-cell"><span class="sxs-marker">-</span>' +
      cellHtml(o.left) +
      '</div>' +
      '<div class="sxs-gutter"></div>' +
      '<div class="sxs-cell empty"></div>' +
      '</div>'
    )
  }
  return (
    '<div class="sxs-row add">' +
    '<div class="sxs-gutter"></div>' +
    '<div class="sxs-cell empty"></div>' +
    '<div class="sxs-gutter add-gutter">' +
    o.ri +
    '</div>' +
    '<div class="sxs-cell add-cell"><span class="sxs-marker">+</span>' +
    cellHtml(o.right) +
    '</div>' +
    '</div>'
  )
}

function buildSxsRows(ops: SxsOp[]): string {
  const rows: string[] = []
  let i = 0
  while (i < ops.length) {
    const op = ops[i]
    if (op.op !== 'eq') {
      rows.push(renderSxsRow(op))
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
    for (let k = 0; k < keepHead; k++) rows.push(renderSxsRow(run[k]))
    if (hiddenLen > 0) {
      const hiddenStart = run[keepHead].li
      const hiddenEnd = run[keepHead + hiddenLen - 1].li
      const hiddenOps = run.slice(keepHead, keepHead + hiddenLen)
      const encoded = encodeURIComponent(JSON.stringify(hiddenOps))
      rows.push(
        '<div class="sxs-row sxs-collapsed" data-sxs-hidden="' +
          encoded +
          '">' +
          '<div class="sxs-collapsed-cell">' +
          '<button type="button" class="sxs-expand-btn">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/><polyline points="6 3 12 9 18 3"/></svg>' +
          ' Expand ' +
          hiddenLen +
          ' unchanged line' +
          (hiddenLen === 1 ? '' : 's') +
          ' <span class="sxs-collapsed-range">(' +
          hiddenStart +
          '–' +
          hiddenEnd +
          ')</span>' +
          '</button>' +
          '</div>' +
          '</div>',
      )
    }
    for (let k = run.length - keepTail; k < run.length; k++) rows.push(renderSxsRow(run[k]))
  }
  return rows.join('')
}

export function renderCacheDiffHtml(payload: any): string {
  if (!payload) return '<div class="diff-view-empty">No diff data on this event.</div>'
  const op = payload.operation
  let prev = payload.previousContent
  let next = payload.content
  let leftLines: string[]
  let rightLines: string[]
  let headerLeft = 'Before'
  let headerRight = 'After'
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
      return '<div class="diff-view-empty">No detected changes between the previous and current value.</div>'
    }
    leftLines = jsonLines(prev)
    rightLines = jsonLines(next)
  }
  const ops = pairAdjacentChanges(lcsLineDiff(leftLines, rightLines) as any) as SxsOp[]
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
  const body = buildSxsRows(ops)
  return (
    '<div class="sxs-diff">' +
    '<div class="sxs-header">' +
    '<div class="sxs-header-cell">' +
    escapeHtml(headerLeft) +
    ' <span class="sxs-stat sxs-stat-removed">−' +
    removed +
    '</span></div>' +
    '<div class="sxs-header-cell">' +
    escapeHtml(headerRight) +
    ' <span class="sxs-stat sxs-stat-added">+' +
    added +
    '</span></div>' +
    '</div>' +
    '<div class="sxs-body">' +
    body +
    '</div>' +
    '</div>'
  )
}

/**
 * Delegated click handler for the "Expand N unchanged lines" buttons in
 * the legacy diff HTML output. Listens at the document level since the
 * diff view is rebuilt on every tab switch — listeners on the rendered
 * markup would leak. Installed once from main.tsx.
 */
export function installSxsExpandHandler(): void {
  if ((window as any).__sbSxsExpandInstalled) return
  ;(window as any).__sbSxsExpandInstalled = true
  document.addEventListener('click', (e) => {
    const target = e.target as Element | null
    const btn = target && (target.closest ? target.closest('.sxs-expand-btn') : null)
    if (!btn) return
    const row = btn.closest<HTMLElement>('.sxs-collapsed')
    if (!row) return
    let hidden: SxsOp[]
    try {
      hidden = JSON.parse(decodeURIComponent(row.dataset.sxsHidden || '[]'))
    } catch {
      return
    }
    const html = hidden.map(renderSxsRow).join('')
    row.outerHTML = html
  })
}
