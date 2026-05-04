/**
 * Banner shown when the SSE has been stuck in CONNECTING long enough
 * that the most likely cause is the browser's per-origin HTTP/1.1
 * connection cap (~6 in Chrome). Each tab pointed at this dashboard
 * holds one slot for its SSE stream, so 6+ tabs starves the next one.
 *
 * The detector lives in features/event-stream.ts; this component just
 * reflects the `tooManyTabs` signal.
 */

import { tooManyTabs } from '../store/signals'

export function TooManyTabsBanner() {
  const visible = tooManyTabs.value
  return (
    <div
      class={'paused-banner too-many-tabs' + (visible ? ' visible' : '')}
      id="tooManyTabsBanner"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="6" width="13" height="13" rx="2" />
        <path d="M7 6V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2" />
      </svg>
      <span>
        Too many tabs open to this dashboard — close some tabs at this URL so
        the live stream can connect.
      </span>
      <button
        type="button"
        onClick={() => location.reload()}
        title="Reload after closing tabs"
      >
        Reload
      </button>
    </div>
  )
}
