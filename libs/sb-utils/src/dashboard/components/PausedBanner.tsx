import { paused, pausedWhileCount } from '../store/signals'
import { actions } from '../store/actions'

export function PausedBanner() {
  const visible = paused.value
  return (
    <div class={'paused-banner' + (visible ? ' visible' : '')} id="pausedBanner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
      <span>
        Stream paused — <strong id="pausedCount">{pausedWhileCount.value}</strong> new events buffered
      </span>
      <button id="pausedResumeBtn" onClick={() => actions().setPaused(false)}>
        Resume
      </button>
    </div>
  )
}
