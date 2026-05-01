export function DropOverlay() {
  return (
    <div class="drop-overlay" id="dropOverlay">
      <div class="drop-card">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <h3>Drop a JSON file to import events</h3>
        <p>Accepts arrays exported from this dashboard</p>
      </div>
    </div>
  )
}
