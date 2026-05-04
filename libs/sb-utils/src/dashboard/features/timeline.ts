/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Timeline canvas engine — pan/zoom + minimap + tooltip. Mounted by the
 * <Timeline /> Preact component (components/Timeline.tsx) on first
 * render. Public API is { init, invalidate, fitAll, closeDrawer,
 * navigate, isDrawerOpen }.
 *
 * The DOM ref / canvas context locals are typed as `any` because they
 * start as `null` and are reassigned in `init()` once the JSX has
 * rendered. Strict-typing each as `HTMLCanvasElement | null` etc.
 * would force pervasive `?` checks that don't catch real bugs (the
 * engine is exercised by the E2E suite).
 */

import { effect } from '@preact/signals'
import { escapeHtml, formatGapDuration as _formatGapDurationLib } from '../lib/format'
import { formatDelta, hasErrorPayload, summaryFor } from '../lib/event-helpers'
import { writePref } from './../lib/session-storage'
import { getColor } from '../lib/colors'
import { matchesFilters as _matchesFilters } from '../lib/filters'
import { selectedTimelineEvent, collapseTimelineGaps } from '../store/signals'
import {
  computeDataRange,
  buildSegments as _buildSegments,
  chooseTickInterval as _chooseTickInterval,
  centerOnDot,
  shouldPanToFocus,
} from '../lib/timeline-math'

export function setupTimeline(state: any, applyFiltersInPlace: () => void, container: HTMLElement) {
  const formatGapDurationGlobal = _formatGapDurationLib
  const matchesFilters = (e: any) => _matchesFilters(e)

const Timeline = (function () {
  // Lane row height. Computed per render based on the widest
  // visible label across all lanes — `currentLaneH` stays in sync
  // with the longest event name times sin(45°) plus a base offset
  // for the dot row. Floored to keep short-label timelines from
  // collapsing, capped to keep one absurdly long label from
  // tripling the canvas. Set in `render()`; everything below reads
  // through it. Initial value matches the floor so first-paint
  // resize math doesn't divide by zero.
  const LANE_H_MIN = 60;
  const LANE_H_MAX = 220;
  let LANE_H = LANE_H_MIN;
  const AXIS_H = 26;
  const LABEL_COL_W = 130;
  const DOT_R = 4;
  const LIFESPAN_H = 10;
  const GAP_SEG_DISP_MS = 400;
  const MINIMAP_HANDLE_HIT = 7;
  // Rotation angle for event labels under each dot. Negative so the
  // canvas rotates counter-clockwise on screen, matching the
  // ggplot/matplotlib convention: text reads left-to-right ascending
  // at 45°, anchored at its RIGHT edge so the end of the label
  // touches the dot. The body of the label hangs down-and-to-the-
  // left, occupying its own diagonal column.
  const LABEL_ANGLE = -Math.PI / 4;
  // Two consecutive in-lane dots within this many CSS pixels collapse
  // into a single "+N" cluster puck. Picked so dots that would
  // visually touch (radius 4) get grouped, not when they merely sit
  // close enough to crowd labels — the user wants a discoverability
  // tool for overlapping dots, not aggressive aggregation.
  const CLUSTER_PX = 12;
  const CLUSTER_R = DOT_R + 4;

  const st: any = {
    viewStartDisp: 0,
    viewEndDisp: 0,
    followTail: true,
    hoveredIdx: null,
    selectedIdx: null,
    panDrag: null,
    minimapDrag: null,
    // While `autoFit` is true, every render re-runs `fitAll()`. Stays
    // true through the entire boot/backfill burst (cache writes,
    // reconstructed telemetry, late SSE arrivals) so the view always
    // shows everything from the left edge while events keep landing.
    // Goes false the moment the user pans / zooms / box-selects, so
    // their interaction isn't fought by the next ingestion. Re-armed
    // by an explicit "Fit all" click and after a JSON-file import
    // (where the user wants to see the freshly-loaded set).
    autoFit: true,
    // Mirror of the `collapseTimelineGaps` signal — initial value
    // pulled from the signal so persisted prefs / snapshot bake take
    // effect on boot. `toggleCollapseGaps` keeps both in sync.
    collapseGaps: collapseTimelineGaps.value,
    segments: null,
  };
  // Single point that interactions call to opt out of further
  // auto-fitting. Cheaper to read in handlers than re-implementing
  // the "if autoFit drop it" guard at every site.
  function disableAutoFit() {
    st.autoFit = false;
  }

  let wrapEl: any, axisCanvas: any, contentCanvas: any, minimapCanvas: any
  let minimapSelectEl: any, mainEl: any, tooltipEl: any, jumpBtn: any
  let contentSelectEl: any
  // Drawer is a Preact component (components/TimelineDrawer.tsx). The
  // engine keeps a ref only for the focusSelectedEvent geometry calc
  // (panning so the dot stays visible outside the drawer); the .open
  // class is driven by the selectedTimelineEvent signal.
  let drawerEl: any
  let zoomInfo: any, rangeInfo: any, liveInfo: any, emptyEl: any, fitBtn: any, collapseBtn: any
  let axisCtx: any, contentCtx: any, minimapCtx: any
  let dpr = 1
  let rafPending = false
  let hitMap: any[] = []
  const textWidthCache = new Map<string, number>()

  function init() {
    wrapEl = document.getElementById('timelineView');
    axisCanvas = document.getElementById('tlAxisCanvas');
    contentCanvas = document.getElementById('tlContentCanvas');
    minimapCanvas = document.getElementById('tlMinimapCanvas');
    minimapSelectEl = document.getElementById('tlMinimapSelect');
    contentSelectEl = document.getElementById('tlContentSelect');
    mainEl = document.getElementById('tlMain');
    tooltipEl = document.getElementById('tlTooltip');
    jumpBtn = document.getElementById('tlJumpBtn');
    drawerEl = document.getElementById('tlDrawer');
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

    // Browser-level focus loss is the usual cause of stuck pan/box
    // state — the user drags out of the window, releases, the
    // mouseup never reaches us. Clearing on blur restores wheel-zoom
    // responsiveness without waiting for the next click.
    window.addEventListener('blur', () => {
      if (st.panDrag) {
        st.panDrag = null;
        contentCanvas.classList.remove('grabbing');
      }
      if (st.contentBoxSelect) {
        st.contentBoxSelect = null;
        updateContentSelectOverlay();
      }
      if (st.minimapDrag) {
        st.minimapDrag = null;
        minimapSelectEl.classList.remove('active');
        minimapCanvas.style.cursor = 'grab';
      }
    });

    fitBtn.addEventListener('click', fitAll);
    jumpBtn.addEventListener('click', () => { st.followTail = true; fitAll(); });
    // Drawer prev/next/close buttons are owned by TimelineDrawer.tsx.
    collapseBtn.addEventListener('click', toggleCollapseGaps);

    // React to drawer-driven selection changes (prev/next navigation in
    // <TimelineDrawer />): pan the canvas so the new dot is visible and
    // keep st.selectedIdx in sync. Canvas-driven selections via
    // openDrawer() also flow through this — the focusSelectedEvent
    // bail-out for already-visible dots makes that a no-op.
    effect(() => {
      const sel = selectedTimelineEvent.value;
      if (state.view !== 'timeline') return;
      if (!sel) {
        if (st.selectedIdx !== null) { st.selectedIdx = null; invalidate(); }
        return;
      }
      st.selectedIdx = sel._index;
      focusSelectedEvent(sel);
      // No auto-zoom: keyboard navigation must not yank the view
      // around. When the selection lands inside a cluster, the
      // cluster swaps its representative to the selected event so
      // its label shows in place of the first event's — see the
      // "selectedInCluster" branch in drawContent. The user can
      // still click the "+N" pill explicitly to zoom in.
      invalidate();
    });
  }

  function dataRange() {
    return computeDataRange(state.events);
  }

  function visibleSessions() {
    const map = new Map();
    // Synthetic cache lane — collects every cache:* pseudo-event into a
    // single lane labeled "Cache". Sits above the per-session lanes.
    const CACHE_LANE_ID = '__cache__';
    let cacheLane: any = null;
    // Imports the user has hidden via the sidebar's Imports section.
    // The dashboard filter (`matchesFilters`) already drops them;
    // the timeline needs the same gate here so JSON imports actually
    // disappear from lanes / lifespan bars instead of just from the
    // dashboard list.
    const importHidden = (ev: any) => {
      const id = ev?._import?.id
      return id ? state.hiddenImports.has(id) : false
    }

    for (const e of state.events) {
      // Cache events feed the cache lane regardless of sessionId.
      if (e._source === 'cache-watch') {
        // "Show cache operations" toggle hides every cache dot.
        if (state.cacheAllHidden) continue;
        // Hidden cache:* types stay out of the lane entirely — they
        // don't extend the lane's lifespan bar or show as faded
        // dots. The user wants "hide" to drop the event, not just
        // dim it (the dim/focus path is for `activeFilter`).
        if (state.hiddenTypes.has(e.eventType)) continue;
        if (importHidden(e)) continue;
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
        cacheLane.events.push(e);
        continue;
      }
      if (!e.sessionId) continue;
      if (state.hiddenSessions.has(e.sessionId)) continue;
      // Same rule for telemetry: hidden types drop entirely. With
      // hiddenTypes populated to "everything but boot", the timeline
      // collapses to just boot dots and a lane bar that spans only
      // those — matching what the user wants to read off.
      if (state.hiddenTypes.has(e.eventType)) continue;
      if (importHidden(e)) continue;
      let entry = map.get(e.sessionId);
      if (!entry) {
        entry = { sid: e.sessionId, kind: 'session', first: e._receivedAt, last: e._receivedAt, events: [] };
        map.set(e.sessionId, entry);
      }
      if (e._receivedAt < entry.first) entry.first = e._receivedAt;
      if (e._receivedAt > entry.last) entry.last = e._receivedAt;
      entry.events.push(e);
    }
    const sessionLanes = Array.from(map.values()).sort((a, b) => a.first - b.first);
    return cacheLane ? [cacheLane, ...sessionLanes] : sessionLanes;
  }

  // Build piecewise time-mapping segments via the pure helper. When
  // there are no events the helper returns []; we backfill with the
  // synthetic 1s window from dataRange() so callers don't need to
  // special-case empty.
  function rebuildSegments() {
    if (state.events.length === 0) {
      const [first, last] = dataRange();
      st.segments = [{ srcStart: first, srcEnd: last, dispStart: 0, dispEnd: last - first, type: 'data' }];
      return;
    }
    const stamps: number[] = [];
    for (const e of state.events) if (e._receivedAt) stamps.push(e._receivedAt);
    const segs = _buildSegments(stamps, { collapseGaps: st.collapseGaps, gapSegDispMs: GAP_SEG_DISP_MS });
    if (segs.length === 0) {
      const [first, last] = dataRange();
      st.segments = [{ srcStart: first, srcEnd: last, dispStart: 0, dispEnd: last - first, type: 'data' }];
      return;
    }
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
    // The labels rotate -45° with right-edge anchored at the dot, so
    // they hang down-and-to-the-LEFT. The first event's label runs
    // outside the data range; without extra left-pad it would overlap
    // (or be clipped behind) the sticky lane-label column. Translate
    // the longest visible label's pixel width into display-time using
    // the live canvas width, then take cos(45°) ≈ 0.707 of it as the
    // horizontal extent. Falls back to the standard 8 % / 2 s pad
    // when we don't have a useful width yet.
    const symPad = Math.max(2000, totalD * 0.08);
    let leftPad = symPad;
    // Read the actual visible width of the timeline area, NOT
    // `contentCanvas.clientWidth` — that lags one render cycle behind
    // because resize() runs AFTER fitAll() in render(). On first paint
    // it can still be the canvas's default 300px, which would inflate
    // ms-per-px and balloon the left pad to occupy half the canvas.
    const liveW =
      (mainEl && mainEl.clientWidth) ||
      (wrapEl && wrapEl.clientWidth) ||
      contentCanvas?.clientWidth ||
      0;
    const usableW = liveW > LABEL_COL_W ? liveW - LABEL_COL_W : 0;
    if (usableW > 0 && segs && segs.length > 0 && totalD > 0) {
      const labelW = computeMaxLabelW();
      const msPerPx = (totalD + 2 * symPad) / usableW;
      const labelMs = Math.ceil(labelW * 0.707 * msPerPx);
      // 12 px breathing room between the label tip and the lane column.
      const wanted = labelMs + Math.ceil(12 * msPerPx);
      // Hard cap the label-driven pad at 25 % of the data span so a
      // huge label on a tightly-packed timeline can't push the data
      // into the right half of the canvas. The label may then clip a
      // little behind the lane column, which is the lesser evil.
      leftPad = Math.max(symPad, Math.min(wanted, totalD * 0.25));
    }
    st.viewStartDisp = segs[0].dispStart - leftPad;
    st.viewEndDisp = segs[segs.length - 1].dispEnd + symPad;
    st.followTail = true;
    // Re-arm so subsequent renders during the boot/backfill burst
    // continue to fit. Goes off again on the next user interaction.
    st.autoFit = true;
    invalidate();
  }
  // Widest visible event-type label across all lanes. Matches the
  // ggplot-style label rendering in drawContent — used here just to
  // size the left pad in `fitAll` so the first label doesn't overlap
  // the sticky lane column. Reuses `getTextWidth` (cached + correct
  // 10px monospace font matching drawContent). Returns 0 when no
  // events are visible yet or the canvas isn't ready.
  function computeMaxLabelW(): number {
    if (!contentCtx) return 0;
    const lanes = visibleSessions();
    if (lanes.length === 0) return 0;
    let max = 0;
    for (const lane of lanes) {
      for (const e of lane.events) {
        const raw = (e as any).eventType || 'unknown';
        const text = lane.kind === 'cache' ? raw.replace(/^cache:/, '') || 'cache' : raw;
        const w = getTextWidth(text);
        if (w > max) max = w;
      }
    }
    return max;
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

  function chooseTickInterval(rangeMs: number, pxPerTick: number, totalPx: number) {
    return _chooseTickInterval(rangeMs, pxPerTick, totalPx);
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

    // Per-render lane height: scales with the widest visible label
    // so long names like "ai-setup-self-healing-scoring" don't bleed
    // into the next lane. Walks every visible event once; cheap.
    LANE_H = computeLaneH();

    // Size the canvases first so `fitAll`'s pixel→ms conversion has a
    // real width to work with. Without this, the auto-fit on first
    // paint reads a stale clientWidth (often the canvas default 300px)
    // and the label-driven left pad balloons to half the viewport.
    resize();

    // Auto-fit while the user hasn't grabbed the view yet. Catches all
    // late-arriving events during boot (cache backfill + reconstructed
    // telemetry can land in waves over a couple seconds) so the
    // timeline doesn't end up with the first batch crammed at the right
    // edge while everything to its left sits empty.
    //
    // followTail is mutually exclusive with autoFit on the same render:
    // fitAll already positions the view so the latest event sits inside
    // the right pad, and followTail's "shift right edge to lastDisp +
    // 2 % of range" math would *re*-anchor the view to that tail using
    // the FULL fitted range (data + leftPad + symPad), pushing the
    // data block into the right half of the canvas. Skipping the
    // followTail step on auto-fit renders keeps the data anchored at
    // the left, which is what the user actually wants.
    if (hasEvents && st.autoFit) {
      fitAll();
    } else if (st.followTail && hasEvents) {
      const lastDisp = st.segments[st.segments.length - 1].dispEnd;
      const range = st.viewEndDisp - st.viewStartDisp;
      const pad = range * 0.02;
      st.viewEndDisp = lastDisp + pad;
      st.viewStartDisp = st.viewEndDisp - range;
    }

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
      const parts: string[] = [];
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
        // The state shim writes to signals; reset filter signals to
        // their defaults. EventList / Sidebar / Timeline all re-render.
        state.activeFilter = 'all';
        state.activeSession = null;
        state.searchQuery = '';
        state.hiddenTypes = new Set();
        state.hiddenSessions = new Set();
        const searchInputEl = document.getElementById('searchInput') as HTMLInputElement | null;
        if (searchInputEl) searchInputEl.value = '';
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
        ' <span style="color:var(--text-dim)">(+' + formatRelTime(startSrc, first, false) + ' – +' + formatRelTime(endSrc, first, false) + ')</span>';
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

    // Track tick positions so the start/end edge labels below can
    // skip drawing if a periodic tick already sits at that timestamp
    // (avoids a doubled-up label at the same x).
    const drawnXs: number[] = [];

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
        drawnXs.push(x);
      }
    }

    // Always render an edge label at the very first and very last
    // event timestamps in view, so the user can always read the
    // bookends. Periodic ticks above only land on rounded values
    // (whole seconds / minutes), so the actual data range is often
    // missing from the axis. Skip an edge if it's within ~30 px of
    // an already-drawn tick to avoid overlap.
    const [dataFirst, dataLast] = dataRange();
    const viewFirstSrc = Math.max(dataFirst, dispToSrc(st.viewStartDisp));
    const viewLastSrc = Math.min(dataLast, dispToSrc(st.viewEndDisp));
    const drawEdge = (t: number, side: 'left' | 'right') => {
      const x = timeToX(t, w);
      if (x < LABEL_COL_W || x > w - 4) return;
      for (const dx of drawnXs) if (Math.abs(dx - x) < 30) return;
      axisCtx.fillStyle = 'rgba(108,158,248,0.6)';
      axisCtx.fillRect(x, h - 5, 1, 4);
      axisCtx.fillStyle = '#cfe0ff';
      // Anchor to the inside edge so the text never spills over the
      // sticky label column (left) or the canvas right edge (right).
      axisCtx.textAlign = side === 'left' ? 'left' : 'right';
      axisCtx.fillText(formatClockTime(t, includeSeconds), x, h / 2 - 1);
      axisCtx.textAlign = 'center';
    };
    if (viewLastSrc > viewFirstSrc) {
      drawEdge(viewFirstSrc, 'left');
      drawEdge(viewLastSrc, 'right');
    }

    // Gap markers on the axis are just slim dashed caps marking the
    // edges of the collapsed range. The duration label moved into
    // the lane area (drawn in drawContent) so it doesn't fight the
    // edge timestamps for space.
    for (const seg of st.segments) {
      if (seg.type !== 'gap') continue;
      const x1 = LABEL_COL_W + ((seg.dispStart - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      const x2 = LABEL_COL_W + ((seg.dispEnd - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
      if (x2 < LABEL_COL_W || x1 > w) continue;
      const gx1 = Math.max(LABEL_COL_W, x1);
      const gx2 = Math.min(w, x2);
      if (gx2 <= gx1) continue;
      axisCtx.strokeStyle = 'rgba(251,191,36,0.55)';
      axisCtx.setLineDash([3, 3]);
      axisCtx.lineWidth = 1;
      axisCtx.beginPath();
      axisCtx.moveTo(gx1 + 0.5, 0); axisCtx.lineTo(gx1 + 0.5, h);
      axisCtx.moveTo(gx2 - 0.5, 0); axisCtx.lineTo(gx2 - 0.5, h);
      axisCtx.stroke();
      axisCtx.setLineDash([]);
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

    // Gap markers live entirely on the axis canvas now (drawAxis); the
    // content canvas no longer paints full-height bands or duration
    // labels for collapsed gaps. Keeps the lane area clean.

    contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    contentCtx.textBaseline = 'middle';

    for (let i = 0; i < sessions.length; i++) {
      const lane = sessions[i];
      const yTop = i * LANE_H;
      const yDot = yTop + 11;
      // Anchor for rotated labels: just below the dot's outer edge
      // so the rotated text starts where the eye expects it. Padding
      // beyond the selection halo (DOT_R + 8) so selected labels
      // don't kiss the ring.
      const yLabel = yDot + DOT_R + 8;

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
      const laneHits: any[] = [];
      const laneClusterHits: any[] = [];
      // Track the last rendered label's anchor x so we can suppress
      // labels for events whose dots are visually right on top of
      // the last drawn one (cluster-tight, sub-pixel spacing). Pure
      // overlap heuristic — anything wider just gets the natural
      // diagonal-column layout from LABEL_ANGLE.
      let lastLabelX = -Infinity;
      // Selected/hovered label is drawn AFTER the lane's normal labels
      // so its pill background can cover any neighbor that overlaps it
      // in source order. Captured here, painted below.
      type EmphLabel = { text: string; x: number; y: number; tw: number; isSelected: boolean }
      const emphasized: EmphLabel[] = [];

      // First pass: project visible events into pixel space, dropping
      // those that fall outside the canvas (with a small margin so
      // half-clipped dots near the edge still show).
      type Vis = { e: any; x: number };
      const visible: Vis[] = [];
      for (const e of lane.events) {
        const x = timeToX(e._receivedAt, w);
        if (x < LABEL_COL_W - 12 || x > w + 12) continue;
        visible.push({ e, x });
      }

      // Group consecutive visible dots whose centers are within
      // CLUSTER_PX of each other into a cluster. Singleton groups
      // render as normal dots; multi-element groups collapse into a
      // single "+N" puck that opens a popover when clicked.
      const groups: Vis[][] = [];
      let curGroup: Vis[] = [];
      for (const v of visible) {
        if (curGroup.length > 0 && v.x - curGroup[curGroup.length - 1].x > CLUSTER_PX) {
          groups.push(curGroup);
          curGroup = [];
        }
        curGroup.push(v);
      }
      if (curGroup.length > 0) groups.push(curGroup);

      // Per-event drawing helper — used for singletons, the
      // first-event-of-collapsed-cluster, and every member of an
      // expanded cluster. Captures the dot + label + hover/selection
      // ring code once. The `forcePos` arg lets callers paint the
      // dot at a fictional x (used by expansion to spread members
      // away from their crowded natural positions).
      const drawEventDot = (e: any, x: number, forcePos: boolean) => {
        const color = getColor(e.eventType).fg;
        const isHover = st.hoveredIdx === e._index;
        const isSelected = st.selectedIdx === e._index;
        const isError = hasErrorPayload(e);
        const matches = eventMatchesActiveFilters(e);
        const alpha = sessionAlpha * (matches ? 1 : 0.25);

        contentCtx.globalAlpha = alpha;
        contentCtx.fillStyle = color;
        contentCtx.beginPath();
        contentCtx.arc(x, yDot, isHover || isSelected ? DOT_R + 2 : DOT_R, 0, Math.PI * 2);
        contentCtx.fill();
        contentCtx.strokeStyle = isError ? '#ef4444' : '#0a0e14';
        contentCtx.lineWidth = isError ? 2 : 1.5;
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
        } else if (isError) {
          // Soft halo so the red outline reads even at low alpha (e.g.
          // a dimmed dot from `activeFilter` focus mode). Keeps
          // selected/hover rings as the primary attention signal when
          // they're present — the halo only fires when neither is.
          contentCtx.globalAlpha = Math.min(1, alpha + 0.15);
          contentCtx.strokeStyle = 'rgba(239,68,68,0.45)';
          contentCtx.lineWidth = 1.5;
          contentCtx.beginPath();
          contentCtx.arc(x, yDot, DOT_R + 3, 0, Math.PI * 2);
          contentCtx.stroke();
          contentCtx.globalAlpha = alpha;
        }

        // Cache lane drops the "cache:" prefix so labels read
        // "write" / "delete" rather than "cache:write" /
        // "cache:delete" — the lane label already says "Cache".
        const rawType = e.eventType || 'unknown';
        const text =
          lane.kind === 'cache' ? rawType.replace(/^cache:/, '') || 'cache' : rawType;
        const tw = getTextWidth(text);
        // Suppression heuristic: skip labels for events whose dots
        // sit on top of the previous one (sub-cluster-threshold
        // spacing). Prevents two labels from rendering at the same
        // anchor and creating visual mush. Force-positioned
        // (expanded) labels never get suppressed.
        const overlap = !forcePos && x - lastLabelX < 4;
        if (isSelected || isHover) {
          emphasized.push({ text, x, y: yLabel, tw, isSelected });
        } else if (!overlap) {
          contentCtx.globalAlpha = sessionAlpha * (matches ? 1 : 0.2);
          contentCtx.fillStyle = '#9ba8b9';
          drawRotatedLabel(text, x, yLabel);
        }
        if (!overlap) lastLabelX = x;

        laneHits.push({ x, y: yDot, idx: e._index, event: e });
        return tw;
      };

      // Smallest x at which a dot is fully visible (i.e. its left edge
      // clears the sticky lane label column drawn last on top of
      // everything). Used to anchor partially-clipped first dots —
      // singletons or cluster rep dots — so they don't get hidden
      // behind the column while a "+N" pill survives the clamp,
      // leaving an orphan-pill at the start of the lane.
      const minVisibleX = LABEL_COL_W + DOT_R;
      for (const grp of groups) {
        if (grp.length === 1) {
          const { e, x } = grp[0];
          drawEventDot(e, Math.max(x, minVisibleX), false);
          continue;
        }

        // ── Multi-event group: render ONE representative event as
        // a normal dot+label, plus a "+N" pill saying "this dot is
        // standing in for N other events here". The representative
        // is the currently-selected member when the selection lives
        // inside the cluster — that way arrow-key navigation just
        // swaps the visible label in place instead of yanking the
        // viewport. Otherwise it's the first member.
        const cid = lane.sid + ':' + grp[0].e._index;
        const xc = (grp[0].x + grp[grp.length - 1].x) / 2;
        const repIndex = grp.findIndex((g) => g.e._index === st.selectedIdx);
        const { e: first, x: rawFirstX } = repIndex >= 0 ? grp[repIndex] : grp[0];
        // Same clamp as singletons so the cluster's rep dot stays
        // visible. Pill placement below uses the clamped value so the
        // pill sits to the right of the (visible) dot rather than
        // being pushed past it by its own LABEL_COL_W + 4 clamp.
        const firstX = Math.max(rawFirstX, minVisibleX);
        const tw = drawEventDot(first, firstX, false);
        const more = grp.length - 1;
        const pillText = '+' + more;
        contentCtx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        const pillW = Math.max(20, contentCtx.measureText(pillText).width as number + 10);
        contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        const pillH = 14;
        // Anchor the pill just to the right of the dot — rotated
        // labels extend down-LEFT now, so this slot is empty. If the
        // dot sits at the right edge of the canvas, fall back to
        // placing the pill to the LEFT of the dot so it stays inside
        // the viewport. As a final guard, clamp within the visible
        // canvas region.
        let pillX = firstX + DOT_R + 6;
        if (pillX + pillW > w - 4) pillX = firstX - DOT_R - 6 - pillW;
        if (pillX < LABEL_COL_W + 4) pillX = LABEL_COL_W + 4;
        if (pillX + pillW > w - 4) pillX = w - pillW - 4;
        const pillY = yDot - pillH / 2;
        const containsHover = grp.some((g) => g.e._index === st.hoveredIdx);
        const containsSelected = grp.some((g) => g.e._index === st.selectedIdx);

        contentCtx.globalAlpha = sessionAlpha;
        contentCtx.fillStyle = containsSelected
          ? 'rgba(108,158,248,0.22)'
          : containsHover
            ? 'rgba(108,158,248,0.16)'
            : 'rgba(108,158,248,0.10)';
        contentCtx.strokeStyle = containsSelected
          ? 'rgba(108,158,248,0.85)'
          : 'rgba(108,158,248,0.55)';
        contentCtx.lineWidth = 1;
        // Rounded rect — small radius so it reads as a pill.
        const r = pillH / 2;
        contentCtx.beginPath();
        contentCtx.moveTo(pillX + r, pillY);
        contentCtx.lineTo(pillX + pillW - r, pillY);
        contentCtx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + r, r);
        contentCtx.lineTo(pillX + pillW, pillY + pillH - r);
        contentCtx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH, r);
        contentCtx.lineTo(pillX + r, pillY + pillH);
        contentCtx.arcTo(pillX, pillY + pillH, pillX, pillY + pillH - r, r);
        contentCtx.lineTo(pillX, pillY + r);
        contentCtx.arcTo(pillX, pillY, pillX + r, pillY, r);
        contentCtx.fill();
        contentCtx.stroke();

        contentCtx.globalAlpha = 1;
        contentCtx.fillStyle = '#cfe0ff';
        contentCtx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        contentCtx.textAlign = 'center';
        contentCtx.textBaseline = 'middle';
        contentCtx.fillText(pillText, pillX + pillW / 2, pillY + pillH / 2);
        contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        contentCtx.textBaseline = 'middle';

        // Treat the pill's left edge as where the previous label
        // anchor sat — the next event can still draw its rotated
        // label as long as its dot isn't right on top of this one.
        lastLabelX = pillX;

        laneClusterHits.push({
          x: pillX + pillW / 2,
          y: pillY + pillH / 2,
          r: Math.max(pillW / 2, pillH) + 3,
          rectLeft: pillX,
          rectRight: pillX + pillW,
          rectTop: pillY,
          rectBottom: pillY + pillH,
          cid,
          members: grp.map((g) => g.e),
          anchorX: xc,
        });
      }
      contentCtx.globalAlpha = 1;

      // Selected/hovered label pass — paints on top of any same-lane
      // labels drawn earlier in the loop so the active label always
      // wins. Both states share the same dark pill + bright text so
      // the label stays readable; the selection vs hover distinction
      // already lives on the dot itself (rings). The pill rotates
      // along with the text so it actually tracks the diagonal label.
      for (const lab of emphasized) {
        const padX = 4;
        const padY = 2;
        contentCtx.save();
        contentCtx.translate(lab.x, lab.y);
        contentCtx.rotate(LABEL_ANGLE);
        contentCtx.globalAlpha = 1;
        // Text body extends from local x=-tw to x=0 (textAlign='right'),
        // so the pill rect lives in the same range with padding.
        contentCtx.fillStyle = 'rgba(10,14,20,0.92)';
        contentCtx.fillRect(-lab.tw - padX, -7 - padY, lab.tw + padX * 2, 14 + padY);
        contentCtx.fillStyle = '#e6edf6';
        contentCtx.textAlign = 'right';
        contentCtx.textBaseline = 'middle';
        contentCtx.fillText(lab.text, 0, 0);
        contentCtx.restore();
      }

      hitMap.push({
        yTop,
        yBottom: yTop + LANE_H,
        hits: laneHits,
        clusters: laneClusterHits,
        sid: lane.sid,
      });
    }

    // Gap duration labels — only drawn when the collapsed gap is
    // wide enough on screen to fit the text without crowding its
    // dashed-cap neighbors. Below that threshold, the axis caps
    // alone indicate the gap. Plain text, no pill — keeps the lane
    // area visually quiet.
    {
      const viewRange = st.viewEndDisp - st.viewStartDisp;
      contentCtx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
      contentCtx.textAlign = 'center';
      contentCtx.textBaseline = 'middle';
      contentCtx.fillStyle = 'rgba(251,191,36,0.85)';
      for (const seg of st.segments) {
        if (seg.type !== 'gap') continue;
        const x1 = LABEL_COL_W + ((seg.dispStart - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
        const x2 = LABEL_COL_W + ((seg.dispEnd - st.viewStartDisp) / viewRange) * (w - LABEL_COL_W);
        const gx1 = Math.max(LABEL_COL_W, x1);
        const gx2 = Math.min(w, x2);
        const gapW = gx2 - gx1;
        if (gapW <= 0) continue;
        const text = formatGapDuration(seg.srcLen || 0);
        const tw = contentCtx.measureText(text).width as number;
        // Need 6 px of clearance on each side so the text doesn't
        // touch the dashed caps on the axis above.
        if (tw + 12 > gapW) continue;
        contentCtx.fillText(text, (gx1 + gx2) / 2, 12);
      }
      contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
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
      contentCtx.fillText(laneLabel, 12, yTop + LANE_H / 2 - 14);
      contentCtx.fillStyle = dimSession ? 'rgba(95,112,133,0.6)' : '#5f7085';
      contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      const subLabel = lane.kind === 'cache'
        ? lane.events.length + ' op' + (lane.events.length !== 1 ? 's' : '')
        : lane.events.length + ' event' + (lane.events.length !== 1 ? 's' : '');
      contentCtx.fillText(subLabel, 12, yTop + LANE_H / 2);
      // Visible duration (first → last across the events that pass
      // the current hidden-types filter — see visibleSessions).
      // Surfaces "how long is the run I'm looking at?" right next to
      // the count, without the user having to reach for the axis.
      if (lane.events.length >= 2) {
        const span = lane.last - lane.first;
        if (span > 0) {
          contentCtx.fillText(formatGapDuration(span), 12, yTop + LANE_H / 2 + 14);
        }
      }
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
        if (state.cacheAllHidden) continue;
      } else {
        if (state.telemetryAllHidden) continue;
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
  // Lane height needed to fit the widest visible event label, given
  // labels render rotated -45° below each dot. The diagonal vertical
  // extent of a label is `width * sin(45°) ≈ width * 0.707`; add a
  // base offset for the dot row + small padding. Floored / capped to
  // keep the timeline from collapsing on short-label datasets and
  // from blowing up on absurdly long ones.
  function computeLaneH(): number {
    const sessions = visibleSessions();
    if (sessions.length === 0) return LANE_H_MIN;
    let maxLabelW = 0;
    for (const lane of sessions) {
      for (const e of lane.events) {
        const raw = e.eventType || 'unknown';
        const text =
          lane.kind === 'cache' ? raw.replace(/^cache:/, '') || 'cache' : raw;
        const w = getTextWidth(text);
        if (w > maxLabelW) maxLabelW = w;
      }
    }
    // 24px reserves the dot row (yDot=11 + DOT_R+8 anchor offset);
    // 12px is breathing room before the next lane's dot row.
    const needed = 24 + maxLabelW * 0.7071 + 12;
    return Math.max(LANE_H_MIN, Math.min(LANE_H_MAX, Math.round(needed)));
  }

  // Draw an event label rotated by LABEL_ANGLE, anchored at (x, y).
  // textAlign='right' so the END of the text sits at the anchor —
  // the body hangs down-and-to-the-left into its own diagonal lane.
  // Caller is responsible for setting fillStyle + globalAlpha; this
  // helper only handles the save/translate/rotate/baseline plumbing
  // so per-event call sites stay readable.
  function drawRotatedLabel(text: string, x: number, y: number): void {
    contentCtx.save();
    contentCtx.translate(x, y);
    contentCtx.rotate(LABEL_ANGLE);
    contentCtx.textAlign = 'right';
    contentCtx.textBaseline = 'middle';
    contentCtx.fillText(text, 0, 0);
    contentCtx.restore();
  }

  function getTextWidth(text: string): number {
    const cached = textWidthCache.get(text);
    if (cached != null) return cached;
    contentCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    const w = contentCtx.measureText(text).width as number;
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

  function findEventAt(clientX: number, clientY: number): any {
    const rect = contentCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < LABEL_COL_W) return null;
    for (const lane of hitMap) {
      if (y < lane.yTop || y > lane.yBottom) continue;
      let best: any = null;
      let bestD = 10;
      for (const h of lane.hits) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d < bestD) { bestD = d; best = h; }
      }
      return best;
    }
    return null;
  }

  // Cluster pill / collapse-puck hit testing. Pills are rectangular,
  // the "−" collapse glyph is circular — accept either. Checked
  // before findEventAt so a click on the pill wins over the underlying
  // dot it sits next to.
  function findClusterAt(clientX: number, clientY: number): any {
    const rect = contentCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < LABEL_COL_W) return null;
    for (const lane of hitMap) {
      if (y < lane.yTop || y > lane.yBottom) continue;
      const clusters = lane.clusters || [];
      for (const c of clusters) {
        if (
          c.rectLeft != null &&
          x >= c.rectLeft &&
          x <= c.rectRight &&
          y >= c.rectTop &&
          y <= c.rectBottom
        ) {
          return c;
        }
        if (Math.hypot(c.x - x, c.y - y) <= c.r) return c;
      }
      return null;
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
    if (st.contentBoxSelect) {
      const rect = contentCanvas.getBoundingClientRect();
      st.contentBoxSelect.currentX = Math.max(LABEL_COL_W, Math.min(rect.width, e.clientX - rect.left));
      updateContentSelectOverlay();
      return;
    }
    if (st.panDrag) {
      const dx = e.clientX - st.panDrag.x;
      const dy = e.clientY - st.panDrag.y;
      const w = contentCanvas.clientWidth;
      const dispPerPx = (st.panDrag.end - st.panDrag.start) / (w - LABEL_COL_W);
      const delta = -dx * dispPerPx;
      st.viewStartDisp = st.panDrag.start + delta;
      st.viewEndDisp = st.panDrag.end + delta;
      st.followTail = false;
      // Vertical drag → scroll the lanes container in the same
      // grab-and-pull direction the user expects (drag down with the
      // cursor brings content from the top into view, i.e. scrollTop
      // decreases). Bounded by the browser to [0, scrollHeight - clientHeight],
      // so a no-op when there's nothing to scroll. We always update
      // scrollTop — any horizontal-only intent still gets a free
      // vertical correction toward the user's start position.
      if (mainEl) {
        mainEl.scrollTop = st.panDrag.scrollTop - dy;
      }
      invalidate();
      return;
    }
    // Shift held while hovering the canvas → show crosshair to hint
    // box-select. Reverts to default in onContentLeave.
    if (e.shiftKey) {
      const rect = contentCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      contentCanvas.style.cursor = x >= LABEL_COL_W ? 'crosshair' : '';
    } else {
      contentCanvas.style.cursor = '';
    }
    // Cluster pills take hover priority over the dots they sit next
    // to — otherwise the user would never see the "click to expand"
    // tooltip while their cursor is over the pill region.
    const cluster = findClusterAt(e.clientX, e.clientY);
    const hit = cluster ? null : findEventAt(e.clientX, e.clientY);
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    contentCanvas.classList.toggle('hovering', !!cluster || !!hit || !!lane);
    if (cluster) {
      if (st.hoveredIdx !== null) { st.hoveredIdx = null; invalidate(); }
      showClusterTooltip(cluster, e.clientX, e.clientY);
    } else if (hit) {
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
    const rect = contentCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Shift+drag inside the content area starts a time-range
    // box-select. Releasing with a non-trivial width zooms the main
    // view to that range — same UX as shift+drag on the minimap.
    if (e.shiftKey && x >= LABEL_COL_W) {
      e.preventDefault();
      st.contentBoxSelect = { startX: x, currentX: x };
      updateContentSelectOverlay();
      contentCanvas.style.cursor = 'crosshair';
      disableAutoFit();
      return;
    }
    const cluster = findClusterAt(e.clientX, e.clientY);
    const hit = cluster ? null : findEventAt(e.clientX, e.clientY);
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    if (cluster || hit || lane) return;
    // Capture both axes' starting state so the same drag can pan the
    // time view horizontally AND scroll lanes vertically — useful when
    // there are more sessions than fit in the .tl-main viewport.
    st.panDrag = {
      x: e.clientX,
      y: e.clientY,
      start: st.viewStartDisp,
      end: st.viewEndDisp,
      scrollTop: mainEl ? mainEl.scrollTop : 0,
      moved: false,
    };
    contentCanvas.classList.add('grabbing');
    disableAutoFit();
  }
  function onContentClick(e) {
    // Cluster pills zoom into the cluster's time range; the dots
    // they sit next to are checked second so a click on the pill
    // always wins.
    const cluster = findClusterAt(e.clientX, e.clientY);
    if (cluster) { zoomIntoCluster(cluster); return; }
    const hit = findEventAt(e.clientX, e.clientY);
    if (hit) { openDrawer(hit.event); return; }
    const lane = findLaneLabelAt(e.clientX, e.clientY);
    if (lane) {
      // Cache lane has no session-filter equivalent — clicking its label
      // is a no-op. The dedicated Cache view tab in the header is the
      // only entry point into cache view.
      if (lane.sid === '__cache__') return;
      state.activeSession = state.activeSession === lane.sid ? null : lane.sid;
      applyFiltersInPlace();
      invalidate();
    }
  }
  function onContentWheel(e) {
    e.preventDefault();
    disableAutoFit();
    // Clear any drag state that lingered past a missed mouseup
    // (released outside the window, focus lost, etc.). Without this
    // the next pan-drag mousemove would keep overwriting whatever
    // the wheel handler sets, making the wheel feel "stuck" until
    // the user clicks anywhere to flush the drag. Reproduces if you
    // pan across the canvas, drag the cursor off the browser window,
    // and release out there.
    if (st.panDrag) {
      st.panDrag = null;
      contentCanvas.classList.remove('grabbing');
    }
    if (st.contentBoxSelect) {
      st.contentBoxSelect = null;
      updateContentSelectOverlay();
    }
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
    if (st.contentBoxSelect) {
      const sel = st.contentBoxSelect;
      const w = contentCanvas.clientWidth;
      const x1 = Math.max(LABEL_COL_W, Math.min(sel.startX, sel.currentX));
      const x2 = Math.min(w, Math.max(sel.startX, sel.currentX));
      if (x2 - x1 >= 6) {
        const startDisp = xToDisp(x1, w);
        const endDisp = xToDisp(x2, w);
        st.viewStartDisp = startDisp;
        st.viewEndDisp = endDisp;
        st.followTail = false;
        invalidate();
      }
      st.contentBoxSelect = null;
      updateContentSelectOverlay();
      contentCanvas.style.cursor = '';
    }
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
        } else if (d.hadSeekIntent) {
          // No real drag — fall back to "center the view on this
          // click" so a plain click in the unselected zone keeps
          // its old jump-to-here behavior.
          const [first, last] = dataRange();
          const range = Math.max(1, last - first);
          const centerSrc = first + (d.startX / d.rectWidth) * range;
          const viewStartSrc = dispToSrc(st.viewStartDisp);
          const viewEndSrc = dispToSrc(st.viewEndDisp);
          const vrSrc = viewEndSrc - viewStartSrc;
          st.viewStartDisp = srcToDisp(centerSrc - vrSrc / 2);
          st.viewEndDisp = srcToDisp(centerSrc + vrSrc / 2);
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
    disableAutoFit();
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
      // Click in the unselected area starts a box-select drag —
      // same affordance as shift+drag, just without the shift. If
      // the user releases without moving (no actual drag), the up
      // handler falls back to the legacy "center the view on this
      // click" behavior. `hadSeekIntent` flags that fallback so a
      // shift+drag with zero width DOESN'T jump the view.
      e.preventDefault();
      st.minimapDrag = {
        mode: 'box-select',
        startX: x,
        currentX: x,
        rectWidth: w,
        hadSeekIntent: true,
      };
      updateMinimapSelectOverlay();
      minimapCanvas.style.cursor = 'crosshair';
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

  function updateContentSelectOverlay() {
    const sel = st.contentBoxSelect;
    if (!sel) {
      if (contentSelectEl) contentSelectEl.classList.remove('active');
      return;
    }
    const x1 = Math.min(sel.startX, sel.currentX);
    const x2 = Math.max(sel.startX, sel.currentX);
    const top = mainEl ? mainEl.scrollTop : 0;
    contentSelectEl.style.left = x1 + 'px';
    contentSelectEl.style.width = Math.max(0, x2 - x1) + 'px';
    contentSelectEl.style.top = top + 'px';
    contentSelectEl.style.height = (mainEl ? mainEl.clientHeight : contentCanvas.clientHeight) + 'px';
    contentSelectEl.classList.add('active');
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
    disableAutoFit();
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
    // Visible-only index (#N) so the tooltip matches the dashboard
    // cards and the drawer header. Synthetic events use a 1e9-range
    // _index that would render as "#1000000007"; the displayIdx walk
    // matches whatever's currently passing the sidebar filters.
    const displayIdx = visibleDisplayIdx(event);
    // Cache-lane labels strip the "cache:" prefix so the badge reads
    // "write" / "delete" instead of "cache:write" / "cache:delete" —
    // the lane label already says "Cache".
    const isCache = event._source === 'cache-watch';
    const badgeText = isCache
      ? (event.eventType || '').replace(/^cache:/, '') || 'cache'
      : event.eventType || 'unknown';
    // Source-time delta from the previous event in the same lane that
    // currently passes the sidebar filters — gives a quick sense of
    // "how long since the last visible thing on this row". Formatted
    // in min/s/ms units (e.g. "+340ms", "+2.4s", "+1m23s") to match
    // the +Δ string on the dashboard cards.
    const prev = previousVisibleSibling(event);
    const sincePrev =
      prev && prev._receivedAt && event._receivedAt != null
        ? formatDelta(event._receivedAt - prev._receivedAt)
        : '—';
    // Delta from the dot the user has clicked on
    // (selectedTimelineEvent), shown only when the hovered dot is in
    // the same lane — otherwise the comparison is meaningless. Same
    // lane rule as previousVisibleSibling: cache-watch grouped
    // together, telemetry grouped by sessionId. The label flips
    // between "since selected" (hovered is after) and "until selected"
    // (hovered is before) so the direction reads naturally without a
    // sign character to parse.
    const sel = selectedTimelineEvent.value as any;
    const sameLane =
      sel && sel !== event
        ? isCache
          ? sel._source === 'cache-watch'
          : sel.sessionId === event.sessionId
        : false;
    const selectedDeltaHtml =
      sameLane && sel._receivedAt != null && event._receivedAt != null
        ? (() => {
            const dt = event._receivedAt - sel._receivedAt;
            const label = dt >= 0 ? 'since selected' : 'until selected';
            const val = formatDelta(Math.abs(dt));
            return '<div class="tt-row"><span>' + label + '</span><span class="val">' + val + '</span></div>';
          })()
        : '';
    // Short payload summary (e.g. `boot` → "dev", `cache:write` →
    // "namespace/key"). Same string the dashboard cards show next
    // to the badge — keeps the two views consistent.
    const summary = summaryFor(event);
    const summaryHtml = summary
      ? '<span class="tt-summary">' + escapeHtml(summary) + '</span>'
      : '';
    tooltipEl.innerHTML =
      '<div class="tt-head">' +
      '<span class="tt-idx">#' + (displayIdx || event._index) + '</span>' +
      '<div class="tt-badge" style="background:' + color.bg + '; color:' + color.fg + '">' + escapeHtml(badgeText) + '</div>' +
      summaryHtml +
      '</div>' +
      '<div class="tt-row"><span>time</span><span class="val">' + formatClockTime(event._receivedAt, true) + '</span></div>' +
      '<div class="tt-row"><span>elapsed</span><span class="val">+' + formatRelTime(event._receivedAt, first, false) + '</span></div>' +
      '<div class="tt-row"><span>since prev</span><span class="val">' + sincePrev + '</span></div>' +
      selectedDeltaHtml +
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

  // Tooltip that lists the cluster's hidden events. Hover the "+N"
  // pill to peek; click to actually expand the cluster on the canvas.
  // Caps at 10 rows so a 60-event burst doesn't spawn a tooltip
  // taller than the viewport.
  function showClusterTooltip(cluster: any, clientX: number, clientY: number) {
    const ms = cluster.members;
    const MAX_ROWS = 10;
    const shown = ms.slice(0, MAX_ROWS);
    const overflow = ms.length - shown.length;
    const rows = shown
      .map((ev: any) => {
        const isCache = ev._source === 'cache-watch';
        const name = isCache
          ? (ev.eventType || '').replace(/^cache:/, '') || 'cache'
          : ev.eventType || 'unknown';
        const c = getColor(ev.eventType || 'unknown');
        return (
          '<div class="tt-cluster-row">' +
          '<span class="tt-cluster-dot" style="background:' + c.fg + '"></span>' +
          '<span class="tt-cluster-name">' + escapeHtml(name) + '</span>' +
          '<span class="tt-cluster-time">' + formatClockTime(ev._receivedAt, true) + '</span>' +
          '</div>'
        );
      })
      .join('');
    const overflowRow =
      overflow > 0
        ? '<div class="tt-cluster-row tt-cluster-more">+' + overflow + ' more</div>'
        : '';
    tooltipEl.innerHTML =
      '<div class="tt-head">' +
      '<span class="tt-idx">+' + ms.length + '</span>' +
      '<div class="tt-badge" style="background:#1a232f; color:#cfe0ff">cluster</div>' +
      '</div>' +
      '<div class="tt-cluster-list">' + rows + overflowRow + '</div>' +
      '<div class="tt-hint">click pill to zoom in →</div>';
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

  // Position of `event` among the events that currently pass the
  // sidebar filters (1-based). Mirrors the EventList computed pass so
  // the timeline tooltip's #N matches the card numbering.
  function visibleDisplayIdx(event) {
    let n = 0;
    for (const e of state.events) {
      if (!matchesFilters(e)) continue;
      n++;
      if (e === event) return n;
    }
    return 0;
  }

  // Closest earlier event in the same lane that's currently visible —
  // session for telemetry, cache-watch for cache pseudo-events. Used
  // by the tooltip to surface "since prev".
  function previousVisibleSibling(event: any): any {
    if (!event || !event._receivedAt) return null;
    const isCache = event._source === 'cache-watch';
    let best: any = null;
    for (const e of state.events) {
      if (e === event) continue;
      if (!matchesFilters(e)) continue;
      if (isCache) {
        if (e._source !== 'cache-watch') continue;
      } else {
        if (e.sessionId !== event.sessionId) continue;
      }
      if (!e._receivedAt || e._receivedAt >= event._receivedAt) continue;
      if (!best || e._receivedAt > best._receivedAt) best = e;
    }
    return best;
  }

  // Returns the navigable list for a given drawer event — session
  // events for telemetry, all cache events (linear by time) for cache
  // pseudo-events. Honors the active sidebar filters so prev/next
  // (from arrow keys via setupKeyboardShortcuts) skips dots the user
  // has hidden. The selected event itself stays in the list so its
  // position lookup is stable.
  function navigableEventsFor(event) {
    if (!event) return [];
    const byTime = (a, b) => (a._receivedAt || 0) - (b._receivedAt || 0);
    const keep = (e) => e === event || matchesFilters(e);
    if (event._source === 'cache-watch') {
      return state.events.filter(e => e._source === 'cache-watch' && keep(e)).sort(byTime);
    }
    if (event.sessionId) {
      return state.events.filter(e => e.sessionId === event.sessionId && keep(e)).sort(byTime);
    }
    return [];
  }

  function openDrawer(event) {
    // Drawer rendering is owned by components/TimelineDrawer.tsx —
    // we just publish the selection. The drawer reads
    // selectedTimelineEvent and renders its content reactively.
    // Pan + cluster auto-expand are handled by the effect above so
    // canvas-clicks and drawer-driven selection behave identically.
    selectedTimelineEvent.value = event;
  }

  // Zoom the view so the cluster's source-time range fills most of
  // the canvas. The dots naturally separate at the new zoom and the
  // labels become readable. Triggered only by an explicit click on
  // the "+N" pill — keyboard nav never auto-zooms because the view
  // jump is too disorienting.
  function zoomIntoCluster(cluster: any): void {
    const ms = cluster.members;
    const tFirst = ms[0]._receivedAt;
    const tLast = ms[ms.length - 1]._receivedAt;
    if (tFirst == null || tLast == null) return;
    const span = Math.max(1, tLast - tFirst);
    // Pad ~25 % of the cluster's source span on each side so the
    // user sees a hint of context without losing the focus.
    const pad = Math.max(span * 0.25, 50);
    const startSrc = tFirst - pad;
    const endSrc = tLast + pad;
    st.viewStartDisp = srcToDisp(startSrc);
    st.viewEndDisp = srcToDisp(endSrc);
    st.followTail = false;
    invalidate();
  }

  // Pan (and if needed, zoom out) so the selected dot is visible in the portion
  // of the canvas not covered by the drawer.
  function focusSelectedEvent(event: any) {
    if (!event) return;
    const canvasW = contentCanvas.clientWidth || 0;
    if (canvasW <= 0) return;
    // The drawer is the only thing on the right edge that can occlude
    // the canvas. Read its actual width when open so the centering math
    // accounts for it.
    const drawerW =
      drawerEl && drawerEl.classList.contains('open') ? drawerEl.clientWidth || 0 : 0;
    const dotDisp = srcToDisp(event._receivedAt);
    const viewRange = st.viewEndDisp - st.viewStartDisp;
    const contentW = canvasW - LABEL_COL_W;
    const dotX = LABEL_COL_W + ((dotDisp - st.viewStartDisp) / viewRange) * contentW;
    if (!shouldPanToFocus({ dotX, canvasW, drawerW, labelColW: LABEL_COL_W })) return;
    const next = centerOnDot({
      dotDisp,
      viewStartDisp: st.viewStartDisp,
      viewEndDisp: st.viewEndDisp,
      canvasW,
      drawerW,
      labelColW: LABEL_COL_W,
    });
    if (!next) return;
    st.viewStartDisp = next.viewStartDisp;
    st.viewEndDisp = next.viewEndDisp;
    st.followTail = false;
    // The user explicitly navigated to (or clicked on) a dot — the
    // pan we just computed must NOT be overwritten by the next
    // render's auto-fit. Without this, opening the drawer on a fresh
    // boot (when autoFit is still on) makes keyboard prev/next pan
    // briefly and snap back to the fitted view.
    disableAutoFit();
  }

  // Drawer prev/next/close UX is owned by TimelineDrawer.tsx (it reads
  // selectedTimelineEvent and writes to it for navigate / close). The
  // canvas only needs to react to selection changes — see the effect
  // in components/Timeline.tsx that re-runs invalidate when the
  // signal changes.
  function navigateDrawer(dir) {
    const cur = selectedTimelineEvent.value;
    if (!cur) return;
    const list = navigableEventsFor(cur);
    const pos = list.findIndex(e => e._index === cur._index);
    const target = list[pos + dir];
    if (target) openDrawer(target);
  }

  function closeDrawer() {
    selectedTimelineEvent.value = null;
    st.selectedIdx = null;
    invalidate();
  }

  function toggleCollapseGaps() {
    st.collapseGaps = !st.collapseGaps;
    // Keep the signal in sync so persistence + snapshot bake see the
    // new value. The signal is also what the engine reads on boot.
    collapseTimelineGaps.value = st.collapseGaps;
    // sessionStorage is namespaced by server startedAt and no-ops in
    // snapshot mode (see lib/session-storage.ts), so this is safe.
    writePref('collapseTimelineGaps', st.collapseGaps ? '1' : '0');
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
    isDrawerOpen: () => selectedTimelineEvent.value !== null,
  };
})();

Timeline.init();

  return Timeline
}
