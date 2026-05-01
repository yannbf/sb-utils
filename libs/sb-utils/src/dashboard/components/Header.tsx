export function Header() {
  return (
    <div class="header">
      <div class="header-title">
        <div class="logo">
          <svg width="20" height="20" viewBox="-31.5 0 319 319" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FF4785"
              d="M9.87,293.32L0.01,30.57C-0.31,21.9,6.34,14.54,15.01,14L238.49,0.03C247.32,-0.52,254.91,6.18,255.47,15.01C255.49,15.34,255.5,15.67,255.5,16V302.32C255.5,311.16,248.33,318.32,239.49,318.32C239.25,318.32,239.01,318.32,238.77,318.31L25.15,308.71C16.83,308.34,10.18,301.65,9.87,293.32Z"
            />
            <path
              fill="#FFF"
              d="M188.67,39.13L190.19,2.41L220.88,0L222.21,37.86C222.25,39.18,221.22,40.29,219.9,40.33C219.34,40.35,218.79,40.17,218.34,39.82L206.51,30.5L192.49,41.13C191.44,41.93,189.95,41.72,189.15,40.67C188.81,40.23,188.64,39.68,188.67,39.13ZM149.41,119.98C149.41,126.21,191.36,123.22,196.99,118.85C196.99,76.45,174.23,54.17,132.57,54.17C90.91,54.17,67.57,76.79,67.57,110.74C67.57,169.85,147.35,170.98,147.35,203.23C147.35,212.28,142.91,217.65,133.16,217.65C120.46,217.65,115.43,211.17,116.02,189.1C116.02,184.32,67.57,182.82,66.09,189.1C62.33,242.57,95.64,257.99,133.75,257.99C170.69,257.99,199.65,238.3,199.65,202.66C199.65,139.3,118.68,141,118.68,109.6C118.68,96.88,128.14,95.18,133.75,95.18C139.66,95.18,150.3,96.22,149.41,119.98Z"
            />
          </svg>
        </div>
        Telemetry Debugger
        <div class="status-dot" id="statusDot" title="Connected"></div>
      </div>

      <div class="view-toggle" id="viewToggle" role="tablist" aria-label="View mode">
        <button type="button" data-view="dashboard" class="active" role="tab" title="Dashboard view (V)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          Dashboard
        </button>
        <button type="button" data-view="timeline" role="tab" title="Timeline view (V)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <circle cx="7" cy="12" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="13" cy="12" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="18" cy="12" r="2.2" fill="currentColor" stroke="none" />
          </svg>
          Timeline
        </button>
        <button type="button" data-view="cache" role="tab" title="Cache view (V)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
          </svg>
          Cache
        </button>
      </div>

      <div class="controls">
        <div class="search-box">
          <span class="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input type="text" id="searchInput" placeholder="Search events..." />
          <span class="search-hint">
            <kbd class="kbd">/</kbd>
          </span>
        </div>

        <button class="btn" id="pauseBtn" title="Pause / Resume (Space)">
          <svg id="pauseSvg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <span id="pauseLabel">Pause</span>
        </button>

        <button class="btn active" id="scrollBtn" title="Auto-scroll to newest">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span>Auto-scroll</span>
        </button>

        <button class="btn" id="expandAllBtn" title="Expand / Collapse all (E)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span id="expandLabel">Expand</span>
        </button>

        <div class="separator"></div>

        <div class="export-wrap" id="exportWrap">
          <button class="btn" id="exportBtn" title="Export events" aria-haspopup="menu" aria-expanded="false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
            <svg class="chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div class="export-menu" id="exportMenu" role="menu">
            <button type="button" class="export-item" data-export="json" role="menuitem">
              <span class="export-item-title">Export as JSON</span>
              <span class="export-item-sub">Raw event data for tooling</span>
            </button>
            <button type="button" class="export-item" data-export="html" role="menuitem">
              <span class="export-item-title">Export as HTML snapshot</span>
              <span class="export-item-sub">Standalone dashboard snapshot</span>
            </button>
          </div>
        </div>

        <button class="btn danger" id="clearBtn" title="Clear all events from server and dashboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          <span>Clear all</span>
        </button>

        <span class="event-counter" id="eventCount">0 events</span>
      </div>
    </div>
  )
}
