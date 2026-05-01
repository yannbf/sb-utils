// @ts-nocheck
// Legacy dashboard module — original inline <script> from event-log-dashboard.html.
// Runs once on import; queries DOM by ID, attaches listeners, owns dashboard
// state imperatively. Pure helpers have been moved out to `dashboard/lib/`;
// the rest will follow as the surface area gets carved up.

import { escapeHtml as _escapeHtml, formatGapDuration as _formatGapDuration } from './lib/format'
import { lcsLineDiff as _lcsLineDiff } from './lib/lcs-diff'
import { scheduleMirror as _scheduleMirror } from './store/legacy-mirror'
import { pushToast as _pushToast } from './store/signals'
import {
  openSaveModal as _openSaveModal,
  openExplanationModal as _openExplanationModal,
} from './store/modal'

// Re-bind to the names the original script body uses, without touching the
// (large) body that follows. This gives us the module split without
// rewriting every call site.
const escapeHtml = _escapeHtml
const lcsLineDiff = _lcsLineDiff
const formatGapDurationGlobal = _formatGapDuration
const scheduleMirror = _scheduleMirror

// ── State ────────────────────────────────────────────
const state = {
  events: [],
  paused: false,
  pausedWhileCount: 0,
  autoScroll: true,
  activeFilter: 'all',
  activeSession: null,
  activeImport: null,
  searchQuery: '',
  expandAll: false,
  typeCounts: {},
  sessionMap: {},
  importMap: {},
  expandedCards: new Set(),
  hiddenTypes: new Set(),
  hiddenSessions: new Set(),
  hiddenImports: new Set(),
  // Cache-event grouping mirrors sessions: keyed by `namespace/key` (the
  // human label users already see in the event summary), with the same
  // filter / hide / delete affordances.
  cacheMap: {},
  activeCacheKey: null,
  hiddenCacheKeys: new Set(),
  // Master "All operations" toggle — hides every cache event regardless
  // of per-key state. Sits above the per-key list, mirroring the "All
  // events" entry in the Event Types section.
  cacheAllHidden: false,
  // Master "All events" toggle — hides every non-cache (telemetry)
  // event globally. Combined with cacheAllHidden, the user can isolate
  // either stream in a single click.
  telemetryAllHidden: false,
  // Reconstruction is on by default. We synthesize telemetry events from
  // cache writes to `lastEvents` so the dashboard works even without
  // STORYBOOK_TELEMETRY_URL set (real telemetry still goes to
  // production). As soon as a real instrumented event arrives, we set
  // `realTelemetryDetected = true` and stop reconstructing to avoid
  // duplication.
  realTelemetryDetected: false,
  view: 'dashboard',
};
// In a snapshot, restore the flag from the bake so reconstruction stays
// off if it was off live — otherwise we'd add ghost recon events for
// every lastEvents entry whose eventId differs from the matching real
// telemetry event in baked state.events.
if (typeof window !== 'undefined' && window.__SNAPSHOT_REAL_TELEMETRY_DETECTED__ === true) {
  state.realTelemetryDetected = true;
}

// Synthetic events (cache reconstruction + cache-create from backfill)
// use a high _index range that the server's eventCounter (which starts
// at 0 and increments by ~1 per event) will never realistically reach.
// This keeps SSE dedup-by-_index correct: real live events have small
// indices, synthetic ones have large ones, no collisions.
//
// The displayed `#N` next to each card / drawer is computed from the
// event's chronological position in state.events at render time, so
// users see `#1, #2, #3…` top-to-bottom regardless of underlying _index.
let _syntheticIndexCounter = 1e9;
function nextReconstructIndex() {
  return _syntheticIndexCounter++;
}

// ── Color mapping for event types ────────────────────
const TYPE_COLORS = {
  // Lifecycle
  boot:            { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  dev:             { bg: 'rgba(74,222,128,0.12)',  fg: '#4ade80' },
  build:           { bg: 'rgba(74,222,128,0.12)',  fg: '#4ade80' },
  index:           { bg: 'rgba(74,222,128,0.12)',  fg: '#4ade80' },
  exit:            { bg: 'rgba(251,191,36,0.12)',  fg: '#fbbf24' },
  canceled:        { bg: 'rgba(251,191,36,0.12)',  fg: '#fbbf24' },
  // Init & migration
  init:            { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'init-step':     { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  upgrade:         { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'multi-upgrade': { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  automigrate:     { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  migrate:         { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'scaffolded-empty': { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  // Errors
  error:           { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  'error-metadata':{ bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  // Testing
  'test-run':      { bg: 'rgba(34,211,238,0.12)',  fg: '#22d3ee' },
  'addon-test':    { bg: 'rgba(34,211,238,0.12)',  fg: '#22d3ee' },
  'testing-module-watch-mode':           { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'testing-module-completed-report':     { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'testing-module-crash-report':         { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  mocking:         { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  // Stories
  'save-story':              { bg: 'rgba(251,146,60,0.12)',  fg: '#fb923c' },
  'create-new-story-file':   { bg: 'rgba(251,146,60,0.12)',  fg: '#fb923c' },
  'create-new-story-file-search': { bg: 'rgba(251,146,60,0.12)', fg: '#fb923c' },
  'ghost-stories':           { bg: 'rgba(251,146,60,0.12)',  fg: '#fb923c' },
  // Browser & editor
  browser:         { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'open-in-editor':{ bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'preview-first-load': { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  // Sharing & config
  share:           { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'core-config':   { bg: 'rgba(136,150,168,0.12)', fg: '#9ba8b9' },
  'version-update':{ bg: 'rgba(136,150,168,0.12)', fg: '#9ba8b9' },
  remove:          { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  add:             { bg: 'rgba(74,222,128,0.12)',  fg: '#4ade80' },
  doctor:          { bg: 'rgba(251,191,36,0.12)',  fg: '#fbbf24' },
  // Onboarding
  'addon-onboarding':             { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-survey':            { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-checklist-muted':   { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-checklist-status':  { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  // AI
  'ai-setup':                     { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-evidence':            { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-final-scoring':       { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-prompt-nudge':              { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-init-opt-in':               { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-self-healing-scoring':{ bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
};

// Generate a stable color for unknown event types
const FALLBACK_HUES = ['#6c9ef8','#4ade80','#c084fc','#fbbf24','#22d3ee','#fb923c','#f472b6','#f87171'];
function getColor(type) {
  if (TYPE_COLORS[type]) return TYPE_COLORS[type];
  // Hash-based stable color for unknown types
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = ((hash << 5) - hash + type.charCodeAt(i)) | 0;
  const fg = FALLBACK_HUES[Math.abs(hash) % FALLBACK_HUES.length];
  // Parse hex to rgba for bg
  const r = parseInt(fg.slice(1,3),16), g = parseInt(fg.slice(3,5),16), b = parseInt(fg.slice(5,7),16);
  return { bg: 'rgba(' + r + ',' + g + ',' + b + ',0.12)', fg };
}

// ── DOM refs ─────────────────────────────────────────
const container = document.getElementById('eventContainer');
const emptyState = document.getElementById('emptyState');
const filterList = document.getElementById('filterList');
const sessionList = document.getElementById('sessionList');
const importList = document.getElementById('importList');
const importsSection = document.getElementById('importsSection');
const sessionsEmpty = document.getElementById('sessionsEmpty');
const cacheList = document.getElementById('cacheList');
const cacheListEmpty = document.getElementById('cacheListEmpty');
const searchInput = document.getElementById('searchInput');
const pauseBtn = document.getElementById('pauseBtn');
const pauseSvg = document.getElementById('pauseSvg');
const pauseLabel = document.getElementById('pauseLabel');
const pausedBanner = document.getElementById('pausedBanner');
const pausedCountEl = document.getElementById('pausedCount');
const pausedResumeBtn = document.getElementById('pausedResumeBtn');
const scrollBtn = document.getElementById('scrollBtn');
const expandAllBtn = document.getElementById('expandAllBtn');
const expandLabel = document.getElementById('expandLabel');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const eventCount = document.getElementById('eventCount');
const statusDot = document.getElementById('statusDot');
const countAll = document.getElementById('countAll');
const layoutEl = document.getElementById('layout');
const emptyTitle = document.getElementById('emptyTitle');
const emptySubtitle = document.getElementById('emptySubtitle');
const emptyCode = document.getElementById('emptyCode');
emptyCode.textContent = 'STORYBOOK_TELEMETRY_URL=' + location.origin + '/event-log';
const emptyFilterHint = document.getElementById('emptyFilterHint');
const emptyIcon = document.getElementById('emptyIcon');

// ── Batched sidebar rendering ────────────────────────
let filterRafPending = false;
let sessionRafPending = false;
let importRafPending = false;
let cacheRafPending = false;

function scheduleFilterRender() {
  scheduleMirror(state);
  if (filterRafPending) return;
  filterRafPending = true;
  requestAnimationFrame(() => { filterRafPending = false; renderFiltersNow(); });
}

function scheduleSessionRender() {
  scheduleMirror(state);
  if (sessionRafPending) return;
  sessionRafPending = true;
  requestAnimationFrame(() => { sessionRafPending = false; renderSessionsNow(); });
}

function scheduleImportRender() {
  scheduleMirror(state);
  if (importRafPending) return;
  importRafPending = true;
  requestAnimationFrame(() => { importRafPending = false; renderImportsNow(); });
}

function scheduleCacheRender() {
  scheduleMirror(state);
  if (cacheRafPending) return;
  cacheRafPending = true;
  requestAnimationFrame(() => { cacheRafPending = false; renderCacheKeysNow(); });
}

// `namespace/key` is the human label used in cache event summaries and the
// CLI log line. Returns null for non-cache events.
function cacheKeyOf(event) {
  if (!event || event._source !== 'cache-watch' || !event.payload) return null;
  return (event.payload.namespace || '') + '/' + (event.payload.key || '');
}

// "All operations" / "All events" master rows are now rendered by
// components/Sidebar.tsx with their own Preact handlers. These bind
// helpers are no-ops kept for the boot sequence (`window.__sbDashboardBind`
// is invoked from main.tsx).
function bindCacheAllRow() {}
function bindEventsAllRow() {}

if (document.readyState === 'loading') {

} else {
  bindCacheAllRow();
  bindEventsAllRow();
}

// ── SSE connection with reconnection recovery ────────
let eventSource = null;

function connect() {
  eventSource = new EventSource('/sse');
  eventSource.onmessage = (e) => {
    const event = JSON.parse(e.data);
    // Dedupe by eventId first (the canonical identity), then by _index
    // (server-assigned ordinal — covers SSE replay after reconnect).
    // Synthetic events use a high _index range so this check can't
    // false-positive on small server-assigned indices.
    if (event.eventId && state.events.some(ex => ex.eventId === event.eventId)) return;
    if (event._index != null && state.events.some(ex => ex._index === event._index)) return;

    // First time we see a real instrumented telemetry event (i.e. one
    // that didn't originate from our cache-watch / cache-recon pipeline),
    // shut off reconstruction. Real events take precedence — no point
    // synthesizing duplicates from the same lastEvents writes.
    if (!event._source && !state.realTelemetryDetected) {
      state.realTelemetryDetected = true;
    }

    state.events.push(event);
    updateTypeCounts(event);
    updateSessionMap(event);
    updateImportMap(event);
    updateCacheMap(event);

    if (state.paused) {
      state.pausedWhileCount++;
      pausedCountEl.textContent = state.pausedWhileCount;
    } else {
      renderNewEvent(event);
    }
    updateCounters();
    if (typeof Timeline !== 'undefined') Timeline.invalidate();
    // Cache events should refresh the snapshot panel if it's currently visible.
    if (event._source === 'cache-watch' && typeof CacheView !== 'undefined') {
      CacheView.onCacheEvent(event);
    }
    // Telemetry reconstruction: any cache:write to `lastEvents` is a
    // signal that telemetry just fired. Synthesize the corresponding
    // events into the timeline. The function self-cancels once a real
    // instrumented telemetry event has been seen.
    if (event._source === 'cache-watch') {
      reconstructTelemetryFromCacheWrite(event);
    }
  };
  eventSource.onopen = () => {
    statusDot.className = 'status-dot';
    statusDot.title = 'Connected';
    recoverMissedEvents();
  };
  eventSource.onerror = () => {
    statusDot.className = 'status-dot disconnected';
    statusDot.title = 'Disconnected - retrying...';
  };
}

async function recoverMissedEvents() {
  try {
    const res = await fetch('/event-log');
    const serverEvents = await res.json();
    let recovered = 0;
    for (const event of serverEvents) {
      if (event.eventId && state.events.some(ex => ex.eventId === event.eventId)) continue;
      if (event._index != null && !state.events.some(ex => ex._index === event._index)) {
        state.events.push(event);
        updateTypeCounts(event);
        updateSessionMap(event);
        updateImportMap(event);
        recovered++;
      }
    }
    if (recovered > 0) {
      state.events.sort((a, b) => (a._index || 0) - (b._index || 0));
      if (!state.paused) rerenderAll();
      updateCounters();
    }
  } catch { /* best-effort */ }
}

function updateTypeCounts(event) {
  const t = event.eventType || 'unknown';
  state.typeCounts[t] = (state.typeCounts[t] || 0) + 1;
  scheduleFilterRender();
}

function updateSessionMap(event) {
  const sid = event.sessionId;
  if (!sid) return;
  if (!state.sessionMap[sid]) {
    state.sessionMap[sid] = { count: 0, firstSeen: event._receivedAt || Date.now() };
  }
  state.sessionMap[sid].count++;
  scheduleSessionRender();
}

function updateCacheMap(event) {
  const ck = cacheKeyOf(event);
  if (!ck) return;
  const ts = event._receivedAt || Date.now();
  if (!state.cacheMap[ck]) {
    state.cacheMap[ck] = {
      key: ck,
      namespace: event.payload && event.payload.namespace,
      logicalKey: event.payload && event.payload.key,
      count: 0,
      firstSeen: ts,
      lastOp: event.payload && event.payload.operation,
    };
  }
  const entry = state.cacheMap[ck];
  entry.count++;
  entry.lastOp = (event.payload && event.payload.operation) || entry.lastOp;
  scheduleCacheRender();
}

function updateImportMap(event) {
  const imp = event._import;
  if (!imp || !imp.id) return;
  if (!state.importMap[imp.id]) {
    state.importMap[imp.id] = {
      id: imp.id,
      name: imp.name || imp.id,
      importedAt: imp.importedAt || Date.now(),
      explanation: typeof imp.explanation === 'string' ? imp.explanation : '',
      count: 0,
      sessions: new Set(),
    };
  } else if (!state.importMap[imp.id].explanation && typeof imp.explanation === 'string' && imp.explanation) {
    // Late-arriving event from the same batch may carry the explanation metadata.
    state.importMap[imp.id].explanation = imp.explanation;
  }
  const entry = state.importMap[imp.id];
  entry.count++;
  if (event.sessionId) entry.sessions.add(event.sessionId);
  scheduleImportRender();
}

// ── JSON syntax highlighting with collapsing ─────────
function renderJson(obj, depth, path) {
  if (obj === null) return '<span class="json-null">null</span>';
  if (obj === undefined) return '<span class="json-null">undefined</span>';
  if (typeof obj === 'string') return '<span class="json-string">"' + escapeHtml(obj) + '"</span>';
  if (typeof obj === 'number') return '<span class="json-number">' + obj + '</span>';
  if (typeof obj === 'boolean') return '<span class="json-boolean">' + obj + '</span>';

  const isArray = Array.isArray(obj);
  const entries = isArray ? obj.map((v, i) => [i, v]) : Object.entries(obj);
  const open = isArray ? '[' : '{';
  const close = isArray ? ']' : '}';
  const id = 'j' + path.replace(/[^a-zA-Z0-9]/g, '_') + '_' + depth;

  if (entries.length === 0) {
    return '<span class="json-bracket">' + open + close + '</span>';
  }

  const indent = '  '.repeat(depth + 1);
  const closingIndent = '  '.repeat(depth);
  const autoCollapse = depth >= 2 && entries.length > 3;

  let html = '<span class="json-bracket">' + open + '</span>';
  html += '<button class="json-toggle" data-target="' + id + '" onclick="toggleJson(this)">' +
    (autoCollapse ? '&#9654;' : '&#9660;') + '</button>';
  html += '<span class="json-collapsed-indicator" id="' + id + '-hint"' +
    (autoCollapse ? '' : ' style="display:none"') + '> ' + entries.length + (isArray ? ' items' : ' keys') + ' </span>';
  html += '<span id="' + id + '"' + (autoCollapse ? ' class="json-hidden"' : '') + '>\n';

  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];
    html += indent;
    if (!isArray) html += '<span class="json-key">"' + escapeHtml(String(key)) + '"</span>: ';
    html += renderJson(val, depth + 1, path + '.' + key);
    if (i < entries.length - 1) html += ',';
    html += '\n';
  }
  html += closingIndent + '</span><span class="json-bracket">' + close + '</span>';
  return html;
}

// `escapeHtml` is imported from ./lib/format at the top of this file.

// ── Cache diff rendering ─────────────────────────────
// Recursively walk previousContent vs content and yield a flat list of
// leaf-level changes with full key paths. Stops recursing into arrays
// (they're treated as primitives — reordering doesn't render well as a
// line-by-line diff). The watcher's surface diff in payload.diff is
// ignored when we have both sides of the content available, which is
// always the case for `update` operations.
function deepDiffLeaves(prev, next, basePath, out) {
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
function renderCacheDiff(payload) {
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
function jsonLines(value) {
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
var SXS_CONTEXT = 3;

function renderSxsRow(o) {
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
function pairAdjacentChanges(ops) {
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
function buildSxsRows(ops) {
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

function renderSideBySideDiff(prev, next, opts) {
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

// ── Time helpers ─────────────────────────────────────
function formatDelta(ms) {
  if (ms < 1000) return '+' + ms + 'ms';
  if (ms < 60000) return '+' + (ms / 1000).toFixed(1) + 's';
  if (ms < 3600000) return '+' + Math.floor(ms / 60000) + 'm' + Math.floor((ms % 60000) / 1000) + 's';
  return '+' + Math.floor(ms / 3600000) + 'h' + Math.floor((ms % 3600000) / 60000) + 'm';
}

function getPreviousEventTime(event) {
  const idx = state.events.indexOf(event);
  if (idx <= 0) return null;
  const prev = state.events[idx - 1];
  if (!prev._receivedAt || !event._receivedAt) return null;
  return event._receivedAt - prev._receivedAt;
}

// ── Shared event-detail tab rendering ────────────────
// Used by both the dashboard's event cards and the timeline's drawer so
// they stay in sync. Returns the inner HTML for the tabs+content panel
// plus a function the caller invokes once the HTML is in the DOM to wire
// up tab-click handlers (delegated to the parent container).
function buildEventTabs(event, idPrefix, opts) {
  opts = opts || {};
  const isCacheEvent = event._source === 'cache-watch';
  const sections = [];
  // Diff comes first for cache events — it's the most useful view.
  if (isCacheEvent) sections.push({ key: 'diff', label: 'Diff' });
  if (event.payload && Object.keys(event.payload).length > 0) sections.push({ key: 'payload', label: 'Payload' });
  if (event.metadata && Object.keys(event.metadata).length > 0) sections.push({ key: 'metadata', label: 'Metadata' });
  if (event.context && Object.keys(event.context).length > 0) sections.push({ key: 'context', label: 'Context' });
  sections.push({ key: 'raw', label: 'Raw' });

  const tabsHtml = sections.map((s, i) =>
    '<div class="event-tab' + (i === 0 ? ' active' : '') + '" data-tab="' + s.key + '">' + s.label + '</div>'
  ).join('');

  const contentHtml = sections.map((s, i) => {
    let inner;
    if (s.key === 'diff') {
      inner = renderCacheDiff(event.payload);
    } else {
      const data = s.key === 'raw' ? event : event[s.key];
      inner = '<div class="json-view">' + renderJson(data, 0, idPrefix + '_' + s.key) + '</div>';
    }
    return '<div class="event-tab-content" data-tab-content="' + s.key + '"' +
      (i !== 0 ? ' style="display:none"' : '') + '>' + inner + '</div>';
  }).join('');

  // Caller passes the container after inserting innerHTML; we delegate
  // tab clicks to that container so card / drawer share behavior.
  function attach(container, opts2) {
    opts2 = opts2 || {};
    container.querySelectorAll('.event-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (opts2.stopPropagation) e.stopPropagation();
        const tabKey = tab.dataset.tab;
        container.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.event-tab-content').forEach(c => c.style.display = 'none');
        tab.classList.add('active');
        const target = container.querySelector('[data-tab-content="' + tabKey + '"]');
        if (target) target.style.display = '';
      });
    });
  }

  return { tabsHtml: tabsHtml, contentHtml: contentHtml, attach: attach };
}

// ── Event card building ──────────────────────────────
function buildEventCard(event) {
  // `idx` is the stable per-event identity (server-assigned for SSE
  // events, large synthetic for backfilled / reconstructed). It powers
  // dataset.index, expandedCards lookups, copyEvent etc.
  const idx = event._index != null ? event._index : state.events.indexOf(event);
  // Display number: chronological position in state.events. After the
  // backfill sort, position 0 = earliest event. +1 so `#N` starts at 1.
  const pos = state.events.indexOf(event);
  const displayIdx = pos >= 0 ? pos + 1 : idx;
  const time = event._receivedAt ? new Date(event._receivedAt).toLocaleTimeString() : '';
  const color = getColor(event.eventType);
  const sessionShort = event.sessionId ? event.sessionId.slice(0, 8) : '';
  const deltaMs = getPreviousEventTime(event);
  const deltaStr = deltaMs != null ? formatDelta(deltaMs) : '';

  const isCacheEvent = event._source === 'cache-watch';
  let summary = '';
  if (isCacheEvent && event.payload) {
    // Match the CLI log format: "<namespace>/<key>". The operation is already
    // conveyed by the eventType badge (cache:write vs cache:delete) and the
    // diff lives on its own tab, so the summary stays compact.
    const p = event.payload;
    summary = (p.namespace || '') + '/' + (p.key || '');
  } else {
    const summaryParts = [];
    if (event.payload) {
      const p = event.payload;
      if (p.eventType) summaryParts.push(p.eventType);
      if (p.type) summaryParts.push(p.type);
      if (p.name) summaryParts.push(p.name);
      if (p.status) summaryParts.push(p.status);
      if (p.error) summaryParts.push('error: ' + (typeof p.error === 'string' ? p.error : p.error.message || 'unknown'));
    }
    summary = summaryParts.length > 0 ? summaryParts.join(' \u00b7 ') : '';
  }

  const card = document.createElement('div');
  card.className = 'event-card';
  card.dataset.eventType = event.eventType || '';
  card.dataset.sessionId = event.sessionId || '';
  card.dataset.index = idx;
  card.dataset.searchText = JSON.stringify(event).toLowerCase();
  // Cache-watch pseudo-events get a subtle border accent (see .cache-event CSS)
  // so they're easy to pick out of a long timeline of telemetry events.
  if (isCacheEvent) card.dataset.cacheEvent = 'true';
  // Reconstructed-from-cache telemetry: small "from cache" badge in
  // the header so users can tell these aren't from STORYBOOK_TELEMETRY_URL.
  const isReconstructed = event._source === 'cache-recon';
  if (isReconstructed) card.dataset.source = 'cache-recon';

  const tabs = buildEventTabs(event, 'evt' + idx);

  card.innerHTML =
    '<div class="event-header" onclick="toggleCard(this.parentElement)">' +
      '<span class="expand-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>' +
      '<span class="event-index">#' + displayIdx + '</span>' +
      '<span class="event-badge" style="background:' + color.bg + '; color:' + color.fg + '">' +
        escapeHtml(event.eventType || 'unknown') + '</span>' +
      '<span class="event-summary">' + escapeHtml(summary) + '</span>' +
      (isReconstructed
        ? '<span class="event-recon-badge" title="Reconstructed from a lastEvents cache write — STORYBOOK_TELEMETRY_URL was not set">' +
            '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1 1 5.64 5.64L23 10"/></svg>' +
            'cache' +
          '</span>'
        : '') +
      (sessionShort ? '<span class="event-session">' + sessionShort + '</span>' : '') +
      '<span class="event-time-group">' +
        (deltaStr ? '<span class="event-delta">' + deltaStr + '</span>' : '') +
        '<span class="event-time">' + time + '</span>' +
      '</span>' +
      '<div class="event-actions">' +
        '<button onclick="event.stopPropagation(); copyEvent(' + idx + ')" title="Copy JSON">Copy</button>' +
        '<button onclick="event.stopPropagation(); copyEventCurl(' + idx + ')" title="Copy as cURL">cURL</button>' +
      '</div>' +
    '</div>' +
    '<div class="event-body">' +
      '<div class="event-tabs">' + tabs.tabsHtml + '</div>' +
      tabs.contentHtml +
    '</div>';

  tabs.attach(card, { stopPropagation: true });

  return card;
}

function toggleCard(card) {
  const idx = card.dataset.index;
  card.classList.toggle('expanded');
  if (card.classList.contains('expanded')) {
    state.expandedCards.add(idx);
  } else {
    state.expandedCards.delete(idx);
  }
}

// ── Rendering ────────────────────────────────────────
let lastSessionId = null;

function renderNewEvent(event) {
  emptyState.style.display = 'none';

  if (event.sessionId && event.sessionId !== lastSessionId) {
    const sep = document.createElement('div');
    sep.className = 'session-separator';
    sep.dataset.sessionId = event.sessionId;
    sep.innerHTML = '<span class="session-label">Session ' + event.sessionId.slice(0, 8) + '</span>';
    if (!matchesFilters(event)) sep.classList.add('filtered-out');
    container.appendChild(sep);
    lastSessionId = event.sessionId;
  }

  const card = buildEventCard(event);
  if (state.expandAll) card.classList.add('expanded');
  if (!matchesFilters(event)) card.classList.add('filtered-out');
  container.appendChild(card);

  if (state.autoScroll && !card.classList.contains('filtered-out')) {
    container.scrollTop = container.scrollHeight;
  }
}

function rerenderAll() {
  const children = Array.from(container.children);
  children.forEach(c => { if (c !== emptyState) c.remove(); });
  lastSessionId = null;

  if (state.events.length === 0) { emptyState.style.display = ''; updateEmptyState(false); return; }
  emptyState.style.display = 'none';

  const frag = document.createDocumentFragment();
  for (const event of state.events) {
    if (event.sessionId && event.sessionId !== lastSessionId) {
      const sep = document.createElement('div');
      sep.className = 'session-separator';
      sep.dataset.sessionId = event.sessionId;
      sep.innerHTML = '<span class="session-label">Session ' + event.sessionId.slice(0, 8) + '</span>';
      if (!matchesFilters(event)) sep.classList.add('filtered-out');
      frag.appendChild(sep);
      lastSessionId = event.sessionId;
    }
    const card = buildEventCard(event);
    if (state.expandAll || state.expandedCards.has(String(card.dataset.index))) card.classList.add('expanded');
    if (!matchesFilters(event)) card.classList.add('filtered-out');
    frag.appendChild(card);
  }
  container.appendChild(frag);

  const visibleCards = container.querySelectorAll('.event-card:not(.filtered-out)');
  if (visibleCards.length === 0) { emptyState.style.display = ''; updateEmptyState(true); }
  if (state.autoScroll) container.scrollTop = container.scrollHeight;
}

function applyFiltersInPlace() {
  scheduleMirror(state);
  let anyVisible = false;
  const cards = container.querySelectorAll('.event-card');
  cards.forEach(card => {
    const event = state.events.find(e =>
      String(e._index != null ? e._index : state.events.indexOf(e)) === card.dataset.index
    );
    if (event && matchesFilters(event)) {
      card.classList.remove('filtered-out');
      anyVisible = true;
    } else {
      card.classList.add('filtered-out');
    }
  });

  const seps = container.querySelectorAll('.session-separator');
  seps.forEach(sep => {
    const sid = sep.dataset.sessionId;
    const hasVisibleEvent = Array.from(cards).some(card =>
      card.dataset.sessionId === sid && !card.classList.contains('filtered-out')
    );
    sep.classList.toggle('filtered-out', !hasVisibleEvent);
  });

  const showEmpty = state.events.length === 0 || !anyVisible;
  emptyState.style.display = showEmpty ? '' : 'none';
  if (showEmpty) updateEmptyState(state.events.length > 0);
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function matchesFilters(event) {
  if (state.hiddenTypes.has(event.eventType)) return false;
  if (event.sessionId && state.hiddenSessions.has(event.sessionId)) return false;
  // Cache events are filterable / hideable per `namespace/key`, mirroring
  // how sessions and event types work — see Cache Operations sidebar.
  // Filters work in tandem with the Event Types filter: e.g. "All events"
  // + a single cache key shows every telemetry event PLUS only that one
  // cache key. The master "All operations" eye toggle hides every cache
  // event regardless of per-key state.
  if (event._source === 'cache-watch') {
    if (state.cacheAllHidden) return false;
    const ck = cacheKeyOf(event);
    if (ck && state.hiddenCacheKeys.has(ck)) return false;
    if (state.activeCacheKey && ck !== state.activeCacheKey) return false;
  } else {
    // Master "All events" toggle hides everything that isn't a cache pseudo-event.
    if (state.telemetryAllHidden) return false;
  }
  const importId = event._import && event._import.id;
  if (importId && state.hiddenImports.has(importId)) return false;
  if (state.activeImport && importId !== state.activeImport) return false;
  if (state.activeFilter !== 'all' && event.eventType !== state.activeFilter) return false;
  if (state.activeSession && event.sessionId !== state.activeSession) return false;
  if (state.searchQuery) {
    const json = JSON.stringify(event).toLowerCase();
    if (!json.includes(state.searchQuery.toLowerCase())) return false;
  }
  return true;
}

// ── Sidebar rendering ────────────────────────────────
const SVG_EYE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const SVG_EYE_OFF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
const SVG_TRASH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>';
const SVG_INFO = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

function renderFiltersNow() {
  // Sidebar EventTypes is now rendered by components/Sidebar.tsx. The
  // legacy DOM under #filterList is left empty after the first render.
  return;
  // eslint-disable-next-line no-unreachable
  for (const [type, count] of Object.entries(state.typeCounts)) {
    let el = filterList.querySelector('[data-filter="' + type + '"]');
    if (!el) {
      el = document.createElement('div');
      el.className = 'filter-item';
      el.dataset.filter = type;
      const color = getColor(type);
      el.innerHTML =
        '<div class="label-row"><span class="dot" style="background:' + color.fg + '"></span><span>' + escapeHtml(type) + '</span></div>' +
        '<div class="item-actions">' +
          '<button class="item-action danger trash-btn" title="Delete all events of this type">' + SVG_TRASH + '</button>' +
          '<button class="item-action eye-btn" title="Hide this event type">' + SVG_EYE + '</button>' +
        '</div>' +
        '<span class="count">0</span>';
      // Click label row to filter
      el.querySelector('.label-row').addEventListener('click', () => setFilter(type));
      // Eye button: toggle visibility
      el.querySelector('.eye-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHiddenType(type);
      });
      // Trash button: delete events of this type
      el.querySelector('.trash-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEventsByType(type);
      });
      filterList.appendChild(el);
    }
    el.querySelector('.count').textContent = count;
    el.classList.toggle('active', state.activeFilter === type);
    el.classList.toggle('hidden-item', state.hiddenTypes.has(type));
    const eyeBtn = el.querySelector('.eye-btn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.hiddenTypes.has(type) ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.hiddenTypes.has(type) ? 'Show this event type' : 'Hide this event type';
    }
  }
  // "All events" row count = telemetry events only (cache events have
  // their own master row). Reflect master-toggle hidden state on the eye
  // button so the row mirrors per-type / per-session affordances.
  const telemetryTotal = state.events.reduce(
    (acc, e) => acc + (e._source === 'cache-watch' ? 0 : 1),
    0
  );
  countAll.textContent = telemetryTotal;
  const allRow = filterList.querySelector('[data-filter="all"]');
  if (allRow) {
    allRow.classList.toggle('active', state.activeFilter === 'all' && !state.telemetryAllHidden);
    allRow.classList.toggle('hidden-item', state.telemetryAllHidden);
    const eyeBtn = allRow.querySelector('#eventsAllEyeBtn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.telemetryAllHidden ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.telemetryAllHidden ? 'Show all telemetry events' : 'Hide all telemetry events';
    }
  }
}

function renderSessionsNow() {
  // Sessions list rendered by components/Sidebar.tsx now.
  return;
  // eslint-disable-next-line no-unreachable
  const entries = Object.entries(state.sessionMap).sort((a, b) => b[1].firstSeen - a[1].firstSeen);
  sessionsEmpty.style.display = entries.length === 0 ? '' : 'none';

  const existingItems = sessionList.querySelectorAll('.filter-item');
  const existingSids = new Map();
  existingItems.forEach(el => existingSids.set(el.dataset.sessionId, el));

  for (const [sid, info] of entries) {
    let el = existingSids.get(sid);
    if (!el) {
      el = document.createElement('div');
      el.className = 'filter-item';
      el.dataset.sessionId = sid;
      el.innerHTML =
        '<div class="label-row"><span>' + sid.slice(0, 12) + '...</span></div>' +
        '<div class="item-actions">' +
          '<button class="item-action danger trash-btn" title="Delete all events from this session">' + SVG_TRASH + '</button>' +
          '<button class="item-action eye-btn" title="Hide this session">' + SVG_EYE + '</button>' +
        '</div>' +
        '<span class="count">0</span>';
      // Click label row to filter
      el.querySelector('.label-row').addEventListener('click', () => {
        state.activeSession = state.activeSession === sid ? null : sid;
        renderSessionsNow();
        applyFiltersInPlace();
      });
      // Eye button
      el.querySelector('.eye-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHiddenSession(sid);
      });
      // Trash button
      el.querySelector('.trash-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEventsBySession(sid);
      });
      sessionList.appendChild(el);
    }
    el.querySelector('.count').textContent = info.count;
    el.classList.toggle('active', state.activeSession === sid);
    el.classList.toggle('hidden-item', state.hiddenSessions.has(sid));
    const eyeBtn = el.querySelector('.eye-btn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.hiddenSessions.has(sid) ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.hiddenSessions.has(sid) ? 'Show this session' : 'Hide this session';
    }
  }
}

function renderImportsNow() {
  // Imports list rendered by components/Sidebar.tsx now.
  return;
  // eslint-disable-next-line no-unreachable
  const entries = Object.values(state.importMap).sort((a, b) => b.importedAt - a.importedAt);
  importsSection.style.display = entries.length === 0 ? 'none' : '';
  if (entries.length === 0) return;

  const existingEls = new Map();
  importList.querySelectorAll('.filter-item').forEach(el => existingEls.set(el.dataset.importId, el));

  for (const info of entries) {
    let el = existingEls.get(info.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'filter-item';
      el.dataset.importId = info.id;
      el.innerHTML =
        '<div class="label-row col">' +
          '<span>' + escapeHtml(info.name) + '</span>' +
          '<span class="import-meta"></span>' +
        '</div>' +
        '<div class="item-actions">' +
          '<button class="item-action danger trash-btn" title="Remove this imported batch">' + SVG_TRASH + '</button>' +
          '<button class="item-action eye-btn" title="Hide this import">' + SVG_EYE + '</button>' +
        '</div>' +
        '<span class="count">0</span>';
      el.querySelector('.label-row').addEventListener('click', () => {
        state.activeImport = state.activeImport === info.id ? null : info.id;
        renderImportsNow();
        applyFiltersInPlace();
      });
      el.querySelector('.eye-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHiddenImport(info.id);
      });
      el.querySelector('.trash-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEventsByImport(info.id);
      });
      importList.appendChild(el);
    }
    el.querySelector('.count').textContent = info.count;
    const sessCount = info.sessions.size;
    const metaEl = el.querySelector('.import-meta');
    if (metaEl) metaEl.textContent = sessCount + ' session' + (sessCount === 1 ? '' : 's');
    el.classList.toggle('active', state.activeImport === info.id);
    el.classList.toggle('hidden-item', state.hiddenImports.has(info.id));
    const eyeBtn = el.querySelector('.eye-btn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.hiddenImports.has(info.id) ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.hiddenImports.has(info.id) ? 'Show this import' : 'Hide this import';
    }
    // Only add the (?) button when there's an explanation. Its visibility is then governed
    // purely by the existing `.filter-item:hover .item-actions` rule — no inline display
    // tricks that could leak through.
    const actionsEl = el.querySelector('.item-actions');
    let infoBtn = el.querySelector('.info-btn');
    if (info.explanation && !infoBtn) {
      infoBtn = document.createElement('button');
      infoBtn.className = 'item-action info-btn';
      infoBtn.title = 'View explanation';
      infoBtn.innerHTML = SVG_INFO;
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const entry = state.importMap[info.id];
        if (entry && entry.explanation) {
          openExplanationModal('Explanation · ' + entry.name, entry.explanation);
        }
      });
      // Insert at the start of item-actions (before trash/eye) so it reads left-to-right
      // as: info, trash, eye.
      actionsEl.insertBefore(infoBtn, actionsEl.firstChild);
    } else if (!info.explanation && infoBtn) {
      infoBtn.remove();
    }
  }
}

function toggleHiddenType(type) {
  if (state.hiddenTypes.has(type)) {
    state.hiddenTypes.delete(type);
  } else {
    state.hiddenTypes.add(type);
  }
  renderFiltersNow();
  applyFiltersInPlace();
}

function toggleHiddenSession(sid) {
  if (state.hiddenSessions.has(sid)) {
    state.hiddenSessions.delete(sid);
  } else {
    state.hiddenSessions.add(sid);
  }
  renderSessionsNow();
  applyFiltersInPlace();
}

function deleteEventsByType(type) {
  state.events = state.events.filter(e => e.eventType !== type);
  delete state.typeCounts[type];
  state.hiddenTypes.delete(type);
  if (state.activeFilter === type) state.activeFilter = 'all';
  // Rebuild session counts
  rebuildSessionMap();
  // Remove the filter item from DOM
  const el = filterList.querySelector('[data-filter="' + type + '"]');
  if (el) el.remove();
  renderFiltersNow();
  renderSessionsNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function deleteEventsBySession(sid) {
  state.events = state.events.filter(e => e.sessionId !== sid);
  delete state.sessionMap[sid];
  state.hiddenSessions.delete(sid);
  if (state.activeSession === sid) state.activeSession = null;
  // Rebuild type counts
  rebuildTypeCounts();
  // Remove the session item from DOM
  const el = sessionList.querySelector('[data-session-id="' + sid + '"]');
  if (el) el.remove();
  renderFiltersNow();
  renderSessionsNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function rebuildTypeCounts() {
  state.typeCounts = {};
  for (const e of state.events) {
    const t = e.eventType || 'unknown';
    state.typeCounts[t] = (state.typeCounts[t] || 0) + 1;
  }
  // Remove stale filter DOM items
  filterList.querySelectorAll('[data-filter]:not([data-filter="all"])').forEach(el => {
    if (!state.typeCounts[el.dataset.filter]) el.remove();
  });
}

function rebuildSessionMap() {
  state.sessionMap = {};
  for (const e of state.events) {
    if (!e.sessionId) continue;
    if (!state.sessionMap[e.sessionId]) {
      state.sessionMap[e.sessionId] = { count: 0, firstSeen: e._receivedAt || Date.now() };
    }
    state.sessionMap[e.sessionId].count++;
  }
  // Remove stale session DOM items
  sessionList.querySelectorAll('.filter-item').forEach(el => {
    if (!state.sessionMap[el.dataset.sessionId]) el.remove();
  });
}

function rebuildImportMap() {
  state.importMap = {};
  for (const e of state.events) {
    const imp = e._import;
    if (!imp || !imp.id) continue;
    if (!state.importMap[imp.id]) {
      state.importMap[imp.id] = {
        id: imp.id,
        name: imp.name || imp.id,
        importedAt: imp.importedAt || Date.now(),
        count: 0,
        sessions: new Set(),
      };
    }
    const entry = state.importMap[imp.id];
    entry.count++;
    if (e.sessionId) entry.sessions.add(e.sessionId);
  }
  importList.querySelectorAll('.filter-item').forEach(el => {
    if (!state.importMap[el.dataset.importId]) el.remove();
  });
}

function toggleHiddenImport(importId) {
  if (state.hiddenImports.has(importId)) state.hiddenImports.delete(importId);
  else state.hiddenImports.add(importId);
  renderImportsNow();
  applyFiltersInPlace();
}

function deleteEventsByImport(importId) {
  state.events = state.events.filter(e => !(e._import && e._import.id === importId));
  delete state.importMap[importId];
  state.hiddenImports.delete(importId);
  if (state.activeImport === importId) state.activeImport = null;
  rebuildTypeCounts();
  rebuildSessionMap();
  const el = importList.querySelector('[data-import-id="' + importId + '"]');
  if (el) el.remove();
  renderFiltersNow();
  renderSessionsNow();
  renderImportsNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

// ── Cache Operations sidebar ─────────────────────────
// Keyed by `namespace/key`. Mirrors sessions/imports: click to filter,
// eye to hide, trash to delete all events for that key.
function renderCacheKeysNow() {
  // Cache Operations rendered by components/Sidebar.tsx now.
  return;
  // eslint-disable-next-line no-unreachable
  const entries = Object.values(state.cacheMap).sort(
    (a, b) => b.firstSeen - a.firstSeen
  );
  cacheListEmpty.style.display = entries.length === 0 ? '' : 'none';

  // Master "All operations" row state.
  const allRow = cacheList.querySelector('[data-cache-key="__all__"]');
  if (allRow) {
    const total = entries.reduce((acc, info) => acc + info.count, 0);
    const countEl = allRow.querySelector('.count');
    if (countEl) countEl.textContent = total;
    allRow.classList.toggle('active', state.activeCacheKey === null && !state.cacheAllHidden);
    allRow.classList.toggle('hidden-item', state.cacheAllHidden);
    const eyeBtn = allRow.querySelector('.eye-btn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.cacheAllHidden ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.cacheAllHidden ? 'Show all cache events' : 'Hide all cache events';
    }
  }

  const existingItems = cacheList.querySelectorAll('.filter-item:not([data-cache-key="__all__"])');
  const existingKeys = new Map();
  existingItems.forEach(el => existingKeys.set(el.dataset.cacheKey, el));

  for (const info of entries) {
    let el = existingKeys.get(info.key);
    if (!el) {
      el = document.createElement('div');
      el.className = 'filter-item';
      el.dataset.cacheKey = info.key;
      el.innerHTML =
        '<div class="label-row col">' +
          '<span>' + escapeHtml(info.namespace || '') + '/' + escapeHtml(info.logicalKey || '') + '</span>' +
          '<span class="import-meta" data-cache-meta></span>' +
        '</div>' +
        '<div class="item-actions">' +
          '<button class="item-action danger trash-btn" title="Delete all events for this cache key">' + SVG_TRASH + '</button>' +
          '<button class="item-action eye-btn" title="Hide this cache key">' + SVG_EYE + '</button>' +
        '</div>' +
        '<span class="count">0</span>';
      el.querySelector('.label-row').addEventListener('click', () => {
        state.activeCacheKey = state.activeCacheKey === info.key ? null : info.key;
        renderCacheKeysNow();
        applyFiltersInPlace();
      });
      el.querySelector('.eye-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHiddenCacheKey(info.key);
      });
      el.querySelector('.trash-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEventsByCacheKey(info.key);
      });
      cacheList.appendChild(el);
    }
    el.querySelector('.count').textContent = info.count;
    const meta = el.querySelector('[data-cache-meta]');
    if (meta) meta.textContent = (info.lastOp || '') + (info.count > 1 ? ' · ' + info.count : '');
    el.classList.toggle('active', state.activeCacheKey === info.key);
    el.classList.toggle('hidden-item', state.hiddenCacheKeys.has(info.key));
    const eyeBtn = el.querySelector('.eye-btn');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.hiddenCacheKeys.has(info.key) ? SVG_EYE_OFF : SVG_EYE;
      eyeBtn.title = state.hiddenCacheKeys.has(info.key) ? 'Show this cache key' : 'Hide this cache key';
    }
  }
}

function toggleHiddenCacheKey(ck) {
  if (state.hiddenCacheKeys.has(ck)) state.hiddenCacheKeys.delete(ck);
  else state.hiddenCacheKeys.add(ck);
  renderCacheKeysNow();
  applyFiltersInPlace();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function deleteEventsByCacheKey(ck) {
  state.events = state.events.filter(e => cacheKeyOf(e) !== ck);
  delete state.cacheMap[ck];
  state.hiddenCacheKeys.delete(ck);
  if (state.activeCacheKey === ck) state.activeCacheKey = null;
  rebuildTypeCounts();
  // sessionMap doesn't include cache events (no sessionId), so it's untouched.
  const el = cacheList.querySelector('[data-cache-key="' + cssEscape(ck) + '"]');
  if (el) el.remove();
  renderFiltersNow();
  renderCacheKeysNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

// "All operations" toggles every cache event globally without touching
// the per-key list. Lets users get a focused telemetry-only view in one
// click, while still leaving per-key filtering intact for when they
// flip it back on.
function toggleCacheAllHidden() {
  state.cacheAllHidden = !state.cacheAllHidden;
  renderCacheKeysNow();
  applyFiltersInPlace();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

// Mirror of toggleCacheAllHidden for the telemetry stream — hides every
// non-cache event globally without touching per-type filters.
function toggleTelemetryAllHidden() {
  state.telemetryAllHidden = !state.telemetryAllHidden;
  renderFiltersNow();
  applyFiltersInPlace();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function deleteAllTelemetryEvents() {
  state.events = state.events.filter(e => e._source === 'cache-watch');
  state.typeCounts = {};
  state.sessionMap = {};
  state.importMap = {};
  state.hiddenTypes.clear();
  state.hiddenSessions.clear();
  state.hiddenImports.clear();
  state.activeFilter = 'all';
  state.activeSession = null;
  state.activeImport = null;
  state.telemetryAllHidden = false;
  rebuildTypeCounts();
  // Strip per-type / per-session / per-import DOM rows; master rows stay.
  filterList.querySelectorAll('[data-filter]:not([data-filter="all"])').forEach(el => el.remove());
  sessionList.querySelectorAll('.filter-item').forEach(el => el.remove());
  importList.querySelectorAll('.filter-item').forEach(el => el.remove());
  renderFiltersNow();
  renderSessionsNow();
  renderImportsNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

function deleteAllCacheEvents() {
  state.events = state.events.filter(e => e._source !== 'cache-watch');
  state.cacheMap = {};
  state.hiddenCacheKeys.clear();
  state.activeCacheKey = null;
  state.cacheAllHidden = false;
  rebuildTypeCounts();
  // Wipe the per-key DOM rows but keep the "All operations" master row.
  cacheList.querySelectorAll('.filter-item:not([data-cache-key="__all__"])').forEach(el => el.remove());
  renderFiltersNow();
  renderCacheKeysNow();
  rerenderAll();
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
}

// ── Reconstruction from cache (always on by default) ─
// Storybook's `dev-server/lastEvents` cache is rewritten every time
// telemetry fires — each entry under content[<eventType>] is the full
// TelemetryEvent body plus a timestamp. We synthesize telemetry events
// from those writes so the dashboard works even when the user hasn't
// set STORYBOOK_TELEMETRY_URL (real telemetry continues to flow to
// production unmodified).
//
// Once a real instrumented telemetry event arrives via SSE we flip
// `state.realTelemetryDetected` and short-circuit reconstruction —
// real events are canonical, no point shadowing them with synthesized
// copies.
function reconstructTelemetryFromCacheWrite(cacheEvent) {
  if (state.realTelemetryDetected) return;
  if (!cacheEvent || !cacheEvent.payload) return;
  const p = cacheEvent.payload;
  // Only the lastEvents key under dev-server is the telemetry log.
  if (p.key !== 'lastEvents' || p.namespace !== 'dev-server') return;
  // Deletes don't add events.
  if (p.operation === 'delete') return;

  const next = (p.content && typeof p.content === 'object') ? p.content : {};
  const prev = (p.previousContent && typeof p.previousContent === 'object') ? p.previousContent : {};

  // Reusable accounting matching the SSE handler — keeps reconstructed
  // events behaving identically to "real" telemetry events.
  const ingest = (event) => {
    state.events.push(event);
    updateTypeCounts(event);
    updateSessionMap(event);
    updateImportMap(event);
    if (state.paused) {
      state.pausedWhileCount++;
      pausedCountEl.textContent = state.pausedWhileCount;
    } else {
      renderNewEvent(event);
    }
  };

  // First pass: collect candidates that are actually new or changed AND
  // not already present (by eventId) in state.events. We sort them by
  // their cache-recorded timestamp before assigning indices, so the
  // displayed `#N` follows chronology.
  const candidates = [];
  for (const eventType of Object.keys(next)) {
    const entry = next[eventType];
    if (!entry || typeof entry !== 'object' || !entry.body) continue;
    const prevEntry = prev[eventType];
    if (prevEntry && JSON.stringify(prevEntry) === JSON.stringify(entry)) continue;

    const body = entry.body;
    // Dedupe against any matching eventId already in state — covers
    // overlap with real telemetry that arrived between the cache write
    // and our processing.
    if (body && body.eventId && state.events.some(e => e.eventId === body.eventId)) continue;

    candidates.push({
      body,
      timestamp: typeof entry.timestamp === 'number'
        ? entry.timestamp
        : (cacheEvent._receivedAt || Date.now()),
    });
  }
  candidates.sort((a, b) => a.timestamp - b.timestamp);

  for (const c of candidates) {
    const reconstructed = Object.assign({}, c.body, {
      _source: 'cache-recon',
      _index: nextReconstructIndex(),
      _receivedAt: c.timestamp,
    });
    ingest(reconstructed);
  }
  if (candidates.length > 0) {
    updateCounters();
    if (typeof Timeline !== 'undefined') Timeline.invalidate();
  }
}

// Synthesize a `cache:write` event for a pre-existing cache entry so it
// shows up in the timeline / Cache Operations sidebar with the right
// timestamp. Used by the on-load backfill — we lose nothing since we
// also have the live watcher running for subsequent changes.
function ingestSyntheticCacheCreate(entry, cacheRoot, projectRoot) {
  if (!entry || !entry.key) return;
  const ts = typeof entry.mtime === 'number' ? entry.mtime : Date.now();
  // Dedupe: don't re-synthesize a cache event for a (file, mtime) we've
  // already represented in the timeline — regardless of which operation
  // captured it. A baked snapshot's `update` write at the current mtime
  // means we've already shown this state; adding a synthetic `create`
  // for the same (file, mtime) just produces a duplicate.
  if (state.events.some(e =>
    e._source === 'cache-watch' &&
    e.payload && e.payload.file === entry.file &&
    e._receivedAt === ts
  )) return;

  const synthetic = {
    eventType: 'cache:write',
    _source: 'cache-watch',
    _index: nextReconstructIndex(),
    _receivedAt: ts,
    payload: {
      key: entry.key,
      namespace: entry.namespace,
      file: entry.file,
      operation: 'create',
      content: entry.content,
      previousContent: null,
      diff: null,
    },
    context: { cacheRoot: cacheRoot || null, projectRoot: projectRoot || null },
  };
  state.events.push(synthetic);
  updateTypeCounts(synthetic);
  updateCacheMap(synthetic);
  if (state.paused) {
    state.pausedWhileCount++;
    pausedCountEl.textContent = state.pausedWhileCount;
  } else {
    renderNewEvent(synthetic);
  }
}

// On page load: fetch every existing cache entry, materialize them as
// `cache:write op=create` events in the timeline, and reconstruct the
// telemetry stream from `lastEvents`. Best-effort — silent failure
// just means the dashboard boots empty.
async function backfillFromCache() {
  try {
    const res = await fetch('/cache/entries');
    if (!res.ok) return;
    const data = await res.json();
    const entries = (data && Array.isArray(data.entries)) ? data.entries : [];
    if (entries.length === 0) return;

    // Cache operation backfill — sorted by mtime locally; telemetry
    // reconstruction sorts by its own timestamps. Each pass is sorted
    // internally but they push into state.events as two separate runs,
    // so we re-sort the whole array at the end to merge them.
    const sorted = entries.slice().sort((a, b) => (a.mtime || 0) - (b.mtime || 0));
    for (const entry of sorted) {
      ingestSyntheticCacheCreate(entry, data.cacheRoot, data.projectRoot);
    }

    if (!state.realTelemetryDetected) {
      const lastEvents = entries.find(e => e.key === 'lastEvents' && e.namespace === 'dev-server');
      if (lastEvents && lastEvents.content && typeof lastEvents.content === 'object') {
        reconstructTelemetryFromCacheWrite({
          _source: 'cache-watch',
          _receivedAt: Date.now(),
          payload: {
            key: 'lastEvents',
            namespace: 'dev-server',
            operation: 'update',
            previousContent: {},
            content: lastEvents.content,
          },
        });
      }
    }

    // Final merge: chronological order across both backfilled streams
    // (cache:create from mtime + reconstructed telemetry from entry
    // timestamps) plus any real telemetry already loaded from /event-log.
    // The subsequent rerenderAll() in loadExisting picks up this order.
    sortEventsByTime();

    updateCounters();
    if (typeof Timeline !== 'undefined') Timeline.invalidate();
  } catch (_) { /* best-effort */ }
}

// Sort state.events by _receivedAt ascending. Stable enough for our
// use — same-ms ties keep insertion order. Called after batch ingestion
// (backfill) so the dashboard list and session separators reflect true
// chronology rather than ingestion-pass grouping.
function sortEventsByTime() {
  state.events.sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0));
}

// `namespace/key` can contain characters CSS attribute selectors can't
// match without escaping (e.g. `:` in scoped keys). Use the spec's helper
// when available, fall back to a minimal escape.
function cssEscape(value) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return String(value).replace(/[^a-zA-Z0-9_-]/g, ch => '\\' + ch);
}

function setFilter(type) {
  state.activeFilter = state.activeFilter === type ? 'all' : type;
  renderFiltersNow();
  applyFiltersInPlace();
}

filterList.querySelector('[data-filter="all"]').addEventListener('click', () => {
  state.activeFilter = 'all';
  renderFiltersNow();
  applyFiltersInPlace();
});

function updateCounters() {
  const total = state.events.length;
  const visible = container.querySelectorAll('.event-card:not(.filtered-out)').length;
  const filterText = state.activeFilter !== 'all' || state.activeSession || state.searchQuery
    ? ' (' + visible + ' shown)' : '';
  eventCount.textContent = total + ' event' + (total !== 1 ? 's' : '') + filterText;
}

// ── Empty state ─────────────────────────────────────
function updateEmptyState(hasEventsButFiltered) {
  if (hasEventsButFiltered) {
    // Build a description of active filters
    const parts = [];
    if (state.activeFilter !== 'all') parts.push('type "' + state.activeFilter + '"');
    if (state.activeSession) parts.push('session ' + state.activeSession.slice(0, 8) + '...');
    if (state.searchQuery) parts.push('search "' + state.searchQuery + '"');
    if (state.hiddenTypes.size > 0) parts.push(state.hiddenTypes.size + ' hidden type' + (state.hiddenTypes.size > 1 ? 's' : ''));
    if (state.hiddenSessions.size > 0) parts.push(state.hiddenSessions.size + ' hidden session' + (state.hiddenSessions.size > 1 ? 's' : ''));

    emptyIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    emptyTitle.textContent = 'No matching events';
    emptySubtitle.textContent = parts.length > 0
      ? 'Filtered by: ' + parts.join(', ')
      : 'No events match the current filters';
    emptyCode.style.display = 'none';
    emptyFilterHint.style.display = '';
    emptyFilterHint.innerHTML = '';
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Clear all filters';
    resetBtn.addEventListener('click', () => {
      state.activeFilter = 'all';
      state.activeSession = null;
      state.searchQuery = '';
      state.hiddenTypes.clear();
      state.hiddenSessions.clear();
      searchInput.value = '';
      renderFiltersNow();
      renderSessionsNow();
      applyFiltersInPlace();
    });
    emptyFilterHint.appendChild(resetBtn);
  } else {
    emptyIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    emptyTitle.textContent = 'Waiting for telemetry events';
    emptySubtitle.textContent = 'Point Storybook at this collector to start capturing events';
    emptyCode.style.display = '';
    emptyFilterHint.style.display = 'none';
  }
}

// ── Actions ──────────────────────────────────────────
function copyEvent(idx) {
  const event = state.events.find(e => (e._index != null ? e._index : state.events.indexOf(e)) === idx);
  if (!event) return;
  const clean = { ...event }; delete clean._index; delete clean._receivedAt;
  navigator.clipboard.writeText(JSON.stringify(clean, null, 2));
  showToast('Copied to clipboard');
}

function copyEventCurl(idx) {
  const event = state.events.find(e => (e._index != null ? e._index : state.events.indexOf(e)) === idx);
  if (!event) return;
  const clean = { ...event }; delete clean._index; delete clean._receivedAt;
  const curl = "curl -X POST http://localhost:" + location.port + "/event-log -H 'Content-Type: application/json' -d '" +
    JSON.stringify(clean).replace(/'/g, "'\\''") + "'";
  navigator.clipboard.writeText(curl);
  showToast('Copied cURL command');
}

// ── Modal infrastructure ────────────────────────────
// Modal logic moved into components/Modal.tsx + store/modal.ts; the
// helpers below are thin aliases so the rest of the legacy file keeps
// working.
const openSaveModal = _openSaveModal;
const openExplanationModal = _openExplanationModal;

async function exportEvents() {
  const filtered = state.events.filter(matchesFilters).map(e => {
    const clean = { ...e }; delete clean._index; delete clean._receivedAt; return clean;
  });
  const defaultName = 'telemetry-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.json';
  const result = await openSaveModal({
    kind: 'json',
    defaultName: defaultName,
    extension: 'json',
    withExplanation: true,
  });
  if (!result) return;
  const payload = { version: 1, explanation: result.explanation || '', events: filtered };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = result.filename;
  a.click(); URL.revokeObjectURL(url);
  showToast('Exported ' + filtered.length + ' events');
}

function toggleJson(btn) {
  const targetId = btn.dataset.target;
  const target = document.getElementById(targetId);
  const hint = document.getElementById(targetId + '-hint');
  if (!target) return;
  const collapsed = target.classList.toggle('json-hidden');
  btn.innerHTML = collapsed ? '&#9654;' : '&#9660;';
  if (hint) hint.style.display = collapsed ? '' : 'none';
}

// Forward to the Preact-rendered ToastContainer; component reads from the
// signal queue and renders/removes items.
function showToast(msg) {
  _pushToast(msg);
}

// ── Pause / Resume ──────────────────────────────────
function setPaused(paused) {
  state.paused = paused;
  pauseSvg.innerHTML = paused
    ? '<polygon points="5,3 19,12 5,21" fill="currentColor"/>'
    : '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>';
  pauseLabel.textContent = paused ? 'Resume' : 'Pause';
  pauseBtn.classList.toggle('active', paused);
  statusDot.classList.toggle('paused', paused);
  pausedBanner.classList.toggle('visible', paused);
  layoutEl.classList.toggle('has-banner', paused);
  if (!paused) {
    state.pausedWhileCount = 0;
    pausedCountEl.textContent = '0';
    rerenderAll();
  }
}

// ── Button handlers ──────────────────────────────────
pauseBtn.addEventListener('click', () => setPaused(!state.paused));
pausedResumeBtn.addEventListener('click', () => setPaused(false));

scrollBtn.addEventListener('click', () => {
  state.autoScroll = !state.autoScroll;
  scrollBtn.classList.toggle('active', state.autoScroll);
  if (state.autoScroll) container.scrollTop = container.scrollHeight;
});

expandAllBtn.addEventListener('click', () => {
  state.expandAll = !state.expandAll;
  expandLabel.textContent = state.expandAll ? 'Collapse' : 'Expand';
  expandAllBtn.classList.toggle('active', state.expandAll);
  // The header button is view-aware: in dashboard view it expands event
  // cards, in cache view it expands cache entries — same affordance, the
  // user expects it to "do the right thing" for whatever they're looking at.
  if (state.view === 'cache' && typeof CacheView !== 'undefined') {
    CacheView.setAllExpanded(state.expandAll);
  } else {
    container.querySelectorAll('.event-card').forEach(card => {
      card.classList.toggle('expanded', state.expandAll);
    });
  }
});

const exportWrap = document.getElementById('exportWrap');
const exportMenu = document.getElementById('exportMenu');
function closeExportMenu() {
  exportWrap.classList.remove('open');
  exportBtn.setAttribute('aria-expanded', 'false');
}
function openExportMenu() {
  exportWrap.classList.add('open');
  exportBtn.setAttribute('aria-expanded', 'true');
}
exportBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (exportWrap.classList.contains('open')) closeExportMenu();
  else openExportMenu();
});
document.addEventListener('click', (e) => {
  if (!exportWrap.contains(e.target)) closeExportMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && exportWrap.classList.contains('open')) closeExportMenu();
});
exportMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.export-item');
  if (!item) return;
  closeExportMenu();
  const kind = item.dataset.export;
  if (kind === 'json') exportEvents();
  else if (kind === 'html') Timeline.exportHtmlSnapshot();
});

clearBtn.addEventListener('click', async () => {
  await fetch('/clear', { method: 'POST' });
  state.events = []; state.typeCounts = {}; state.sessionMap = {}; state.importMap = {};
  state.expandedCards.clear(); state.pausedWhileCount = 0;
  state.hiddenTypes.clear(); state.hiddenSessions.clear(); state.hiddenImports.clear();
  state.activeFilter = 'all'; state.activeSession = null; state.activeImport = null;
  pausedCountEl.textContent = '0'; lastSessionId = null;
  // Remove stale filter items (keep "All")
  filterList.querySelectorAll('[data-filter]:not([data-filter="all"])').forEach(el => el.remove());
  countAll.textContent = '0';
  filterList.querySelector('[data-filter="all"]').classList.add('active');
  // Remove stale session items
  sessionList.querySelectorAll('.filter-item').forEach(el => el.remove());
  sessionsEmpty.style.display = '';
  // Remove stale import items
  importList.querySelectorAll('.filter-item').forEach(el => el.remove());
  importsSection.style.display = 'none';
  // Clear event cards
  const children = Array.from(container.children);
  children.forEach(c => { if (c !== emptyState) c.remove(); });
  emptyState.style.display = '';
  updateCounters();
  if (typeof Timeline !== 'undefined') Timeline.invalidate();
});

// ── Search ───────────────────────────────────────────
let searchTimeout = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    state.searchQuery = searchInput.value;
    applyFiltersInPlace();
  }, 150);
});

// ── Keyboard shortcuts ───────────────────────────────
function isTypingTarget(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return false;
}
document.addEventListener('keydown', (e) => {
  if (e.target === searchInput) {
    if (e.key === 'Escape') {
      searchInput.value = ''; state.searchQuery = '';
      searchInput.blur(); applyFiltersInPlace();
    }
    return;
  }
  // Don't hijack typing inside any other input/textarea (e.g. the save/explanation modal).
  if (isTypingTarget(e.target)) return;
  // Don't fire shortcuts while a modal dialog is open — except Escape, which is handled
  // by the modal itself via its own listener.
  if (modalOverlay.classList.contains('active')) return;
  if (e.key === 'Escape') {
    if (typeof Timeline !== 'undefined' && Timeline.isDrawerOpen && Timeline.isDrawerOpen()) {
      Timeline.closeDrawer();
      return;
    }
  }
  if (state.view === 'timeline' && typeof Timeline !== 'undefined' && Timeline.isDrawerOpen && Timeline.isDrawerOpen()) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); Timeline.navigate(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); Timeline.navigate(1); return; }
  }
  if (e.key === ' ') { e.preventDefault(); setPaused(!state.paused); }
  else if (e.key === 'v' || e.key === 'V') {
    e.preventDefault();
    setView(state.view === 'timeline' ? 'dashboard' : 'timeline');
  }
  else if (e.key === 'e' || e.key === 'E') {
    if (state.view !== 'timeline') expandAllBtn.click();
  }
  else if (e.key === '/') { e.preventDefault(); searchInput.focus(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); searchInput.focus(); }
});

// ── Timeline view ────────────────────────────────────
const Timeline = (function () {
  const LANE_H = 44;
  const AXIS_H = 26;
  const LABEL_COL_W = 130;
  const DOT_R = 4;
  const LIFESPAN_H = 10;
  const GAP_SEG_DISP_MS = 400;
  const MINIMAP_HANDLE_HIT = 7;

  const st = {
    viewStartDisp: 0,
    viewEndDisp: 0,
    followTail: true,
    hoveredIdx: null,
    selectedIdx: null,
    panDrag: null,
    minimapDrag: null,
    collapseGaps: false,
    segments: null,
  };

  let wrapEl, axisCanvas, contentCanvas, minimapCanvas, minimapSelectEl, mainEl, tooltipEl, jumpBtn;
  let drawerEl, drawerTitle, drawerBody, drawerClose, drawerPrev, drawerNext, drawerPos;
  let zoomInfo, rangeInfo, liveInfo, emptyEl, fitBtn, collapseBtn;
  let axisCtx, contentCtx, minimapCtx;
  let dpr = 1;
  let rafPending = false;
  let hitMap = [];
  let currentDrawerEvent = null;
  const textWidthCache = new Map();

  function init() {
    wrapEl = document.getElementById('timelineView');
    axisCanvas = document.getElementById('tlAxisCanvas');
    contentCanvas = document.getElementById('tlContentCanvas');
    minimapCanvas = document.getElementById('tlMinimapCanvas');
    minimapSelectEl = document.getElementById('tlMinimapSelect');
    mainEl = document.getElementById('tlMain');
    tooltipEl = document.getElementById('tlTooltip');
    jumpBtn = document.getElementById('tlJumpBtn');
    drawerEl = document.getElementById('tlDrawer');
    drawerTitle = document.getElementById('tlDrawerTitle');
    drawerBody = document.getElementById('tlDrawerBody');
    drawerClose = document.getElementById('tlDrawerClose');
    drawerPrev = document.getElementById('tlDrawerPrev');
    drawerNext = document.getElementById('tlDrawerNext');
    drawerPos = document.getElementById('tlDrawerPos');
    zoomInfo = document.getElementById('tlZoomInfo');
    rangeInfo = document.getElementById('tlRangeInfo');
    liveInfo = document.getElementById('tlLive');
    emptyEl = document.getElementById('tlEmpty');
    fitBtn = document.getElementById('tlFitBtn');
    collapseBtn = document.getElementById('tlCollapseBtn');

    axisCtx = axisCanvas.getContext('2d');
    contentCtx = contentCanvas.getContext('2d');
    minimapCtx = minimapCanvas.getContext('2d');

    contentCanvas.addEventListener('mousemove', onContentMove);
    contentCanvas.addEventListener('mouseleave', onContentLeave);
    contentCanvas.addEventListener('mousedown', onContentDown);
    contentCanvas.addEventListener('click', onContentClick);
    contentCanvas.addEventListener('dblclick', fitAll);
    contentCanvas.addEventListener('wheel', onContentWheel, { passive: false });
    window.addEventListener('mouseup', onWindowUp);
    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('resize', () => { if (state.view === 'timeline') invalidate(); });
    mainEl.addEventListener('scroll', () => { /* native scroll, no redraw needed */ });

    minimapCanvas.addEventListener('mousedown', onMinimapDown);
    minimapCanvas.addEventListener('mousemove', onMinimapMove);
    minimapCanvas.addEventListener('mouseleave', () => { minimapCanvas.style.cursor = 'grab'; });
    minimapCanvas.addEventListener('wheel', onMinimapWheel, { passive: false });
    // Update cursor to crosshair when shift is held while hovering the minimap.
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift' && minimapCanvas.matches(':hover') && !st.minimapDrag) {
        minimapCanvas.style.cursor = 'crosshair';
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift' && !st.minimapDrag && minimapCanvas.matches(':hover')) {
        minimapCanvas.style.cursor = 'grab';
      }
    });

    fitBtn.addEventListener('click', fitAll);
    jumpBtn.addEventListener('click', () => { st.followTail = true; fitAll(); });
    drawerClose.addEventListener('click', closeDrawer);
    drawerPrev.addEventListener('click', () => navigateDrawer(-1));
    drawerNext.addEventListener('click', () => navigateDrawer(1));
    collapseBtn.addEventListener('click', toggleCollapseGaps);
  }

  function dataRange() {
    let first = Infinity, last = -Infinity;
    for (const e of state.events) {
      if (!e._receivedAt) continue;
      if (e._receivedAt < first) first = e._receivedAt;
      if (e._receivedAt > last) last = e._receivedAt;
    }
    if (!isFinite(first)) { const now = Date.now(); return [now - 60000, now]; }
    if (last - first < 1000) last = first + 1000;
    return [first, last];
  }

  function visibleSessions() {
    const map = new Map();
    // Synthetic cache lane — collects every cache:* pseudo-event into a
    // single lane labeled "Cache". Sits above the per-session lanes.
    const CACHE_LANE_ID = '__cache__';
    let cacheLane = null;
    for (const e of state.events) {
      // Cache events feed the cache lane regardless of sessionId.
      if (e._source === 'cache-watch') {
        const ck = cacheKeyOf(e);
        if (ck && state.hiddenCacheKeys.has(ck)) continue;
        if (!cacheLane) {
          cacheLane = {
            sid: CACHE_LANE_ID,
            kind: 'cache',
            first: e._receivedAt,
            last: e._receivedAt,
            events: [],
          };
        }
        if (e._receivedAt < cacheLane.first) cacheLane.first = e._receivedAt;
        if (e._receivedAt > cacheLane.last) cacheLane.last = e._receivedAt;
        if (!state.hiddenTypes.has(e.eventType)) cacheLane.events.push(e);
        continue;
      }
      if (!e.sessionId) continue;
      if (state.hiddenSessions.has(e.sessionId)) continue;
      let entry = map.get(e.sessionId);
      if (!entry) {
        entry = { sid: e.sessionId, kind: 'session', first: e._receivedAt, last: e._receivedAt, events: [] };
        map.set(e.sessionId, entry);
      }
      if (e._receivedAt < entry.first) entry.first = e._receivedAt;
      if (e._receivedAt > entry.last) entry.last = e._receivedAt;
      if (!state.hiddenTypes.has(e.eventType)) entry.events.push(e);
    }
    const sessionLanes = Array.from(map.values()).sort((a, b) => a.first - b.first);
    return cacheLane ? [cacheLane, ...sessionLanes] : sessionLanes;
  }

  // Build piecewise time-mapping segments.
  // When collapseGaps is on, any inter-event gap larger than gapThresholdMs
  // is compressed to GAP_SEG_DISP_MS in display-space.
  function rebuildSegments() {
    const [first, last] = dataRange();
    if (!st.collapseGaps || state.events.length < 2) {
      st.segments = [{ srcStart: first, srcEnd: last, dispStart: 0, dispEnd: last - first, type: 'data' }];
      return;
    }
    const stamps = [];
    for (const e of state.events) if (e._receivedAt) stamps.push(e._receivedAt);
    stamps.sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < stamps.length; i++) gaps.push(stamps[i] - stamps[i - 1]);
    const sorted = gaps.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const threshold = Math.max(3000, median * 8);

    const segs = [];
    let disp = 0;
    let segStart = stamps[0];
    for (let i = 1; i < stamps.length; i++) {
      const gap = stamps[i] - stamps[i - 1];
      if (gap > threshold) {
        const dataLen = stamps[i - 1] - segStart;
        segs.push({ srcStart: segStart, srcEnd: stamps[i - 1], dispStart: disp, dispEnd: disp + dataLen, type: 'data' });
        disp += dataLen;
        segs.push({ srcStart: stamps[i - 1], srcEnd: stamps[i], dispStart: disp, dispEnd: disp + GAP_SEG_DISP_MS, type: 'gap', srcLen: gap });
        disp += GAP_SEG_DISP_MS;
        segStart = stamps[i];
      }
    }
    const dataLen = stamps[stamps.length - 1] - segStart;
    segs.push({ srcStart: segStart, srcEnd: stamps[stamps.length - 1], dispStart: disp, dispEnd: disp + dataLen, type: 'data' });
    st.segments = segs;
  }

  function srcToDisp(srcMs) {
    const segs = st.segments;
    if (srcMs <= segs[0].srcStart) return segs[0].dispStart + (srcMs - segs[0].srcStart);
    const lastSeg = segs[segs.length - 1];
    if (srcMs >= lastSeg.srcEnd) return lastSeg.dispEnd + (srcMs - lastSeg.srcEnd);
    for (const s of segs) {
      if (srcMs >= s.srcStart && srcMs <= s.srcEnd) {
        if (s.type === 'data') {
          return s.dispStart + (srcMs - s.srcStart);
        } else {
          const frac = (srcMs - s.srcStart) / Math.max(1, s.srcEnd - s.srcStart);
          return s.dispStart + frac * (s.dispEnd - s.dispStart);
        }
      }
    }
    return segs[0].dispStart;
  }
  function dispToSrc(dispMs) {
    const segs = st.segments;
    if (dispMs <= segs[0].dispStart) return segs[0].srcStart + (dispMs - segs[0].dispStart);
    const lastSeg = segs[segs.length - 1];
    if (dispMs >= lastSeg.dispEnd) return lastSeg.srcEnd + (dispMs - lastSeg.dispEnd);
    for (const s of segs) {
      if (dispMs >= s.dispStart && dispMs <= s.dispEnd) {
        if (s.type === 'data') {
          return s.srcStart + (dispMs - s.dispStart);
        } else {
          const frac = (dispMs - s.dispStart) / Math.max(1, s.dispEnd - s.dispStart);
          return s.srcStart + frac * (s.srcEnd - s.srcStart);
        }
      }
    }
    return segs[0].srcStart;
  }

  function totalDisp() {
    const segs = st.segments;
    return segs[segs.length - 1].dispEnd - segs[0].dispStart;
  }

  function fitAll() {
    rebuildSegments();
    const segs = st.segments;
    const totalD = totalDisp();
    const pad = Math.max(500, totalD * 0.04);
    st.viewStartDisp = segs[0].dispStart - pad;
    st.viewEndDisp = segs[segs.length - 1].dispEnd + pad;
    st.followTail = true;
    invalidate();
  }

  function timeToX(t, width) {
    const contentW = width - LABEL_COL_W;
    const d = srcToDisp(t);
    return LABEL_COL_W + ((d - st.viewStartDisp) / (st.viewEndDisp - st.viewStartDisp)) * contentW;
  }
  function xToDisp(x, width) {
    const contentW = width - LABEL_COL_W;
    return st.viewStartDisp + ((x - LABEL_COL_W) / contentW) * (st.viewEndDisp - st.viewStartDisp);
  }
  function xToTime(x, width) {
    return dispToSrc(xToDisp(x, width));
  }

  function chooseTickInterval(rangeMs, pxPerTick, totalPx) {
    const candidates = [1000, 2000, 5000, 10000, 15000, 30000, 60000, 120000, 300000, 600000, 1800000, 3600000];
    const targetTicks = Math.max(4, Math.floor(totalPx / pxPerTick));
    const ideal = rangeMs / targetTicks;
    for (const c of candidates) if (c >= ideal) return c;
    return candidates[candidates.length - 1];
  }

  function formatRelTime(ms, firstMs, withMs) {
    const d = Math.max(0, ms - firstMs);
    const m = Math.floor(d / 60000);
    const s = Math.floor((d % 60000) / 1000);
    const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
    const base = pad2(m) + ':' + pad2(s);
    if (!withMs) return base;
    const mm = Math.floor(d % 1000);
    return base + '.' + (mm < 10 ? '00' + mm : mm < 100 ? '0' + mm : '' + mm);
  }

  function formatClockTime(ms, includeSeconds) {
    const d = new Date(ms);
    const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
    const base = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    return includeSeconds ? base + ':' + pad2(d.getSeconds()) : base;
  }

  function formatGapDuration(ms) {
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    if (ms < 3600000) return Math.round(ms / 60000) + 'm';
    return (ms / 3600000).toFixed(1) + 'h';
  }

  function invalidate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; if (state.view === 'timeline') render(); });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const mainW = mainEl.clientWidth || wrapEl.clientWidth || 800;
    const sessions = visibleSessions();
    const totalH = Math.max(sessions.length * LANE_H + 8, mainEl.clientHeight || 400);

    const setCanvas = (c, ctx, w, h) => {
      const pxW = Math.round(w * dpr);
      const pxH = Math.round(h * dpr);
      if (c.width !== pxW) c.width = pxW;
      if (c.height !== pxH) c.height = pxH;
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvas(axisCanvas, axisCtx, mainW, AXIS_H);
    setCanvas(contentCanvas, contentCtx, mainW, totalH);

    const mmRect = minimapCanvas.parentElement.getBoundingClientRect();
    const mmW = Math.max(100, mmRect.width - 28);
    const mmH = 32;
    setCanvas(minimapCanvas, minimapCtx, mmW, mmH);
  }

  function render() {
    const hasEvents = state.events.length > 0;
    rebuildSegments();
    renderEmptyState();

    if (hasEvents && st.viewStartDisp === 0 && st.viewEndDisp === 0) fitAll();

    if (st.followTail && hasEvents) {
      const lastDisp = st.segments[st.segments.length - 1].dispEnd;
      const range = st.viewEndDisp - st.viewStartDisp;
      const pad = range * 0.02;
      st.viewEndDisp = lastDisp + pad;
      st.viewStartDisp = st.viewEndDisp - range;
    }

    resize();
    drawAxis();
    drawContent();
    drawMinimap();
    updateInfo();
  }

  function renderEmptyState() {
    const total = state.events.length;
    const sessions = visibleSessions();
    if (total === 0) {
      emptyEl.classList.remove('has-action');
      emptyEl.innerHTML =
        '<div class="empty-icon">' +
        '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="7" cy="12" r="2.2" fill="var(--accent)"/><circle cx="13" cy="12" r="2.2" fill="var(--accent)"/><circle cx="18" cy="12" r="2.2" fill="var(--accent)"/></svg>' +
        '</div>' +
        '<h3>Waiting for telemetry events</h3>' +
        '<p>Point Storybook at this collector to start capturing events</p>' +
        '<code>STORYBOOK_TELEMETRY_URL=' + escapeHtml(location.origin) + '/event-log</code>';
      emptyEl.style.display = '';
      return;
    }
    if (sessions.length === 0 || sessions.every(s => s.events.length === 0)) {
      emptyEl.classList.add('has-action');
      const parts = [];
      if (state.activeFilter !== 'all') parts.push('type "' + state.activeFilter + '"');
      if (state.activeSession) parts.push('session ' + state.activeSession.slice(0, 8));
      if (state.hiddenTypes.size > 0) parts.push(state.hiddenTypes.size + ' hidden type' + (state.hiddenTypes.size !== 1 ? 's' : ''));
      if (state.hiddenSessions.size > 0) parts.push(state.hiddenSessions.size + ' hidden session' + (state.hiddenSessions.size !== 1 ? 's' : ''));
      if (state.searchQuery) parts.push('search "' + state.searchQuery + '"');
      const filterDesc = parts.length > 0 ? parts.join(', ') : 'the current filters';
      emptyEl.innerHTML =
        '<div class="empty-icon">' +
        '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--text-dim)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' +
        '</div>' +
        '<h3>No matching events</h3>' +
        '<p>' + total + ' event' + (total !== 1 ? 's' : '') + ' captured, hidden by ' + escapeHtml(filterDesc) + '.</p>' +
        '<button type="button" class="tl-empty-action" id="tlEmptyClear">Clear all filters</button>';
      emptyEl.style.display = '';
      const btn = document.getElementById('tlEmptyClear');
      if (btn) btn.addEventListener('click', () => {
        state.activeFilter = 'all';
        state.activeSession = null;
        state.searchQuery = '';
        state.hiddenTypes.clear();
        state.hiddenSessions.clear();
        const searchInputEl = document.getElementById('searchInput');
        if (searchInputEl) searchInputEl.value = '';
        renderFiltersNow();
        renderSessionsNow();
        applyFiltersInPlace();
      });
      return;
    }
    emptyEl.style.display = 'none';
  }

  function updateInfo() {
    const [first] = dataRange();
    const segs = st.segments;
    const totalD = Math.max(1, totalDisp());
    const viewD = Math.max(1, st.viewEndDisp - st.viewStartDisp);
    const zoom = totalD / viewD;
    zoomInfo.innerHTML = 'Zoom: <b>' + (zoom < 10 ? zoom.toFixed(1) : Math.round(zoom)) + '×</b>';
    if (state.events.length > 0) {
      const startSrc = dispToSrc(st.viewStartDisp);
      const endSrc = dispToSrc(st.viewEndDisp);
      rangeInfo.innerHTML =
        'Range: <b>' + formatClockTime(startSrc, true) + ' – ' + formatClockTime(endSrc, true) + '</b>' +
        ' <span style="color:var(--text-dim)">(+' + formatRelTime(startSrc, first) + ' – +' + formatRelTime(endSrc, first) + ')</span>';
    } else {
      rangeInfo.innerHTML = 'Range: <b>—</b>';
    }
    liveInfo.classList.toggle('off', !st.followTail);
    liveInfo.textContent = 'LIVE';
    jumpBtn.classList.toggle('visible', !st.followTail && state.events.length > 0);
    collapseBtn.classList.toggle('active', st.collapseGaps);
  }

  function drawAxis() {
    const w = axisCanvas.clientWidth, h = AXIS_H;
    axisCtx.clearRect(0, 0, w, h);
    if (state.events.length === 0) return;

    const viewRange = st.viewEndDisp - st.viewStartDisp;
    const tickMs = chooseTickInterval(viewRange, 110, w - LABEL_COL_W);
    const includeSeconds = tickMs < 60000;

    // Ticks walk through display space (per data segment); skip gap segments.
    axisCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    axisCtx.textAlign = 'center';
    axisCtx.textBaseline = 'middle';

    for (const seg of st.segments) {
      if (seg.type !== 'data') continue;
      // Iterate ticks in src time within this data segment, clipped to view
      const segViewSrcStart = Math.max(seg.srcStart, dispToSrc(st.viewStartDisp));
      const segViewSrcEnd = Math.min(seg.srcEnd, dispToSrc(st.viewEndDisp));
      if (segViewSrcEnd <= segViewSrcStart) continue;
      const startT = Math.ceil(segViewSrcStart / tickMs) * tickMs;
      for (let t = startT; t <= segViewSrcEnd; t += tickMs) {
        const x = timeToX(t, w);
        if (x < LABEL_COL_W) continue;
        axisCtx.fillStyle = 'rgba(255,255,255,0.08)';
        axisCtx.fillRect(x, h - 5, 1, 4);
        axisCtx.fillStyle = '#9ba8b9';
        axisCtx.fillText(formatClockTime(t, includeSeconds), x, h / 2 - 1);
      }
    }

    // Draw gap markers on axis (chevrons)
    for (const seg of st.segments) {
      if (seg.type !== 'gap') continue;
      const x1 = LABEL_COL_W + ((seg.dispStart - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      const x2 = LABEL_COL_W + ((seg.dispEnd - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      if (x2 < LABEL_COL_W || x1 > w) continue;
      const cx = (Math.max(LABEL_COL_W, x1) + Math.min(w, x2)) / 2;
      axisCtx.fillStyle = 'rgba(251,191,36,0.7)';
      axisCtx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
      axisCtx.fillText('⎯⎯', cx, h / 2 - 1);
    }

    axisCtx.fillStyle = '#1e2a3a';
    axisCtx.fillRect(LABEL_COL_W, 0, 1, h);
  }

  function drawContent() {
    const w = contentCanvas.clientWidth, h = contentCanvas.clientHeight;
    contentCtx.clearRect(0, 0, w, h);

    const sessions = visibleSessions();
    hitMap = [];
    if (sessions.length === 0) return;

    // Draw gap bands across all lanes (behind dots)
    const viewRange = st.viewEndDisp - st.viewStartDisp;
    for (const seg of st.segments) {
      if (seg.type !== 'gap') continue;
      const x1 = LABEL_COL_W + ((seg.dispStart - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      const x2 = LABEL_COL_W + ((seg.dispEnd - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      const gx1 = Math.max(LABEL_COL_W, x1);
      const gx2 = Math.min(w, x2);
      if (gx2 <= gx1) continue;
      contentCtx.fillStyle = 'rgba(251,191,36,0.04)';
      contentCtx.fillRect(gx1, 0, gx2 - gx1, h);
      contentCtx.strokeStyle = 'rgba(251,191,36,0.35)';
      contentCtx.setLineDash([3, 3]);
      contentCtx.lineWidth = 1;
      contentCtx.beginPath();
      contentCtx.moveTo(gx1 + 0.5, 0); contentCtx.lineTo(gx1 + 0.5, h);
      contentCtx.moveTo(gx2 - 0.5, 0); contentCtx.lineTo(gx2 - 0.5, h);
      contentCtx.stroke();
      contentCtx.setLineDash([]);
      const mid = (gx1 + gx2) / 2;
      contentCtx.fillStyle = 'rgba(251,191,36,0.7)';
      contentCtx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
      contentCtx.textAlign = 'center';
      contentCtx.textBaseline = 'middle';
      contentCtx.fillText(formatGapDuration(seg.srcLen || 0), mid, 10);
    }

    contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    contentCtx.textBaseline = 'middle';

    for (let i = 0; i < sessions.length; i++) {
      const lane = sessions[i];
      const yTop = i * LANE_H;
      const yDot = yTop + 11;
      const yLabel = yTop + 22 + 11;

      contentCtx.fillStyle = 'rgba(255,255,255,0.025)';
      contentCtx.fillRect(LABEL_COL_W, yTop + LANE_H - 1, w - LABEL_COL_W, 1);

      const firstEvent = lane.events[0] || { eventType: 'unknown' };
      const sessionColor = getColor(firstEvent.eventType).fg;
      const x1 = timeToX(lane.first, w);
      const x2 = timeToX(lane.last, w);
      const barX = Math.max(LABEL_COL_W, x1);
      const barW = Math.min(w, x2) - barX;
      if (barW > 0) {
        contentCtx.fillStyle = hexToRgba(sessionColor, 0.18);
        contentCtx.fillRect(barX, yDot - LIFESPAN_H / 2, barW, LIFESPAN_H);
      }

      // Cache lane is never dimmed by an activeSession filter — they're orthogonal.
      const dimSession = lane.kind !== 'cache' && state.activeSession && state.activeSession !== lane.sid;
      const sessionAlpha = dimSession ? 0.3 : 1;
      const laneHits = [];
      let lastLabelRight = -Infinity;

      for (const e of lane.events) {
        const x = timeToX(e._receivedAt, w);
        if (x < LABEL_COL_W - 12 || x > w + 12) continue;
        const color = getColor(e.eventType).fg;
        const isHover = st.hoveredIdx === e._index;
        const isSelected = st.selectedIdx === e._index;
        const matches = eventMatchesActiveFilters(e);
        const alpha = sessionAlpha * (matches ? 1 : 0.25);

        contentCtx.globalAlpha = alpha;
        contentCtx.fillStyle = color;
        contentCtx.beginPath();
        contentCtx.arc(x, yDot, isHover || isSelected ? DOT_R + 2 : DOT_R, 0, Math.PI * 2);
        contentCtx.fill();
        contentCtx.strokeStyle = '#0a0e14';
        contentCtx.lineWidth = 1.5;
        contentCtx.stroke();

        if (isSelected) {
          contentCtx.globalAlpha = 1;
          contentCtx.strokeStyle = '#6c9ef8';
          contentCtx.lineWidth = 2;
          contentCtx.beginPath();
          contentCtx.arc(x, yDot, DOT_R + 5, 0, Math.PI * 2);
          contentCtx.stroke();
          contentCtx.strokeStyle = 'rgba(108,158,248,0.35)';
          contentCtx.lineWidth = 2;
          contentCtx.beginPath();
          contentCtx.arc(x, yDot, DOT_R + 8, 0, Math.PI * 2);
          contentCtx.stroke();
          contentCtx.globalAlpha = alpha;
        } else if (isHover) {
          contentCtx.globalAlpha = 1;
          contentCtx.strokeStyle = 'rgba(108,158,248,0.7)';
          contentCtx.lineWidth = 2;
          contentCtx.beginPath();
          contentCtx.arc(x, yDot, DOT_R + 4, 0, Math.PI * 2);
          contentCtx.stroke();
          contentCtx.globalAlpha = alpha;
        }

        const text = e.eventType || 'unknown';
        const tw = getTextWidth(text);
        const labelLeft = x - tw / 2;
        const collides = labelLeft < lastLabelRight + 4;
        contentCtx.globalAlpha = sessionAlpha * (matches ? (collides ? 0.35 : 1) : 0.15);
        contentCtx.fillStyle = collides ? 'rgba(155,168,185,0.9)' : '#9ba8b9';
        contentCtx.textAlign = 'center';
        contentCtx.fillText(text, x, yLabel);
        if (!collides) lastLabelRight = x + tw / 2;

        laneHits.push({ x, y: yDot, idx: e._index, event: e });
      }
      contentCtx.globalAlpha = 1;

      hitMap.push({ yTop, yBottom: yTop + LANE_H, hits: laneHits, sid: lane.sid });
    }

    // Draw sticky label column LAST so it covers events that overflow left
    contentCtx.fillStyle = 'rgba(10,14,20,0.96)';
    contentCtx.fillRect(0, 0, LABEL_COL_W, h);
    contentCtx.fillStyle = '#1e2a3a';
    contentCtx.fillRect(LABEL_COL_W, 0, 1, h);

    for (let i = 0; i < sessions.length; i++) {
      const lane = sessions[i];
      const yTop = i * LANE_H;
      // Cache lane is never dimmed by an activeSession filter — they're orthogonal.
      const dimSession = lane.kind !== 'cache' && state.activeSession && state.activeSession !== lane.sid;

      if (state.activeSession === lane.sid) {
        contentCtx.fillStyle = 'rgba(108,158,248,0.06)';
        contentCtx.fillRect(0, yTop, LABEL_COL_W, LANE_H);
        contentCtx.fillStyle = '#6c9ef8';
        contentCtx.fillRect(0, yTop, 2, LANE_H);
      }

      contentCtx.fillStyle = dimSession ? 'rgba(155,168,185,0.45)' : '#e2e8f0';
      contentCtx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      contentCtx.textAlign = 'left';
      const laneLabel = lane.kind === 'cache' ? 'Cache' : lane.sid.slice(0, 8);
      contentCtx.fillText(laneLabel, 12, yTop + LANE_H / 2 - 6);
      contentCtx.fillStyle = dimSession ? 'rgba(95,112,133,0.6)' : '#5f7085';
      contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      const subLabel = lane.kind === 'cache'
        ? lane.events.length + ' op' + (lane.events.length !== 1 ? 's' : '')
        : lane.events.length + ' event' + (lane.events.length !== 1 ? 's' : '');
      contentCtx.fillText(subLabel, 12, yTop + LANE_H / 2 + 8);
    }
  }

  // Minimap uses linear src-time mapping (not collapsed) so you see true density.
  function minimapCoords() {
    const w = minimapCanvas.clientWidth;
    const [first, last] = dataRange();
    const range = Math.max(1, last - first);
    const viewStartSrc = dispToSrc(st.viewStartDisp);
    const viewEndSrc = dispToSrc(st.viewEndDisp);
    return {
      w,
      first,
      last,
      range,
      wx1: Math.max(0, ((viewStartSrc - first) / range) * w),
      wx2: Math.min(w, ((viewEndSrc - first) / range) * w),
    };
  }

  function drawMinimap() {
    const w = minimapCanvas.clientWidth, h = minimapCanvas.clientHeight;
    minimapCtx.clearRect(0, 0, w, h);
    minimapCtx.fillStyle = '#080b10';
    minimapCtx.fillRect(0, 0, w, h);
    minimapCtx.strokeStyle = '#1e2a3a';
    minimapCtx.strokeRect(0.5, 0.5, w - 1, h - 1);

    if (state.events.length === 0) return;
    const { first, range, wx1, wx2 } = minimapCoords();

    for (const e of state.events) {
      if (!e._receivedAt) continue;
      if (state.hiddenTypes.has(e.eventType)) continue;
      if (e.sessionId && state.hiddenSessions.has(e.sessionId)) continue;
      if (e._source === 'cache-watch') {
        const ck = cacheKeyOf(e);
        if (ck && state.hiddenCacheKeys.has(ck)) continue;
      }
      const x = ((e._receivedAt - first) / range) * w;
      minimapCtx.fillStyle = hexToRgba(getColor(e.eventType).fg, 0.55);
      minimapCtx.fillRect(x, h * 0.25, 1.5, h * 0.5);
    }

    // Viewport window
    minimapCtx.fillStyle = 'rgba(108,158,248,0.14)';
    minimapCtx.fillRect(wx1, 0, wx2 - wx1, h);
    minimapCtx.strokeStyle = '#6c9ef8';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(wx1 + 0.5, 0.5, Math.max(1, wx2 - wx1 - 1), h - 1);

    // Handles at edges: visible vertical grab bars
    const drawHandle = (x) => {
      minimapCtx.fillStyle = '#6c9ef8';
      minimapCtx.fillRect(x - 2, 2, 4, h - 4);
      minimapCtx.fillStyle = 'rgba(10,14,20,0.75)';
      minimapCtx.fillRect(x - 0.5, 5, 1, h - 10);
    };
    drawHandle(wx1);
    drawHandle(wx2);
  }

  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function getTextWidth(text) {
    let w = textWidthCache.get(text);
    if (w != null) return w;
    contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    w = contentCtx.measureText(text).width;
    textWidthCache.set(text, w);
    return w;
  }
  function eventMatchesActiveFilters(e) {
    if (state.activeFilter !== 'all' && e.eventType !== state.activeFilter) return false;
    if (state.searchQuery) {
      const json = JSON.stringify(e).toLowerCase();
      if (!json.includes(state.searchQuery.toLowerCase())) return false;
    }
    return true;
  }

  function findEventAt(clientX, clientY) {
    const rect = contentCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < LABEL_COL_W) return null;
    for (const lane of hitMap) {
      if (y < lane.yTop || y > lane.yBottom) continue;
      let best = null, bestD = 10;
      for (const h of lane.hits) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d < bestD) { bestD = d; best = h; }
      }
      return best;
    }
    return null;
  }

  function findLaneLabelAt(clientX, clientY) {
    const rect = contentCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x > LABEL_COL_W) return null;
    for (const lane of hitMap) if (y >= lane.yTop && y <= lane.yBottom) return lane;
    return null;
  }

  function onContentMove(e) {
    if (st.panDrag) {
      const dx = e.clientX - st.panDrag.x;
      const w = contentCanvas.clientWidth;
      const dispPerPx = (st.panDrag.end - st.panDrag.start) / (w - LABEL_COL_W);
      const delta = -dx * dispPerPx;
      st.viewStartDisp = st.panDrag.start + delta;
      st.viewEndDisp = st.panDrag.end + delta;
      st.followTail = false;
      invalidate();
      return;
    }
    const hit = findEventAt(e.clientX, e.clientY);
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    contentCanvas.classList.toggle('hovering', !!hit || !!lane);
    if (hit) {
      if (st.hoveredIdx !== hit.idx) { st.hoveredIdx = hit.idx; invalidate(); }
      showTooltip(hit.event, e.clientX, e.clientY);
    } else {
      if (st.hoveredIdx !== null) { st.hoveredIdx = null; invalidate(); }
      tooltipEl.style.display = 'none';
    }
  }
  function onContentLeave() {
    if (st.hoveredIdx !== null) { st.hoveredIdx = null; invalidate(); }
    tooltipEl.style.display = 'none';
    contentCanvas.classList.remove('hovering');
  }
  function onContentDown(e) {
    if (e.button !== 0) return;
    const hit = findEventAt(e.clientX, e.clientY);
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    if (hit || lane) return;
    st.panDrag = { x: e.clientX, start: st.viewStartDisp, end: st.viewEndDisp, moved: false };
    contentCanvas.classList.add('grabbing');
  }
  function onContentClick(e) {
    const hit = findEventAt(e.clientX, e.clientY);
    if (hit) { openDrawer(hit.event); return; }
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    if (lane) {
      // Cache lane click jumps to the Cache view rather than acting as a
      // session filter — sessions don't apply to it.
      if (lane.sid === '__cache__') {
        setView('cache');
        return;
      }
      state.activeSession = state.activeSession === lane.sid ? null : lane.sid;
      renderSessionsNow();
      applyFiltersInPlace();
      invalidate();
    }
  }
  function onContentWheel(e) {
    e.preventDefault();
    const rect = contentCanvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    if (cx < LABEL_COL_W) return;
    const w = contentCanvas.clientWidth;
    const pivotDisp = xToDisp(cx, w);
    const factor = Math.pow(1.0018, e.deltaY);
    zoomAroundDisp(pivotDisp, factor);
  }
  function zoomAroundDisp(pivotDisp, factor) {
    const newStart = pivotDisp - (pivotDisp - st.viewStartDisp) * factor;
    const newEnd = pivotDisp + (st.viewEndDisp - pivotDisp) * factor;
    const newRange = newEnd - newStart;
    const totalD = Math.max(1000, totalDisp());
    if (newRange < 100 || newRange > totalD * 4) return;
    st.viewStartDisp = newStart;
    st.viewEndDisp = newEnd;
    st.followTail = false;
    invalidate();
  }
  function onWindowUp() {
    if (st.panDrag) {
      st.panDrag = null;
      contentCanvas.classList.remove('grabbing');
    }
    if (st.minimapDrag) {
      const d = st.minimapDrag;
      if (d.mode === 'box-select') {
        const x1 = Math.max(0, Math.min(d.startX, d.currentX));
        const x2 = Math.min(d.rectWidth, Math.max(d.startX, d.currentX));
        if (x2 - x1 >= 4) {
          const [first, last] = dataRange();
          const range = Math.max(1, last - first);
          const srcStart = first + (x1 / d.rectWidth) * range;
          const srcEnd = first + (x2 / d.rectWidth) * range;
          st.viewStartDisp = srcToDisp(srcStart);
          st.viewEndDisp = srcToDisp(srcEnd);
          st.followTail = false;
          invalidate();
        }
        minimapSelectEl.classList.remove('active');
      }
      st.minimapDrag = null;
      minimapCanvas.style.cursor = 'grab';
    }
  }
  function onWindowMove(e) {
    if (!st.minimapDrag) return;
    const rect = minimapCanvas.getBoundingClientRect();
    const w = rect.width;
    const d = st.minimapDrag;
    const x = e.clientX - rect.left;
    if (d.mode === 'box-select') {
      d.currentX = Math.max(0, Math.min(w, x));
      updateMinimapSelectOverlay();
      return;
    }
    const [first, last] = dataRange();
    const range = Math.max(1, last - first);
    const dx = x - d.startX;
    const srcPerPx = range / w;
    const deltaSrc = dx * srcPerPx;
    if (d.mode === 'pan') {
      const newStartSrc = d.startSrcStart + deltaSrc;
      const newEndSrc = d.startSrcEnd + deltaSrc;
      st.viewStartDisp = srcToDisp(newStartSrc);
      st.viewEndDisp = srcToDisp(newEndSrc);
    } else if (d.mode === 'resize-left') {
      const newStartSrc = Math.min(d.startSrcEnd - 200, d.startSrcStart + deltaSrc);
      st.viewStartDisp = srcToDisp(newStartSrc);
    } else if (d.mode === 'resize-right') {
      const newEndSrc = Math.max(d.startSrcStart + 200, d.startSrcEnd + deltaSrc);
      st.viewEndDisp = srcToDisp(newEndSrc);
    }
    st.followTail = false;
    invalidate();
  }
  function minimapHitMode(x) {
    const { wx1, wx2 } = minimapCoords();
    if (Math.abs(x - wx1) < MINIMAP_HANDLE_HIT) return 'resize-left';
    if (Math.abs(x - wx2) < MINIMAP_HANDLE_HIT) return 'resize-right';
    if (x >= wx1 && x <= wx2) return 'pan';
    return 'seek';
  }
  function onMinimapMove(e) {
    if (st.minimapDrag) return;
    const rect = minimapCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (e.shiftKey) {
      minimapCanvas.style.cursor = 'crosshair';
      return;
    }
    const mode = minimapHitMode(x);
    const cursor = mode === 'resize-left' || mode === 'resize-right' ? 'ew-resize'
      : mode === 'pan' ? 'grab'
      : 'crosshair';
    minimapCanvas.style.cursor = cursor;
  }
  function onMinimapDown(e) {
    const rect = minimapCanvas.getBoundingClientRect();
    const w = rect.width;
    const x = e.clientX - rect.left;
    // Shift+drag → box-select a time window to zoom into.
    if (e.shiftKey) {
      e.preventDefault();
      st.minimapDrag = { mode: 'box-select', startX: x, currentX: x, rectWidth: w };
      updateMinimapSelectOverlay();
      minimapCanvas.style.cursor = 'crosshair';
      return;
    }
    const mode = minimapHitMode(x);
    const [first, last] = dataRange();
    const range = Math.max(1, last - first);
    const viewStartSrc = dispToSrc(st.viewStartDisp);
    const viewEndSrc = dispToSrc(st.viewEndDisp);
    if (mode === 'seek') {
      const centerSrc = first + (x / w) * range;
      const vrSrc = viewEndSrc - viewStartSrc;
      st.viewStartDisp = srcToDisp(centerSrc - vrSrc / 2);
      st.viewEndDisp = srcToDisp(centerSrc + vrSrc / 2);
      st.followTail = false;
      invalidate();
      return;
    }
    st.minimapDrag = {
      mode,
      startX: x,
      startSrcStart: viewStartSrc,
      startSrcEnd: viewEndSrc,
    };
    minimapCanvas.style.cursor = mode === 'pan' ? 'grabbing' : 'ew-resize';
  }

  function updateMinimapSelectOverlay() {
    const d = st.minimapDrag;
    if (!d || d.mode !== 'box-select') {
      minimapSelectEl.classList.remove('active');
      return;
    }
    const x1 = Math.min(d.startX, d.currentX);
    const x2 = Math.max(d.startX, d.currentX);
    // Position relative to minimap-wrap (which is the offset parent with padding 6 14).
    minimapSelectEl.style.left = (14 + x1) + 'px';
    minimapSelectEl.style.width = Math.max(0, x2 - x1) + 'px';
    minimapSelectEl.classList.add('active');
  }
  function onMinimapWheel(e) {
    e.preventDefault();
    const rect = minimapCanvas.getBoundingClientRect();
    const w = rect.width;
    const [first, last] = dataRange();
    const range = Math.max(1, last - first);
    const x = e.clientX - rect.left;
    const pivotSrc = first + (x / w) * range;
    const pivotDisp = srcToDisp(pivotSrc);
    const factor = Math.pow(1.0018, e.deltaY);
    zoomAroundDisp(pivotDisp, factor);
  }

  function showTooltip(event, clientX, clientY) {
    const color = getColor(event.eventType);
    const [first] = dataRange();
    tooltipEl.innerHTML =
      '<div class="tt-badge" style="background:' + color.bg + '; color:' + color.fg + '">' + escapeHtml(event.eventType || 'unknown') + '</div>' +
      '<div class="tt-row"><span>session</span><span class="val">' + (event.sessionId ? event.sessionId.slice(0, 8) : '—') + '</span></div>' +
      '<div class="tt-row"><span>time</span><span class="val">' + formatClockTime(event._receivedAt, true) + '</span></div>' +
      '<div class="tt-row"><span>elapsed</span><span class="val">+' + formatRelTime(event._receivedAt, first) + '</span></div>' +
      '<div class="tt-row"><span>index</span><span class="val">#' + event._index + '</span></div>' +
      '<div class="tt-hint">click for details →</div>';
    tooltipEl.style.display = 'block';
    const tRect = tooltipEl.getBoundingClientRect();
    const wrapRect = wrapEl.getBoundingClientRect();
    let left = clientX - wrapRect.left + 14;
    let top = clientY - wrapRect.top + 14;
    if (left + tRect.width + 14 > wrapRect.width) left = clientX - wrapRect.left - tRect.width - 14;
    if (top + tRect.height + 14 > wrapRect.height) top = clientY - wrapRect.top - tRect.height - 14;
    tooltipEl.style.left = Math.max(6, left) + 'px';
    tooltipEl.style.top = Math.max(6, top) + 'px';
  }

  function sessionEventsFor(sid) {
    return state.events.filter(e => e.sessionId === sid).sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0));
  }

  // Cache events live in the synthetic "Cache" lane and don't have a
  // sessionId — drawer prev/next walks them linearly in chronological
  // order regardless of namespace/key, so users can scrub through every
  // cache write in sequence.
  function allCacheEventsByTime() {
    return state.events
      .filter(e => e._source === 'cache-watch')
      .sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0));
  }

  // Returns the navigable list for a given drawer event — session events
  // for telemetry, all cache events (linear by time) for cache pseudo-events.
  function navigableEventsFor(event) {
    if (!event) return [];
    if (event._source === 'cache-watch') return allCacheEventsByTime();
    if (event.sessionId) return sessionEventsFor(event.sessionId);
    return [];
  }

  function openDrawer(event) {
    const color = getColor(event.eventType);
    // Title shows the event-type badge, the index, and a session/cache-key
    // hint depending on which kind of event it is — cache events don't have
    // a sessionId, so we surface the namespace/key instead.
    const isCacheEvent = event._source === 'cache-watch';
    const isReconstructed = event._source === 'cache-recon';
    const subLabel = isCacheEvent
      ? cacheKeyOf(event) || 'cache'
      : (event.sessionId ? event.sessionId.slice(0, 8) : '—');
    const reconBadge = isReconstructed
      ? '<span class="event-recon-badge" title="Reconstructed from a lastEvents cache write — STORYBOOK_TELEMETRY_URL was not set">' +
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1 1 5.64 5.64L23 10"/></svg>' +
          'cache' +
        '</span>'
      : '';
    const drawerPos = state.events.indexOf(event);
    const drawerDisplayIdx = drawerPos >= 0 ? drawerPos + 1 : event._index;
    drawerTitle.innerHTML =
      '<span class="event-badge" style="background:' + color.bg + '; color:' + color.fg + '">' + escapeHtml(event.eventType || 'unknown') + '</span>' +
      reconBadge +
      '<span style="color:var(--text-dim); font-size:11px; font-family:var(--font-mono)">#' + drawerDisplayIdx + ' · ' + escapeHtml(subLabel) + '</span>';

    // Reuse the same tab renderer used by event cards in the dashboard view
    // — Diff/Payload/Context/Raw and the side-by-side diff stay consistent.
    const tabs = buildEventTabs(event, 'tl_' + event._index);
    drawerBody.innerHTML = '<div class="event-tabs">' + tabs.tabsHtml + '</div>' + tabs.contentHtml;
    tabs.attach(drawerBody);

    currentDrawerEvent = event;
    st.selectedIdx = event._index;
    updateDrawerNav();
    drawerEl.classList.add('open');
    focusSelectedEvent(event);
    invalidate();
  }

  // Pan (and if needed, zoom out) so the selected dot is visible in the portion
  // of the canvas not covered by the drawer.
  function focusSelectedEvent(event) {
    if (!event) return;
    const canvasW = contentCanvas.clientWidth || 0;
    if (canvasW <= 0) return;
    const drawerW = drawerEl.classList.contains('open') ? (drawerEl.clientWidth || 0) : 0;
    const pad = 24;
    const visibleLeft = LABEL_COL_W + pad;
    const visibleRight = canvasW - drawerW - pad;
    if (visibleRight <= visibleLeft) return;
    const dotDisp = srcToDisp(event._receivedAt);
    const viewRange = st.viewEndDisp - st.viewStartDisp;
    const contentW = canvasW - LABEL_COL_W;
    const dotX = LABEL_COL_W + ((dotDisp - st.viewStartDisp) / viewRange) * contentW;
    if (dotX >= visibleLeft && dotX <= visibleRight) return;
    // Center dot inside the visible region.
    const visibleCenter = (visibleLeft + visibleRight) / 2;
    const dispPerPx = viewRange / contentW;
    const desiredStart = dotDisp - (visibleCenter - LABEL_COL_W) * dispPerPx;
    st.viewStartDisp = desiredStart;
    st.viewEndDisp = desiredStart + viewRange;
    st.followTail = false;
  }

  function updateDrawerNav() {
    if (!currentDrawerEvent) {
      drawerPrev.disabled = true;
      drawerNext.disabled = true;
      drawerPos.textContent = '';
      return;
    }
    const list = navigableEventsFor(currentDrawerEvent);
    const pos = list.findIndex(e => e._index === currentDrawerEvent._index);
    drawerPrev.disabled = pos <= 0;
    drawerNext.disabled = pos === -1 || pos >= list.length - 1;
    drawerPos.textContent = pos === -1 ? '' : ((pos + 1) + ' / ' + list.length);
    // Tooltip wording reflects what we're navigating through.
    const navLabel = currentDrawerEvent._source === 'cache-watch' ? 'cache operation' : 'session';
    drawerPrev.title = 'Previous ' + navLabel + ' (←)';
    drawerNext.title = 'Next ' + navLabel + ' (→)';
  }

  function navigateDrawer(dir) {
    if (!currentDrawerEvent) return;
    const list = navigableEventsFor(currentDrawerEvent);
    const pos = list.findIndex(e => e._index === currentDrawerEvent._index);
    const target = list[pos + dir];
    if (!target) return;
    openDrawer(target);
  }

  function closeDrawer() {
    drawerEl.classList.remove('open');
    currentDrawerEvent = null;
    st.selectedIdx = null;
    invalidate();
  }

  function toggleCollapseGaps() {
    st.collapseGaps = !st.collapseGaps;
    const midSrc = dispToSrc((st.viewStartDisp + st.viewEndDisp) / 2);
    rebuildSegments();
    const midDisp = srcToDisp(midSrc);
    const total = totalDisp();
    const viewD = Math.max(500, Math.min(total * 1.1, st.viewEndDisp - st.viewStartDisp));
    st.viewStartDisp = midDisp - viewD / 2;
    st.viewEndDisp = midDisp + viewD / 2;
    st.followTail = false;
    invalidate();
  }

  async function exportHtmlSnapshot() {
    const snapAt = new Date();
    const defaultName = 'storybook-telemetry-snapshot-' + snapAt.toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.html';
    const result = await openSaveModal({
      kind: 'html',
      defaultName: defaultName,
      extension: 'html',
      withExplanation: true,
    });
    if (!result) return;
    const filename = result.filename;
    const explanation = result.explanation || '';
    // Snapshot name: the file name without extension. Keeps it stable across renames.
    const snapshotName = filename.replace(/\.html$/i, '');

    // Capture cache state at snapshot time (best-effort — if the routes
    // aren't reachable, we proceed without it). Edit / Refresh / Clear /
    // Change-root buttons are disabled in the snapshot regardless.
    let cacheInfo = null;
    let cacheEntries = null;
    try {
      const [infoRes, entriesRes] = await Promise.all([
        fetch('/cache/info'),
        fetch('/cache/entries'),
      ]);
      cacheInfo = await infoRes.json();
      const data = await entriesRes.json();
      cacheEntries = data && Array.isArray(data.entries) ? data.entries : [];
    } catch (_) { /* leave nulls — snapshot will surface "unavailable" */ }

    // Fetch the prebuilt single-file dashboard (the same artifact the server
    // is currently serving). It already has CSS + Preact bundle inlined, so
    // the snapshot is self-contained without DOM cloning. Falls back to
    // cloning the live document if the fetch fails (defensive — by
    // construction the export only runs against a live server).
    let baseHtml: string | null = null;
    try {
      const res = await fetch('/event-log-dashboard.html', { cache: 'no-store' });
      if (res.ok) baseHtml = await res.text();
    } catch (_) { /* fall through to live-clone */ }
    let clone;
    if (baseHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(baseHtml, 'text/html');
      clone = doc.documentElement;
    } else {
      clone = document.documentElement.cloneNode(true);
    }

    const events = state.events.slice();
    const [first, last] = dataRange();
    const durationMs = events.length > 1 ? last - first : 0;
    const sessionCount = new Set(events.map((e) => e.sessionId).filter(Boolean)).size;

    // Snapshot-specific styles: banner, hide controls that can't function statically,
    // kill the LIVE/green connection indicator so viewers don't think it's still listening.
    const snapshotStyle = document.createElement('style');
    snapshotStyle.textContent = [
      '.snapshot-banner {',
      '  position: sticky; top: 0; z-index: 9999;',
      '  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;',
      '  padding: 8px 16px; font-family: var(--font-sans); font-size: 12px;',
      '  background: linear-gradient(90deg, rgba(251,191,36,0.18), rgba(251,191,36,0.05));',
      '  border-bottom: 1px solid rgba(251,191,36,0.4);',
      '  color: #fbbf24; letter-spacing: 0.4px;',
      '}',
      '.snapshot-banner .center { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; justify-content: center; }',
      '.snapshot-banner b { color: #fef3c7; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }',
      '.snapshot-banner .name { color: #fef3c7; font-weight: 500; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0; }',
      '.snapshot-banner .dot { width:8px; height:8px; border-radius:50%; background:#fbbf24; box-shadow:0 0 8px rgba(251,191,36,0.6); }',
      '.snapshot-banner .meta { color: rgba(255,255,255,0.6); }',
      '.snapshot-banner .explain-btn {',
      '  margin-left: auto; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;',
      '  padding: 4px 10px; font-family: var(--font-sans); font-size: 11px;',
      '  color: #fef3c7; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.45);',
      '  border-radius: 6px; cursor: pointer; letter-spacing: 0.3px;',
      '}',
      '.snapshot-banner .explain-btn:hover { background: rgba(251,191,36,0.22); border-color: rgba(251,191,36,0.7); }',
      // Body is height: 100vh + overflow: hidden in the live dashboard. The
      // banner sits before the header and naturally pushes the layout below
      // the viewport, clipping the bottom rows. Switch to a flex column so
      // banner + header + layout compose vertically and the layout fills
      // whatever remains of 100vh — works regardless of banner wrap height.
      'body { display: flex; flex-direction: column; }',
      '.snapshot-banner { flex: 0 0 auto; }',
      '.header { flex: 0 0 auto; }',
      '#layout { flex: 1 1 0; min-height: 0; height: auto !important; }',
      '.layout.has-banner { height: auto !important; }',
      // Neuter live-only controls
      '#pauseBtn, #scrollBtn, #clearBtn, #pausedResumeBtn { display: none !important; }',
      // Kill the green "connected" status dot in the header — snapshot banner conveys mode.
      '#statusDot { background: #fbbf24 !important; box-shadow: 0 0 8px rgba(251,191,36,0.5) !important; animation: none !important; }',
      // Kill the timeline LIVE pill.
      '.tl-toolbar .tl-live { display: none !important; }',
      // Kill the drag-and-drop import affordance — import endpoint is stubbed anyway.
      '#dropOverlay { display: none !important; }',
      // Cache panel: hide everything that would mutate disk state. Edit
      // mode toggle, Refresh, Change root, Clear, plus per-entry Edit /
      // Delete buttons (kept Copy because it's read-only).
      '#cacheRefreshBtn, #cacheChangeRootBtn, #cacheClearBtn, #cacheEditToggleRow { display: none !important; }',
      '.cache-entry-actions [data-action="edit"], .cache-entry-actions [data-action="delete"], .cache-entry-actions [data-action="save-edit"], .cache-entry-actions [data-action="cancel-edit"] { display: none !important; }',
    ].join('\n');
    clone.querySelector('head').appendChild(snapshotStyle);

    // Update title so snapshot tabs are distinguishable.
    const titleEl = clone.querySelector('title');
    if (titleEl) titleEl.textContent = snapshotName + ' · Snapshot · ' + events.length + ' events';

    // Inject the Snapshot banner (with the snapshot name) at top of body.
    // The banner also hosts the "View explanation" button on the right (when present).
    const body = clone.querySelector('body');
    const banner = document.createElement('div');
    banner.className = 'snapshot-banner';
    const explainBtnHtml = explanation
      ? '<button type="button" class="explain-btn" id="snapshotExplainBtn">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
          'View explanation' +
        '</button>'
      : '';
    banner.innerHTML =
      '<div class="center">' +
        '<span class="dot"></span>' +
        '<b>Snapshot</b>' +
        '<span class="name">' + escapeHtml(snapshotName) + '</span>' +
        '<span class="meta">·</span>' +
        '<span class="meta">captured ' + escapeHtml(snapAt.toLocaleString()) + '</span>' +
        '<span class="meta">·</span>' +
        '<span class="meta">' + events.length + ' event' + (events.length === 1 ? '' : 's') + ' · ' + sessionCount + ' session' + (sessionCount === 1 ? '' : 's') +
        (durationMs > 0 ? ' · ' + formatGapDuration(durationMs) + ' span' : '') +
        '</span>' +
      '</div>' +
      explainBtnHtml;
    body.insertBefore(banner, body.firstChild);

    // When we cloned the live document (fallback path), strip dynamic DOM
    // that was rendered from runtime state — the baked __SNAPSHOT__ globals
    // make the app re-render those nodes on boot with their listeners.
    // Cloning doesn't copy listeners; leaving the live nodes in place leaves
    // their interactions dead. Skipped when we used the prebuilt HTML
    // (which has none of these dynamic nodes to begin with).
    if (!baseHtml) {
      const stripSelectors = [
        '#filterList [data-filter]:not([data-filter="all"])',
        '#sessionList .filter-item',
        '#importList .filter-item',
        '#cacheList .filter-item',
        '#eventContainer .event-card',
        '#eventContainer .session-separator',
      ];
      stripSelectors.forEach((sel) => {
        clone.querySelectorAll(sel).forEach((el) => el.remove());
      });
      const cloneCacheEmpty = clone.querySelector('#cacheListEmpty');
      if (cloneCacheEmpty) cloneCacheEmpty.style.display = '';
      const cloneAll = clone.querySelector('#filterList [data-filter="all"]');
      if (cloneAll) { cloneAll.classList.add('active'); const c = cloneAll.querySelector('.count'); if (c) c.textContent = '0'; }
      const cloneCountAll = clone.querySelector('#countAll');
      if (cloneCountAll) cloneCountAll.textContent = '0';
      const cloneSessionsEmpty = clone.querySelector('#sessionsEmpty');
      if (cloneSessionsEmpty) cloneSessionsEmpty.style.display = '';
      const cloneImportsSection = clone.querySelector('#importsSection');
      if (cloneImportsSection) cloneImportsSection.style.display = 'none';
      const cloneEmptyState = clone.querySelector('#emptyState');
      if (cloneEmptyState) cloneEmptyState.style.display = '';
    }

    // Bake events + snapshot metadata + neutered networking BEFORE the app script runs.
    const bootstrap = document.createElement('script');
    bootstrap.textContent = [
      '(function() {',
      '  window.__SNAPSHOT__ = true;',
      '  window.__SNAPSHOT_EVENTS__ = ' + JSON.stringify(events) + ';',
      // Carry over the live realTelemetryDetected flag so reconstruction
      // doesn\'t re-run on snapshot load. Storybook generates DIFFERENT
      // eventIds for HTTP-sent telemetry vs the body it stores in the
      // lastEvents cache — so the eventId-based dedup misses, and
      // reconstruction would silently add ghost events for every entry
      // in lastEvents that originally fired as real telemetry.
      '  window.__SNAPSHOT_REAL_TELEMETRY_DETECTED__ = ' + JSON.stringify(state.realTelemetryDetected) + ';',
      '  window.__SNAPSHOT_CACHE_INFO__ = ' + JSON.stringify(cacheInfo) + ';',
      '  window.__SNAPSHOT_CACHE_ENTRIES__ = ' + JSON.stringify(cacheEntries) + ';',
      '  window.__SNAPSHOT_META__ = ' + JSON.stringify({
        name: snapshotName,
        explanation: explanation,
        capturedAt: snapAt.toISOString(),
        eventsCount: events.length,
        sessionsCount: sessionCount,
      }) + ';',
      '  // Serve baked data for the read endpoints; no-op everything else.',
      '  window.fetch = function(input, init) {',
      '    var url = typeof input === "string" ? input : (input && input.url) || "";',
      '    var method = (init && init.method) || "GET";',
      '    if (method === "GET" && /\\/event-log(\\?|$)/.test(url)) {',
      '      return Promise.resolve(new Response(JSON.stringify(window.__SNAPSHOT_EVENTS__), { status: 200, headers: { "Content-Type": "application/json" } }));',
      '    }',
      '    if (method === "GET" && /\\/cache\\/info(\\?|$)/.test(url)) {',
      '      var info = window.__SNAPSHOT_CACHE_INFO__ || { cacheStatus: "not-found", projectRoot: null, cacheRoot: null, version: null };',
      '      return Promise.resolve(new Response(JSON.stringify(info), { status: 200, headers: { "Content-Type": "application/json" } }));',
      '    }',
      '    if (method === "GET" && /\\/cache\\/entries(\\?|$)/.test(url)) {',
      '      var info2 = window.__SNAPSHOT_CACHE_INFO__ || { cacheStatus: "not-found", projectRoot: null, cacheRoot: null, version: null };',
      '      var body = Object.assign({}, info2, { entries: window.__SNAPSHOT_CACHE_ENTRIES__ || [] });',
      '      return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } }));',
      '    }',
      '    if (method === "GET" && /\\/config(\\?|$)/.test(url)) {',
      '      return Promise.resolve(new Response(JSON.stringify({ cacheEnabledByDefault: true, snapshot: true }), { status: 200, headers: { "Content-Type": "application/json" } }));',
      '    }',
      '    // Snapshot is read-only — POST/PUT/DELETE are swallowed.',
      '    return Promise.resolve(new Response("", { status: 204 }));',
      '  };',
      '  // Disable SSE so there is no "LIVE" connection attempt.',
      '  function NoopES() { this.readyState = 2; this.close = function(){}; this.addEventListener = function(){}; this.removeEventListener = function(){}; this.onopen = null; this.onerror = null; this.onmessage = null; }',
      '  NoopES.CONNECTING = 0; NoopES.OPEN = 1; NoopES.CLOSED = 2;',
      '  window.EventSource = NoopES;',
      '})();',
    ].join('\n');
    // The bundled dashboard uses a deferred `<script type="module">` (Vite's
    // default) that runs after DOM parsing. Inserting the bootstrap as a
    // synchronous `<script>` at the top of <head> guarantees it executes
    // before the module — so __SNAPSHOT__ globals + fetch / EventSource
    // stubs are in place before any app code runs.
    const headEl = clone.querySelector('head');
    if (headEl) headEl.insertBefore(bootstrap, headEl.firstChild);
    else clone.insertBefore(bootstrap, clone.firstChild);

    const html = '<!DOCTYPE html>\n' + clone.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported HTML snapshot');
  }

  return {
    init,
    invalidate,
    fitAll,
    closeDrawer,
    navigate: navigateDrawer,
    isDrawerOpen: () => drawerEl && drawerEl.classList.contains('open'),
    exportHtmlSnapshot,
  };
})();

Timeline.init();

// ── View switching ───────────────────────────────────
function setView(view) {
  if (view !== 'dashboard' && view !== 'timeline' && view !== 'cache') view = 'dashboard';
  state.view = view;
  scheduleMirror(state);
  try { localStorage.setItem('sbutils.eventlog.view', view); } catch (_) { /* ignore */ }
  document.body.classList.toggle('view-timeline', view === 'timeline');
  document.body.classList.toggle('view-dashboard', view === 'dashboard');
  document.body.classList.toggle('view-cache', view === 'cache');
  document.getElementById('eventContainer').style.display = view === 'dashboard' ? '' : 'none';
  document.getElementById('timelineView').style.display = view === 'timeline' ? '' : 'none';
  document.getElementById('cacheView').style.display = view === 'cache' ? '' : 'none';
  document.querySelectorAll('#viewToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  if (view === 'timeline') Timeline.invalidate();
  if (view === 'cache') CacheView.refresh();
}


document.querySelectorAll('#viewToggle button').forEach(b => {
  b.addEventListener('click', () => setView(b.dataset.view));
});

// ── Cache view ───────────────────────────────────────
const CacheView = (() => {
  // Server-resolved cache state. Edit mode is purely client-side now.
  let info = { cacheStatus: 'not-found', projectRoot: null, cacheRoot: null, version: null };
  let entries = [];
  // Edit mode controls whether write affordances (Edit/Delete/Clear) appear.
  // Persisted in localStorage per-browser. Never on in snapshots — they're
  // read-only artifacts and the underlying cache isn't mutable from here.
  let editMode = false;
  if (!window.__SNAPSHOT__) {
    try { editMode = localStorage.getItem('sbutils.eventlog.cache.editMode') === '1'; } catch (_) {}
  }
  // Track expanded entries by `${namespace}/${key}` so refresh doesn't collapse them.
  const expanded = new Set();
  // Same key set used to remember which entries are mid-edit.
  const editing = new Map();

  const $ = (id) => document.getElementById(id);

  function entryKey(entry) { return entry.namespace + '/' + entry.key; }

  async function fetchInfo() {
    try {
      const res = await fetch('/cache/info');
      info = await res.json();
    } catch (err) {
      info = { cacheStatus: 'unreadable', projectRoot: null, cacheRoot: null, version: null, error: String(err) };
    }
    renderHeader();
  }

  async function fetchEntries() {
    if (info.cacheStatus !== 'found') { entries = []; renderEntries(); return; }
    try {
      const res = await fetch('/cache/entries');
      const data = await res.json();
      entries = Array.isArray(data.entries) ? data.entries : [];
    } catch (err) {
      entries = [];
    }
    renderEntries();
  }

  function renderHeader() {
    const status = info.cacheStatus || 'not-found';
    const statusEl = $('cacheRootStatus');
    statusEl.textContent = status === 'found' ? 'Active' : status === 'unreadable' ? 'Unreadable' : 'Not found';
    statusEl.className = 'cache-root-status ' + (status === 'found' ? '' : status);

    const pathEl = $('cacheRootPath');
    pathEl.textContent = info.projectRoot || 'No project resolved — pass --project-root or click “Change root…”';

    const versionEl = $('cacheRootVersion');
    if (info.version) {
      versionEl.style.display = '';
      versionEl.textContent = 'sb ' + info.version;
    } else {
      versionEl.style.display = 'none';
    }

    // Edit mode toggle visual state + dependent affordances.
    $('cacheEditToggleSwitch').classList.toggle('on', editMode);
    $('cacheWritesBanner').style.display = editMode ? '' : 'none';
    $('cacheClearBtn').style.display = editMode && status === 'found' ? '' : 'none';

    // Empty-state visibility.
    $('cacheEmpty').style.display = status === 'found' ? 'none' : '';
  }

  function renderEntries() {
    const container = $('cacheEntries');
    if (info.cacheStatus !== 'found') { container.innerHTML = ''; return; }

    // Group by namespace.
    const byNs = new Map();
    for (const e of entries) {
      if (!byNs.has(e.namespace)) byNs.set(e.namespace, []);
      byNs.get(e.namespace).push(e);
    }
    const namespaces = Array.from(byNs.keys()).sort();

    if (namespaces.length === 0) {
      container.innerHTML = '<div class="cache-empty"><h3>Cache root is empty</h3><p>No entries written yet under <code>' + escapeHtml(info.cacheRoot || '') + '</code></p></div>';
      return;
    }

    container.innerHTML = namespaces.map(ns => {
      const items = byNs.get(ns).sort((a, b) => a.key.localeCompare(b.key));
      return (
        '<div class="cache-namespace" data-ns="' + escapeHtml(ns) + '">' +
          '<div class="cache-namespace-header">' +
            '<span>' + escapeHtml(ns) + '</span>' +
            '<span class="cache-namespace-count">' + items.length + ' entr' + (items.length === 1 ? 'y' : 'ies') + '</span>' +
          '</div>' +
          items.map(renderEntry).join('') +
        '</div>'
      );
    }).join('');

    // Re-bind events.
    container.querySelectorAll('.cache-entry-header').forEach(h => {
      h.addEventListener('click', () => {
        const wrap = h.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        if (expanded.has(key)) { expanded.delete(key); wrap.classList.remove('expanded'); }
        else { expanded.add(key); wrap.classList.add('expanded'); }
      });
    });
    container.querySelectorAll('[data-action="copy"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = b.closest('.cache-entry').dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        navigator.clipboard.writeText(JSON.stringify(entry.content, null, 2));
        b.textContent = 'Copied!';
        setTimeout(() => { b.textContent = 'Copy content'; }, 1200);
      });
    });
    container.querySelectorAll('[data-action="edit"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        editing.set(key, JSON.stringify(entry.content, null, 2));
        renderEntries();
      });
    });
    container.querySelectorAll('[data-action="cancel-edit"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = b.closest('.cache-entry').dataset.fullKey;
        editing.delete(key);
        renderEntries();
      });
    });
    container.querySelectorAll('[data-action="save-edit"]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        const ta = wrap.querySelector('textarea');
        let parsed;
        try { parsed = JSON.parse(ta.value); }
        catch (err) { alert('Invalid JSON: ' + err.message); return; }
        try {
          const url = '/cache/entries/' + encodeURIComponent(entry.key) + '?namespace=' + encodeURIComponent(entry.namespace);
          const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            alert('Write failed: ' + (body.error || res.statusText));
            return;
          }
          editing.delete(key);
          await fetchEntries();
        } catch (err) {
          alert('Write failed: ' + err.message);
        }
      });
    });
    container.querySelectorAll('[data-action="delete"]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        if (!confirm('Delete cache entry "' + entry.key + '" in namespace "' + entry.namespace + '"?')) return;
        try {
          const url = '/cache/entries/' + encodeURIComponent(entry.key) + '?namespace=' + encodeURIComponent(entry.namespace);
          const res = await fetch(url, { method: 'DELETE' });
          if (!res.ok && res.status !== 204) {
            const body = await res.json().catch(() => ({}));
            alert('Delete failed: ' + (body.error || res.statusText));
            return;
          }
          editing.delete(key);
          expanded.delete(key);
          await fetchEntries();
        } catch (err) {
          alert('Delete failed: ' + err.message);
        }
      });
    });
  }

  function renderEntry(entry) {
    const fullKey = entryKey(entry);
    const isExpanded = expanded.has(fullKey);
    const isEditing = editing.has(fullKey);
    const ttlTag = entry.ttl
      ? '<span class="ttl-tag' + (entry.expired ? ' expired' : '') + '">' +
          (entry.expired ? 'expired' : 'ttl') + ' ' +
          formatTimeRemaining(entry.ttl) +
        '</span>'
      : '';

    let bodyHtml;
    if (isEditing) {
      bodyHtml =
        '<div class="cache-entry-body">' +
          (editMode
            ? '<div class="cache-entry-actions">' +
                '<button data-action="save-edit">Save</button>' +
                '<button data-action="cancel-edit">Cancel</button>' +
              '</div>'
            : '') +
          '<div class="cache-entry-file">' + escapeHtml(entry.file || '') + '</div>' +
          '<div class="cache-entry-content"><textarea spellcheck="false">' +
            escapeHtml(editing.get(fullKey)) +
          '</textarea></div>' +
        '</div>';
    } else {
      const actions = editMode
        ? '<button data-action="copy">Copy content</button>' +
          '<button data-action="edit">Edit</button>' +
          '<button data-action="delete" class="danger">Delete</button>'
        : '<button data-action="copy">Copy content</button>';
      // Wrap renderJson output in `.json-view` so the same `white-space:
      // pre-wrap` rule that lays out dashboard event-card JSON applies here —
      // otherwise the rendered output collapses onto a single line.
      bodyHtml =
        '<div class="cache-entry-body">' +
          '<div class="cache-entry-actions">' + actions + '</div>' +
          '<div class="cache-entry-file">' + escapeHtml(entry.file || '') + '</div>' +
          '<div class="cache-entry-content"><div class="json-view">' +
            renderJson(entry.content, 0, 'cache-' + fullKey) +
          '</div></div>' +
        '</div>';
    }

    return (
      '<div class="cache-entry' + (isExpanded ? ' expanded' : '') + '" data-full-key="' + escapeHtml(fullKey) + '">' +
        '<div class="cache-entry-header">' +
          '<span class="cache-entry-expand"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>' +
          '<span class="cache-entry-key">' + escapeHtml(entry.key) + '</span>' +
          '<span class="cache-entry-meta">' +
            ttlTag +
            '<span>' + formatBytes(entry.size) + '</span>' +
            '<span>' + formatRelativeTime(entry.mtime) + '</span>' +
          '</span>' +
        '</div>' +
        bodyHtml +
      '</div>'
    );
  }

  function formatBytes(n) {
    if (n == null) return '';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  }
  function formatRelativeTime(ts) {
    if (!ts) return '';
    const delta = Date.now() - ts;
    if (delta < 60_000) return 'just now';
    if (delta < 3_600_000) return Math.round(delta / 60_000) + 'm ago';
    if (delta < 86_400_000) return Math.round(delta / 3_600_000) + 'h ago';
    return Math.round(delta / 86_400_000) + 'd ago';
  }
  function formatTimeRemaining(ttlEpoch) {
    const delta = ttlEpoch - Date.now();
    if (delta < 0) return Math.abs(Math.round(delta / 60_000)) + 'm ago';
    if (delta < 3_600_000) return 'in ' + Math.round(delta / 60_000) + 'm';
    if (delta < 86_400_000) return 'in ' + Math.round(delta / 3_600_000) + 'h';
    return 'in ' + Math.round(delta / 86_400_000) + 'd';
  }

  async function refresh() {
    await fetchInfo();
    await fetchEntries();
  }

  async function changeRoot() {
    const next = prompt(
      'Switch project root.\n\nEnter the absolute path to a project that has node_modules/.cache/storybook. Leave empty to auto-discover from the server\'s cwd.',
      info.projectRoot || ''
    );
    if (next == null) return;
    try {
      const res = await fetch('/cache/project-root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectRoot: next.trim() || null }),
      });
      const data = await res.json();
      info = data;
      renderHeader();
      await fetchEntries();
    } catch (err) {
      alert('Failed to change project root: ' + err.message);
    }
  }

  async function clearAll() {
    if (!editMode) return;
    if (!confirm('Wipe ALL cache entries under ' + info.cacheRoot + '?')) return;
    try {
      const res = await fetch('/cache/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { alert('Clear failed: ' + (data.error || res.statusText)); return; }
      await fetchEntries();
    } catch (err) { alert('Clear failed: ' + err.message); }
  }

  function toggleEditMode() {
    if (window.__SNAPSHOT__) return; // snapshots are read-only by construction
    editMode = !editMode;
    try { localStorage.setItem('sbutils.eventlog.cache.editMode', editMode ? '1' : '0'); } catch (_) {}
    renderHeader();
    renderEntries();
  }

  // Live updates: when a cache:write or cache:delete event arrives via SSE,
  // refresh entries (cheap — server is local).
  function onCacheEvent(event) {
    if (state.view === 'cache') fetchEntries();
  }

  // Driven by the global Expand/Collapse-all button when the cache view
  // is active. Marks every entry expanded/collapsed and persists the
  // intent in the local `expanded` set so subsequent fetchEntries() runs
  // don't reset it.
  function setAllExpanded(shouldExpand) {
    expanded.clear();
    if (shouldExpand) {
      for (const e of entries) expanded.add(entryKey(e));
    }
    renderEntries();
  }

  // Initial fetch + bindings. We fetch BOTH info and entries up-front
  // (not just info) so the Cache tab is fully populated when the user
  // first visits it — important in HTML snapshots, where the user
  // shouldn't have to switch tabs and back to trigger entry rendering.
  document.addEventListener('DOMContentLoaded', () => {
    $('cacheRefreshBtn').addEventListener('click', refresh);
    $('cacheChangeRootBtn').addEventListener('click', changeRoot);
    $('cacheClearBtn').addEventListener('click', clearAll);
    $('cacheEditToggleRow').addEventListener('click', toggleEditMode);
    refresh();
  });

  return { refresh, onCacheEvent, setAllExpanded };
})();

// ── Load existing events on page load ────────────────
async function loadExisting() {
  try {
    const res = await fetch('/event-log');
    const existing = await res.json();
    for (const event of existing) {
      state.events.push(event);
      updateTypeCounts(event);
      updateSessionMap(event);
      updateImportMap(event);
      updateCacheMap(event);
    }
    // Always backfill from the cache: synthesize cache:write events for
    // every existing entry, and reconstruct the telemetry stream from
    // `lastEvents`. The reconstruction stops itself the moment a real
    // instrumented telemetry event arrives via SSE.
    await backfillFromCache();
    if (state.events.length > 0) rerenderAll();
    Timeline.invalidate();
    updateCounters();
  } catch (e) {
    console.error('Failed to load existing events:', e);
  }
}

loadExisting().then(() => connect());

// ── Snapshot-mode runtime ─────────────────────────────
(function setupSnapshotMode() {
  if (!window.__SNAPSHOT__) return;
  const meta = window.__SNAPSHOT_META__ || {};
  // Title (captured at snapshot build time — reassert in case something else overrode it).
  if (meta.name) {
    document.title = meta.name + ' · Snapshot · ' + (meta.eventsCount || 0) + ' events';
  }
  // Wire the "View explanation" button in the snapshot banner (only present when there's
  // an explanation baked into the snapshot).
  const explainBtn = document.getElementById('snapshotExplainBtn');
  if (explainBtn && meta.explanation) {
    explainBtn.addEventListener('click', () => {
      openExplanationModal(meta.name ? 'Explanation · ' + meta.name : 'Snapshot explanation', meta.explanation);
    });
  }
})();

// Drag-and-drop import lives in components/DropOverlay.tsx now.

// ── Expose handlers used by inline `onclick` attributes ──
// The original inline <script> declared these as globals automatically.
// As an ES module, top-level functions don't attach to window, so the
// inline `onclick="toggleCard(...)"` etc. would throw ReferenceError.
// These four are the only ones the legacy markup references inline.
if (typeof window !== 'undefined') {
  ;(window as any).toggleCard = toggleCard
  ;(window as any).toggleJson = toggleJson
  ;(window as any).copyEvent = copyEvent
  ;(window as any).copyEventCurl = copyEventCurl

  // Bridge for Preact-rendered sidebar / header components: call into the
  // legacy action functions which mutate `state` and trigger
  // re-render+mirror. As components migrate, these calls are replaced with
  // direct signal mutations and this bridge object can shrink.
  ;(window as any).__sbDashActions = {
    setFilter,
    setSession: (sid: string | null) => {
      state.activeSession = sid
      scheduleSessionRender()
      applyFiltersInPlace()
    },
    setActiveImport: (id: string | null) => {
      state.activeImport = id
      scheduleImportRender()
      applyFiltersInPlace()
    },
    setActiveCacheKey: (key: string | null) => {
      state.activeCacheKey = key
      scheduleCacheRender()
      applyFiltersInPlace()
      if (typeof Timeline !== 'undefined') Timeline.invalidate()
    },
    toggleHiddenType,
    toggleHiddenSession,
    toggleHiddenImport,
    toggleHiddenCacheKey,
    toggleCacheAllHidden,
    toggleTelemetryAllHidden,
    deleteEventsByType,
    deleteEventsBySession,
    deleteEventsByImport,
    deleteEventsByCacheKey,
    deleteAllTelemetryEvents,
    deleteAllCacheEvents,
  }
}
