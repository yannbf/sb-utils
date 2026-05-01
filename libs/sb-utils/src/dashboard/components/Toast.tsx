/**
 * Toast queue rendered from the `toasts` signal. Items auto-expire after
 * `ttlMs` (default 2s). Mounted once at app root; legacy code calls
 * `showToast(msg)` which is now a thin wrapper around `pushToast`.
 */

import { toasts } from '../store/signals'

export function ToastContainer() {
  const items = toasts.value
  return (
    <>
      {items.map((t) => (
        <div key={t.id} class="toast">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t.text}
        </div>
      ))}
    </>
  )
}
