// @ts-nocheck
/**
 * Timeline view — canvas-based pan/zoom + drawer. The whole feature lives
 * in this module as a self-contained imperative IIFE wrapped in
 * `setupTimeline()`. Mounts onto the existing `#timelineView` IDs that
 * the JSX shell renders (TimelineView component). Public API is
 * { init, invalidate, fitAll, closeDrawer, navigate, isDrawerOpen,
 *   exportHtmlSnapshot }.
 *
 * Native Preact rewrite is tracked in IMPROVEMENTS.md.
 */

import { escapeHtml, formatGapDuration as _formatGapDurationLib } from '../lib/format'
import { lcsLineDiff } from '../lib/lcs-diff'
import { getColor } from '../lib/colors'
import { renderJsonHtml, renderCacheDiffHtml } from '../lib/legacy-html'
import { matchesFilters as _matchesFilters } from '../lib/filters'
import { openSaveModal, openExplanationModal } from '../store/modal'
import { pushToast } from '../store/signals'

export function setupTimeline(state: any, applyFiltersInPlace: () => void, container: HTMLElement) {
  const formatGapDurationGlobal = _formatGapDurationLib
  const showToast = pushToast
  const matchesFilters = (e: any) => _matchesFilters(e)
  const renderJson = renderJsonHtml
  const renderCacheDiff = renderCacheDiffHtml
  const cacheKeyOf = (event: any): string | null => {
    if (!event || event._source !== 'cache-watch' || !event.payload) return null
    return (event.payload.namespace || '') + '/' + (event.payload.key || '')
  }
  const buildEventTabs = (event: any, idPrefix: string) => {
    const isCacheEvent = event._source === 'cache-watch'
    const sections: Array<{ key: string; label: string }> = []
    if (isCacheEvent) sections.push({ key: 'diff', label: 'Diff' })
    if (event.payload && Object.keys(event.payload).length > 0) sections.push({ key: 'payload', label: 'Payload' })
    if (event.metadata && Object.keys(event.metadata).length > 0) sections.push({ key: 'metadata', label: 'Metadata' })
    if (event.context && Object.keys(event.context).length > 0) sections.push({ key: 'context', label: 'Context' })
    sections.push({ key: 'raw', label: 'Raw' })
    const tabsHtml = sections.map((s, i) =>
      '<div class="event-tab' + (i === 0 ? ' active' : '') + '" data-tab="' + s.key + '">' + s.label + '</div>'
    ).join('')
    const contentHtml = sections.map((s, i) => {
      let inner: string
      if (s.key === 'diff') inner = renderCacheDiff(event.payload)
      else {
        const data = s.key === 'raw' ? event : (event as any)[s.key]
        inner = '<div class="json-view">' + renderJson(data, 0, idPrefix + '_' + s.key) + '</div>'
      }
      return '<div class="event-tab-content" data-tab-content="' + s.key + '"' +
        (i !== 0 ? ' style="display:none"' : '') + '>' + inner + '</div>'
    }).join('')
    function attach(containerEl: any, opts2?: any) {
      opts2 = opts2 || {}
      containerEl.querySelectorAll('.event-tab').forEach((tab: any) => {
        tab.addEventListener('click', (e: any) => {
          if (opts2.stopPropagation) e.stopPropagation()
          const tabKey = tab.dataset.tab
          containerEl.querySelectorAll('.event-tab').forEach((t: any) => t.classList.remove('active'))
          containerEl.querySelectorAll('.event-tab-content').forEach((c: any) => (c.style.display = 'none'))
          tab.classList.add('active')
          const target = containerEl.querySelector('[data-tab-content="' + tabKey + '"]')
          if (target) target.style.display = ''
        })
      })
    }
    return { tabsHtml, contentHtml, attach }
  }
  // Helper: dataRange used by exportHtmlSnapshot. The IIFE below redefines
  // it locally — use the local one for snapshot consistency.

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

  // exportHtmlSnapshot moved to features/snapshot-export.ts.

  return {
    init,
    invalidate,
    fitAll,
    closeDrawer,
    navigate: navigateDrawer,
    isDrawerOpen: () => drawerEl && drawerEl.classList.contains('open'),
  };
})();

Timeline.init();

  return Timeline
}
