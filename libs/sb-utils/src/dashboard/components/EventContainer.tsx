export function EventContainer() {
  return (
    <div class="main" id="eventContainer">
      <div class="empty-state" id="emptyState">
        <div class="empty-icon" id="emptyIcon">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h3 id="emptyTitle">Waiting for telemetry events</h3>
        <p id="emptySubtitle">Point Storybook at this collector to start capturing events</p>
        <code id="emptyCode"></code>
        <div class="filter-hint" id="emptyFilterHint" style={{ display: 'none' }}></div>
      </div>
    </div>
  )
}
