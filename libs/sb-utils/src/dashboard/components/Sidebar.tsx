export function Sidebar() {
  return (
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-section-title">Event Types</div>
        <div id="filterList">
          <div class="filter-item active" data-filter="all">
            <div class="label-row">
              <span>All events</span>
            </div>
            <div class="item-actions">
              <button class="item-action danger trash-btn" id="eventsAllTrashBtn" title="Delete all telemetry events">
                DEL
              </button>
              <button class="item-action eye-btn" id="eventsAllEyeBtn" title="Hide all telemetry events">
                EYE
              </button>
            </div>
            <span class="count" id="countAll">0</span>
          </div>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Cache Operations</div>
        <div id="cacheList">
          <div class="filter-item active" data-cache-key="__all__">
            <div class="label-row">
              <span>All operations</span>
            </div>
            <div class="item-actions">
              <button class="item-action danger trash-btn" id="cacheAllTrashBtn" title="Delete all cache events">
                DEL
              </button>
              <button class="item-action eye-btn" id="cacheAllEyeBtn" title="Hide all cache events">
                EYE
              </button>
            </div>
            <span class="count" id="cacheAllCount">0</span>
          </div>
          <div class="sessions-empty" id="cacheListEmpty">No cache operations yet</div>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Sessions</div>
        <div id="sessionList">
          <div class="sessions-empty" id="sessionsEmpty">No sessions yet</div>
        </div>
      </div>
      <div class="sidebar-section" id="importsSection" style={{ display: 'none' }}>
        <div class="sidebar-section-title">
          <span>Imports</span>
          <span class="sidebar-section-hint" id="importsHint">
            Drop a .json file anywhere
          </span>
        </div>
        <div id="importList"></div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Shortcuts</div>
        <div class="shortcuts-list">
          <div class="shortcut-row">
            <kbd class="kbd">Space</kbd> Pause / Resume
          </div>
          <div class="shortcut-row">
            <kbd class="kbd">/</kbd> Search
          </div>
          <div class="shortcut-row">
            <kbd class="kbd">Esc</kbd> Clear search
          </div>
          <div class="shortcut-row">
            <kbd class="kbd">E</kbd> Expand / Collapse
          </div>
        </div>
      </div>
    </div>
  )
}
