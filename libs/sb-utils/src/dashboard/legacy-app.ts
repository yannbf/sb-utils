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
import { setupTimeline as _setupTimeline } from './features/timeline'

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
  // Event cards rendered by components/EventList.tsx now. Just bump the
  // mirror so Preact picks up the new event.
  scheduleMirror(state);
  return;
  // eslint-disable-next-line no-unreachable
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
  // Event list rendered by components/EventList.tsx. Just bump signals.
  scheduleMirror(state);
  return;
  // eslint-disable-next-line no-unreachable
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
  // Filter visibility is rendered by components/EventList.tsx (it
  // toggles `filtered-out` on each card based on signal state). Here we
  // just bump the mirror so the filter signals propagate, and invalidate
  // the timeline canvas which still draws imperatively.
  scheduleMirror(state);
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
  // Header / PausedBanner / status dot styling is owned by Preact now.
  // The layout class toggle stays imperative because the .layout root is
  // still a JSX-shell child whose className is not driven by signals.
  layoutEl.classList.toggle('has-banner', paused);
  if (!paused) {
    state.pausedWhileCount = 0;
    rerenderAll();
  }
  scheduleMirror(state);
}

// Header buttons (Pause / Auto-scroll / Expand / Export menu / Clear / Search)
// are owned by components/Header.tsx now. The legacy click + input bindings
// have been deleted; the bridge in window.__sbDashActions still wraps the
// underlying mutations.

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
// Moved to features/timeline.ts. setupTimeline() returns the same
// imperative API ({ init, invalidate, fitAll, closeDrawer, navigate,
// isDrawerOpen, exportHtmlSnapshot }) used elsewhere in this file.
const Timeline = _setupTimeline(state, applyFiltersInPlace, container);

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


// View toggle buttons handled by components/Header.tsx now.

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

  // Hybrid renderers used by Preact components for JSON tree / cache diff
  // / event-tab content. These keep the visual output identical to the
  // legacy version; rewriting them as Preact components is a follow-up.
  ;(window as any).__sbDashRenderers = {
    renderJson,
    renderCacheDiff,
    matchesFilters,
    formatDelta,
    getPreviousEventTime,
  }

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
    // Header
    setPaused,
    setAutoScroll: (v: boolean) => {
      state.autoScroll = v
      scrollBtn.classList.toggle('active', v)
      if (v) container.scrollTop = container.scrollHeight
      scheduleMirror(state)
    },
    setExpandAll: (v: boolean) => {
      state.expandAll = v
      expandAllBtn.classList.toggle('active', v)
      if (state.view === 'cache' && typeof CacheView !== 'undefined') {
        CacheView.setAllExpanded(v)
      } else {
        container.querySelectorAll('.event-card').forEach((card: any) => {
          card.classList.toggle('expanded', v)
        })
      }
      scheduleMirror(state)
    },
    setSearchQuery: (q: string) => {
      state.searchQuery = q
      applyFiltersInPlace()
    },
    setView,
    exportEvents,
    exportHtmlSnapshot: () => Timeline.exportHtmlSnapshot(),
    clearAll: async () => {
      await fetch('/clear', { method: 'POST' })
      state.events = []
      state.typeCounts = {}
      state.sessionMap = {}
      state.importMap = {}
      state.cacheMap = {}
      state.expandedCards.clear()
      state.pausedWhileCount = 0
      state.hiddenTypes.clear()
      state.hiddenSessions.clear()
      state.hiddenImports.clear()
      state.hiddenCacheKeys.clear()
      state.cacheAllHidden = false
      state.telemetryAllHidden = false
      state.activeFilter = 'all'
      state.activeSession = null
      state.activeImport = null
      state.activeCacheKey = null
      state.realTelemetryDetected = false
      lastSessionId = null
      rerenderAll()
      applyFiltersInPlace()
      if (typeof Timeline !== 'undefined') Timeline.invalidate()
      if (typeof CacheView !== 'undefined') CacheView.refresh()
      _pushToast('Cleared all events')
    },
  }
}
