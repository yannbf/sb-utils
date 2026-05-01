export function CacheViewShell() {
  return (
    <div class="cache-view" id="cacheView" style={{ display: 'none' }}>
      <div class="cache-toolbar">
        <div class="cache-root-info" id="cacheRootInfo">
          <span class="cache-root-status" id="cacheRootStatus">Resolving…</span>
          <span class="cache-root-path" id="cacheRootPath"></span>
          <span class="cache-root-version" id="cacheRootVersion"></span>
        </div>
        <div class="cache-toolbar-actions">
          <div
            class="sidebar-toggle-row"
            id="cacheEditToggleRow"
            title="Toggle edit mode — when on, edit/delete/clear actions appear"
            style={{ padding: '4px 8px', cursor: 'pointer' }}
          >
            <div style={{ marginRight: '8px' }}>
              <span class="label">Edit mode</span>
            </div>
            <div class="toggle-switch" id="cacheEditToggleSwitch"></div>
          </div>
          <button type="button" class="btn" id="cacheRefreshBtn" title="Reload entries from disk">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
          <button type="button" class="btn" id="cacheChangeRootBtn" title="Switch to a different project root">
            Change root…
          </button>
          <button type="button" class="btn danger" id="cacheClearBtn" title="Wipe all entries" style={{ display: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Clear cache
          </button>
        </div>
      </div>

      <div class="cache-writes-banner" id="cacheWritesBanner" style={{ display: 'none' }}>
        <span>
          ⚠ Edit mode is on — saves and deletes hit the real <code>node_modules/.cache/storybook</code>.
        </span>
      </div>

      <div class="cache-empty" id="cacheEmpty" style={{ display: 'none' }}>
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
          </svg>
        </div>
        <h3 id="cacheEmptyTitle">No Storybook cache detected</h3>
        <p id="cacheEmptyMsg">
          Run <code>event-logger</code> from a Storybook project, pass <code>--project-root &lt;path&gt;</code>, or use "Change root…" above.
        </p>
      </div>

      <div class="cache-entries" id="cacheEntries"></div>
    </div>
  )
}
