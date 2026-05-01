/**
 * JSON tree renderer used by event card payload/context/raw tabs and by
 * the cache view. Produces an HTML string with collapsible sub-trees;
 * collapse/expand is wired through `toggleJson(btn)` (exposed on
 * window because the buttons use inline `onclick="toggleJson(this)"`).
 *
 * A native Preact rewrite as a recursive component is on the
 * IMPROVEMENTS.md list — it would replace the dangerouslySetInnerHTML
 * usage in EventCard and CacheView entries.
 */

import { escapeHtml } from './format'

export function renderJson(obj: unknown, depth: number, path: string): string {
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
  // Auto-collapse deeply nested branches with > 3 children so the
  // initial render is scannable instead of a wall of text.
  const autoCollapse = depth >= 2 && entries.length > 3

  let html = '<span class="json-bracket">' + open + '</span>'
  html +=
    '<button class="json-toggle" data-target="' +
    id +
    '" onclick="toggleJson(this)">' +
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
    html += renderJson(val, depth + 1, path + '.' + key)
    if (i < entries.length - 1) html += ','
    html += '\n'
  }
  html += closingIndent + '</span><span class="json-bracket">' + close + '</span>'
  return html
}

/**
 * Click handler for the `<button class="json-toggle" onclick="toggleJson(this)">`
 * markup that `renderJson` emits. Lives here so legacy + Preact dashboards
 * share the same implementation; exposed on `window` from main.tsx.
 */
export function toggleJson(btn: HTMLElement): void {
  const targetId = btn.dataset.target
  if (!targetId) return
  const target = document.getElementById(targetId)
  const hint = document.getElementById(targetId + '-hint')
  if (!target) return
  const collapsed = target.classList.toggle('json-hidden')
  btn.innerHTML = collapsed ? '&#9654;' : '&#9660;'
  if (hint) hint.style.display = collapsed ? '' : 'none'
}
