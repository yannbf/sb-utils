export function PausedBanner() {
  return (
    <div class="paused-banner" id="pausedBanner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
      <span>
        Stream paused — <strong id="pausedCount">0</strong> new events buffered
      </span>
      <button id="pausedResumeBtn">Resume</button>
    </div>
  )
}
