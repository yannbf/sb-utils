// @ts-nocheck
/**
 * Imperative runtime — what's left of the original inline <script> after
 * the rendering layer migrated to Preact components and the heavy
 * features (Timeline, CacheView, reconstruction) moved into focused
 * modules. Owns: the central `state` object, DOM refs, event ingestion
 * via SSE, action functions exposed via `window.__sbDashActions`,
 * Modal/snapshot wiring, and keyboard shortcuts. Side-effects only;
 * called once from main.tsx after Preact has mounted.
 *
 * The remaining steps to fully replace this file with Preact components
 * are tracked in IMPROVEMENTS.md.
 */

import { escapeHtml as _escapeHtml, formatGapDuration as _formatGapDuration } from '../lib/format'
import { lcsLineDiff as _lcsLineDiff } from '../lib/lcs-diff'
import { scheduleMirror as _scheduleMirror } from '../store/legacy-mirror'
import { pushToast as _pushToast } from '../store/signals'
import {
  openSaveModal as _openSaveModal,
  openExplanationModal as _openExplanationModal,
} from '../store/modal'
import { setupTimeline as _setupTimeline } from './timeline'
import { setupCacheView as _setupCacheView } from './cache-view'
import { setupReconstruction as _setupReconstruction } from './reconstruction'
import { exportHtmlSnapshot as _exportHtmlSnapshot } from './snapshot-export'
import { setupEventStream as _setupEventStream } from './event-stream'
import { wireRuntimeBridges as _wireRuntimeBridges } from './actions'
import { setupKeyboardShortcuts as _setupKeyboardShortcuts } from './keyboard'
import { renderJsonHtml as _renderJson, toggleJsonHtml as _toggleJson, renderCacheDiffHtml as _renderCacheDiff } from '../lib/legacy-html'
import { deepDiffLeaves as _deepDiffLeaves } from '../lib/cache-diff'
import { getColor as _getColor } from '../lib/colors'

// Re-bind to the names the original script body uses, without touching the
// (large) body that follows. This gives us the module split without
// rewriting every call site.
const escapeHtml = _escapeHtml
const lcsLineDiff = _lcsLineDiff
const formatGapDurationGlobal = _formatGapDuration
const scheduleMirror = _scheduleMirror
const renderJson = _renderJson
const toggleJson = _toggleJson
const deepDiffLeaves = _deepDiffLeaves
const renderCacheDiff = _renderCacheDiff

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

// Color mapping moved to lib/colors.ts. Imported above as _getColor.
const getColor = _getColor;
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

// ── SSE connection + on-load recovery ────────────────
// Body moved to features/event-stream.ts. We call setupEventStream
// further down (after Timeline / CacheView / reconstruction are wired)
// so its helpers can reference them.

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

// `renderJson` and `toggleJson` are imported from ./lib/json-render now.
// `escapeHtml` is imported from ./lib/format at the top of this file.

// `deepDiffLeaves`, `renderCacheDiff`, and the side-by-side diff helpers
// have moved to ./lib/cache-diff.ts. Imported aliases below.

// ── Cache diff rendering (dead — kept for line-position reference) ────
// Recursively walk previousContent vs content and yield a flat list of
// leaf-level changes with full key paths. Stops recursing into arrays
// (they're treated as primitives — reordering doesn't render well as a
// line-by-line diff). The watcher's surface diff in payload.diff is
// ignored when we have both sides of the content available, which is
// always the case for `update` operations.
// , , and the side-by-side diff helpers
// have moved to ./lib/cache-diff.ts. Imported aliases below.
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


// buildEventTabs / buildEventCard removed — EventCard.tsx renders cards now.
// The Timeline drawer keeps its own local buildEventTabs helper inline.


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
}

function rerenderAll() {
  // Event list rendered by components/EventList.tsx. Just bump signals.
  scheduleMirror(state);
  return;
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
}

function renderSessionsNow() {
  // Sessions list rendered by components/Sidebar.tsx now.
  return;
}

function renderImportsNow() {
  // Imports list rendered by components/Sidebar.tsx now.
  return;
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

// ── Reconstruction from cache ────────────────────────
// Moved to features/reconstruction.ts. setupReconstruction() returns
// { reconstructTelemetryFromCacheWrite, ingestSyntheticCacheCreate,
//   backfillFromCache, sortEventsByTime } using the helpers we own here.
// We initialize this AFTER Timeline (since the helpers reference Timeline
// via a getter to avoid a forward-reference) — see further down.
let reconstructTelemetryFromCacheWrite, ingestSyntheticCacheCreate, backfillFromCache, sortEventsByTime;

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

// `toggleJson` is imported from ./lib/json-render at the top of this file.

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
// Keyboard shortcuts moved to features/keyboard.ts. Wired below after
// Timeline is set up so the drawer's navigation hooks are reachable.

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
// ── Cache view ───────────────────────────────────────
// Moved to features/cache-view.ts. setupCacheView() returns the same
// public API ({ refresh, onCacheEvent, setAllExpanded }).
const CacheView = _setupCacheView(state, scheduleMirror);

// Reconstruction wiring — needs Timeline (declared above) so it lives
// here. The four function bindings declared earlier as `let` are
// assigned now; before this point reconstruction is a no-op (the
// closure mirror functions and the SSE handler call them only after the
// app has started fetching).
{
  const recon = _setupReconstruction(state, {
    updateTypeCounts,
    updateSessionMap,
    updateImportMap,
    updateCacheMap,
    nextReconstructIndex,
    pausedCountEl,
    renderNewEvent,
    updateCounters,
    Timeline,
    cacheKeyOf,
  });
  reconstructTelemetryFromCacheWrite = recon.reconstructTelemetryFromCacheWrite;
  ingestSyntheticCacheCreate = recon.ingestSyntheticCacheCreate;
  backfillFromCache = recon.backfillFromCache;
  sortEventsByTime = recon.sortEventsByTime;
}

// loadExisting + connect moved into features/event-stream.ts. The boot
// sequence runs from setupEventStream below.
_setupEventStream({
  state,
  updateTypeCounts,
  updateSessionMap,
  updateImportMap,
  updateCacheMap,
  rerenderAll,
  updateCounters,
  pausedCountElGet: () => pausedCountEl,
  statusDotGet: () => statusDot,
  reconstructTelemetryFromCacheWrite: (e: any) => reconstructTelemetryFromCacheWrite(e),
  backfillFromCache: () => backfillFromCache(),
  Timeline: () => Timeline,
  CacheView: () => CacheView,
});

// Snapshot-mode runtime → moved to components/SnapshotBanner.tsx +
// main.tsx (which sets body[data-snapshot] and the document title).
// Drag-and-drop import lives in components/DropOverlay.tsx.

// ── Expose handlers used by inline `onclick` attributes ──
// The original inline <script> declared these as globals automatically.
// As an ES module, top-level functions don't attach to window, so the
// inline `onclick="toggleCard(...)"` etc. would throw ReferenceError.
// These four are the only ones the legacy markup references inline.
if (typeof window !== 'undefined') {
  // Inline `onclick` handlers used by the Timeline drawer's HTML-string
  // markup (lib/legacy-html.ts). Will go away when Timeline migrates.
  ;(window as any).toggleCard = toggleCard
  ;(window as any).__sbToggleJson = toggleJson
}

// Components import action functions directly from `store/actions`
// (which re-exports from `features/actions.ts`). Wire the imperative
// runtime hooks they need (Timeline.invalidate, CacheView.refresh) so
// signal-driven actions can refresh the still-imperative views.
_wireRuntimeBridges({
  invalidateTimeline: () => Timeline && Timeline.invalidate(),
  refreshCache: () => CacheView && CacheView.refresh(),
});

_setupKeyboardShortcuts(() => Timeline || null);
