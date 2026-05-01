export function TimelineView() {
  return (
    <div class="timeline" id="timelineView" style={{ display: 'none' }}>
      <div class="tl-toolbar">
        <span class="tl-live" id="tlLive">LIVE</span>
        <span id="tlZoomInfo">
          Zoom: <b>1.0×</b>
        </span>
        <span class="tl-sep"></span>
        <span id="tlRangeInfo">
          Range: <b>—</b>
        </span>
        <div class="tl-toolbar-right">
          <button type="button" class="tl-toggle" id="tlCollapseBtn" title="Collapse long periods with no events">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Collapse gaps
          </button>
          <button type="button" class="btn tl-btn" id="tlFitBtn" title="Fit all events (double-click canvas)">
            Fit all
          </button>
        </div>
      </div>

      <canvas class="tl-axis-canvas" id="tlAxisCanvas"></canvas>

      <div class="tl-main" id="tlMain">
        <canvas class="tl-content-canvas" id="tlContentCanvas"></canvas>
      </div>

      <div class="tl-minimap-wrap">
        <canvas id="tlMinimapCanvas"></canvas>
        <div class="tl-minimap-select" id="tlMinimapSelect"></div>
      </div>

      <div class="tl-tooltip" id="tlTooltip"></div>
      <button type="button" class="tl-jump" id="tlJumpBtn" title="Jump to now">
        Jump to now →
      </button>

      <aside class="tl-drawer" id="tlDrawer">
        <div class="tl-drawer-header">
          <div class="tl-drawer-title" id="tlDrawerTitle"></div>
          <div class="tl-drawer-nav">
            <button type="button" class="tl-drawer-btn" id="tlDrawerPrev" title="Previous event in session (←)" aria-label="Previous event">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="tl-drawer-pos" id="tlDrawerPos"></span>
            <button type="button" class="tl-drawer-btn" id="tlDrawerNext" title="Next event in session (→)" aria-label="Next event">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button type="button" class="tl-drawer-close" id="tlDrawerClose" title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>
        <div class="tl-drawer-body" id="tlDrawerBody"></div>
      </aside>

      <div class="tl-empty" id="tlEmpty">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <circle cx="7" cy="12" r="2.2" fill="var(--accent)" />
            <circle cx="13" cy="12" r="2.2" fill="var(--accent)" />
            <circle cx="18" cy="12" r="2.2" fill="var(--accent)" />
          </svg>
        </div>
        <h3>Waiting for telemetry events</h3>
        <p>Events will appear on the timeline as they arrive</p>
      </div>
    </div>
  )
}
