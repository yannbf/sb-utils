// @ts-nocheck
/**
 * Cache write side-by-side diff renderer. Used by the dashboard event
 * cards (Diff tab on cache:write events) and the timeline drawer for the
 * same events. Pretty-prints both sides, runs an LCS line diff, renders
 * two columns with red/green highlights and line numbers. Pure HTML
 * string output; safe to inject via dangerouslySetInnerHTML.
 *
 * Tracked in IMPROVEMENTS.md: convert to native Preact components.
 */

import { escapeHtml } from './format'
import { lcsLineDiff } from './lcs-diff'

// Number of unchanged lines kept around each change as visible context.
// Larger runs of `eq` ops get collapsed into a single expander row that
// reveals them on click — same UX as GitHub's PR diff.
const SXS_CONTEXT = 3

export function deepDiffLeaves(prev, next, basePath, out) {
  basePath = basePath || [];
  out = out || [];
  const isPlainObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

  if (!isPlainObj(prev) || !isPlainObj(next)) {
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      out.push({ kind: 'changed', path: basePath, from: prev, to: next });
    }
    return out;
  }

  // Removals: keys in prev not in next
  for (const k of Object.keys(prev)) {
    if (!(k in next)) {
      out.push({ kind: 'removed', path: basePath.concat(k), from: prev[k] });
    }
  }
  // Additions and changes
  for (const k of Object.keys(next)) {
    if (!(k in prev)) {
      out.push({ kind: 'added', path: basePath.concat(k), to: next[k] });
      continue;
    }
    if (JSON.stringify(prev[k]) === JSON.stringify(next[k])) continue;
    if (isPlainObj(prev[k]) && isPlainObj(next[k])) {
      deepDiffLeaves(prev[k], next[k], basePath.concat(k), out);
    } else {
      out.push({ kind: 'changed', path: basePath.concat(k), from: prev[k], to: next[k] });
    }
  }
  return out;
}

// Side-by-side line-level diff (GitHub-style). Pretty-prints both sides
// as multi-line JSON, then runs an LCS line diff and renders two columns
// with red/green highlights and line numbers in gutters.
export function renderCacheDiff(payload) {
  if (!payload) return '<div class="diff-view-empty">No diff data on this event.</div>';

  const op = payload.operation;
  let prev = payload.previousContent;
  let next = payload.content;

  if (op === 'create') {
    // Whole right side is added; left is empty.
    return renderSideBySideDiff(undefined, next, { headerLeft: 'Before (empty)', headerRight: 'Created' });
  }
  if (op === 'delete') {
    return renderSideBySideDiff(prev, undefined, { headerLeft: 'Deleted', headerRight: 'After (gone)' });
  }

  // update — fall through to side-by-side
  if (JSON.stringify(prev) === JSON.stringify(next)) {
    return '<div class="diff-view-empty">No detected changes between the previous and current value.</div>';
  }
  return renderSideBySideDiff(prev, next, { headerLeft: 'Before', headerRight: 'After' });
}

// Pretty-print a JSON-serializable value for the diff. Returns lines so
// the caller can feed them straight into the LCS diff. `undefined` is
// treated as zero lines (used for create/delete cases).
export function jsonLines(value) {
  if (value === undefined) return [];
  if (value === null) return ['null'];
  let json;
  try { json = JSON.stringify(value, null, 2); } catch { json = String(value); }
  if (typeof json !== 'string') json = String(json);
  return json.split('\n');
}

// Standard LCS line diff. Returns an array of ops:
//   { op: 'eq',  left, right, li, ri }   — same line, kept on both sides
//   { op: 'del', left,        li     }   — only on the left
//   { op: 'add',        right,     ri }  — only on the right
// `li` / `ri` are 1-based line numbers for gutter display.
// `lcsLineDiff` is imported from ./lib/lcs-diff at the top of this file.

// Number of unchanged lines kept around each change as visible context.
// Larger runs of `eq` ops get collapsed into a single expander row that
// reveals them on click — same UX as GitHub's PR diff.


export function renderSxsRow(o) {
  const cellHtml = (text) => '<pre class="sxs-cell-pre">' + (text == null ? '' : escapeHtml(text)) + '</pre>';
  if (o.op === 'eq') {
    return (
      '<div class="sxs-row eq">' +
        '<div class="sxs-gutter">' + o.li + '</div>' +
        '<div class="sxs-cell">' + cellHtml(o.left) + '</div>' +
        '<div class="sxs-gutter">' + o.ri + '</div>' +
        '<div class="sxs-cell">' + cellHtml(o.right) + '</div>' +
      '</div>'
    );
  }
  if (o.op === 'change') {
    // Adjacent del+add paired into a single row so the corresponding
    // before/after values sit on the same baseline (GitHub-style).
    return (
      '<div class="sxs-row change">' +
        '<div class="sxs-gutter del-gutter">' + o.li + '</div>' +
        '<div class="sxs-cell del-cell"><span class="sxs-marker">-</span>' + cellHtml(o.left) + '</div>' +
        '<div class="sxs-gutter add-gutter">' + o.ri + '</div>' +
        '<div class="sxs-cell add-cell"><span class="sxs-marker">+</span>' + cellHtml(o.right) + '</div>' +
      '</div>'
    );
  }
  if (o.op === 'del') {
    return (
      '<div class="sxs-row del">' +
        '<div class="sxs-gutter del-gutter">' + o.li + '</div>' +
        '<div class="sxs-cell del-cell"><span class="sxs-marker">-</span>' + cellHtml(o.left) + '</div>' +
        '<div class="sxs-gutter"></div>' +
        '<div class="sxs-cell empty"></div>' +
      '</div>'
    );
  }
  return (
    '<div class="sxs-row add">' +
      '<div class="sxs-gutter"></div>' +
      '<div class="sxs-cell empty"></div>' +
      '<div class="sxs-gutter add-gutter">' + o.ri + '</div>' +
      '<div class="sxs-cell add-cell"><span class="sxs-marker">+</span>' + cellHtml(o.right) + '</div>' +
    '</div>'
  );
}

// Walk the LCS ops list and pair every contiguous run of `del`s followed
// by `add`s into single `change` rows so before/after values appear on
// the same baseline. Leftover unpaired ops (when the run lengths differ)
// stay as plain `del` / `add` rows.
export function pairAdjacentChanges(ops) {
  const out = [];
  let i = 0;
  while (i < ops.length) {
    if (ops[i].op === 'del') {
      const dels = [];
      while (i < ops.length && ops[i].op === 'del') { dels.push(ops[i]); i++; }
      const adds = [];
      while (i < ops.length && ops[i].op === 'add') { adds.push(ops[i]); i++; }
      const n = Math.max(dels.length, adds.length);
      for (let j = 0; j < n; j++) {
        const d = dels[j];
        const a = adds[j];
        if (d && a) {
          out.push({ op: 'change', left: d.left, right: a.right, li: d.li, ri: a.ri });
        } else if (d) {
          out.push(d);
        } else if (a) {
          out.push(a);
        }
      }
    } else if (ops[i].op === 'add') {
      // A bare `add` run not preceded by `del` — keep as-is.
      while (i < ops.length && ops[i].op === 'add') { out.push(ops[i]); i++; }
    } else {
      out.push(ops[i]);
      i++;
    }
  }
  return out;
}

// Walk the LCS ops list and decide which lines to render and which to
// collapse. We always keep `SXS_CONTEXT` lines of context next to each
// change; longer runs of unchanged lines become a single expander row.
export function buildSxsRows(ops) {
  const rows = [];
  let i = 0;
  while (i < ops.length) {
    const op = ops[i];
    if (op.op !== 'eq') { rows.push(renderSxsRow(op)); i++; continue; }

    // Collect the full eq run.
    let runStart = i;
    while (i < ops.length && ops[i].op === 'eq') i++;
    const run = ops.slice(runStart, i);

    const isFirst = runStart === 0;
    const isLast = i === ops.length;
    const ctx = SXS_CONTEXT;

    // How many lines to keep visible at the head/tail of this run?
    //   - Top of file: nothing above means we hide the whole thing if it's long.
    //   - Sandwiched between changes: keep ctx at start AND end.
    //   - Bottom of file: same logic flipped.
    const keepHead = isFirst ? 0 : Math.min(ctx, run.length);
    const keepTail = isLast ? 0 : Math.min(ctx, run.length - keepHead);
    const hiddenLen = run.length - keepHead - keepTail;

    // Always show the head context.
    for (let k = 0; k < keepHead; k++) rows.push(renderSxsRow(run[k]));

    if (hiddenLen > 0) {
      const hiddenStart = run[keepHead].li;
      const hiddenEnd = run[keepHead + hiddenLen - 1].li;
      // Encode the slice of `ops` to expand directly into the row's data
      // attribute — clicking the expander replaces it with these rows.
      const hiddenOps = run.slice(keepHead, keepHead + hiddenLen);
      const encoded = encodeURIComponent(JSON.stringify(hiddenOps));
      rows.push(
        '<div class="sxs-row sxs-collapsed" data-sxs-hidden="' + encoded + '">' +
          '<div class="sxs-collapsed-cell" colspan="4">' +
            '<button type="button" class="sxs-expand-btn">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/><polyline points="6 3 12 9 18 3"/></svg>' +
              ' Expand ' + hiddenLen + ' unchanged line' + (hiddenLen === 1 ? '' : 's') +
              ' <span class="sxs-collapsed-range">(' + hiddenStart + '–' + hiddenEnd + ')</span>' +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }

    // Show the tail context.
    for (let k = run.length - keepTail; k < run.length; k++) rows.push(renderSxsRow(run[k]));
  }
  return rows.join('');
}

export function renderSideBySideDiff(prev, next, opts) {
  opts = opts || {};
  const leftLines = jsonLines(prev);
  const rightLines = jsonLines(next);
  // Pair adjacent del+add into `change` rows so the before/after values
  // line up on the same row instead of stacking vertically.
  const ops = pairAdjacentChanges(lcsLineDiff(leftLines, rightLines));

  const body = buildSxsRows(ops);

  // Stats banner above the diff so users see at a glance what changed.
  // A paired `change` counts as both an addition and a removal.
  let added = 0, removed = 0;
  for (const o of ops) {
    if (o.op === 'add') added++;
    else if (o.op === 'del') removed++;
    else if (o.op === 'change') { added++; removed++; }
  }

  return (
    '<div class="sxs-diff">' +
      '<div class="sxs-header">' +
        '<div class="sxs-header-cell">' + escapeHtml(opts.headerLeft || 'Before') +
          ' <span class="sxs-stat sxs-stat-removed">−' + removed + '</span></div>' +
        '<div class="sxs-header-cell">' + escapeHtml(opts.headerRight || 'After') +
          ' <span class="sxs-stat sxs-stat-added">+' + added + '</span></div>' +
      '</div>' +
      '<div class="sxs-body">' + body + '</div>' +
    '</div>'
  );
}

// Delegated click handler for the "Expand N unchanged lines" buttons.
// Lives at the document level since the diff view is rebuilt on every
// tab switch — listeners on the rendered HTML would leak.
document.addEventListener('click', (e) => {
  const btn = e.target && (e.target.closest ? e.target.closest('.sxs-expand-btn') : null);
  if (!btn) return;
  const row = btn.closest('.sxs-collapsed');
  if (!row) return;
  let hidden;
  try {
    hidden = JSON.parse(decodeURIComponent(row.dataset.sxsHidden || '[]'));
  } catch { return; }
  const html = hidden.map(renderSxsRow).join('');
  row.outerHTML = html;
});

