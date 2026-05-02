/**
 * Runtime orchestrator — wires the dashboard runtime onto the
 * Preact-rendered shell:
 *
 * - SSE event stream + on-load recovery (features/event-stream).
 * - Cache reconstruction + backfill triggers (features/reconstruction).
 * - Action bridges so signal-driven actions can poke the still-imperative
 *   Timeline canvas (.invalidate) + cache fetcher.
 * - Global keyboard shortcuts.
 *
 * Everything else reads and writes signals directly — no legacy state,
 * no mirror layer, no window exposes for inline `onclick` markup.
 */

import { setupEventStream } from './event-stream'
import { wireRuntimeBridges } from './actions'
import { setupKeyboardShortcuts } from './keyboard'
import { timelineApi } from '../components/Timeline'
import { refreshCache, refreshCacheEntries } from '../store/cache'
import {
  events,
  paused,
  pausedWhileCount,
  expandAll,
  reconstructFromCache,
  showStaleCache,
  cacheAllHidden,
  serverStartedAt,
} from '../store/signals'
import { rotateSessionIfChanged, readPref } from '../lib/session-storage'

// ── Action bridges (imperative hooks the action functions need) ─────
wireRuntimeBridges({
  invalidateTimeline: () => timelineApi.value?.invalidate(),
  refreshCache: () => void refreshCache(),
})

// ── Keyboard shortcuts ──────────────────────────────────────────────
setupKeyboardShortcuts(() => timelineApi.value)

// User preferences live in sessionStorage, namespaced by the server's
// startedAt timestamp (see lib/session-storage.ts). A new CLI run wipes
// them automatically — the user explicitly didn't want a session to
// inherit prefs from a previous server process.
//
// Snapshots are exported HTML files, often opened on a different
// machine — letting them inherit the dev machine's preferences would
// bleed local UI state into someone else's view. The session-storage
// module no-ops in snapshot mode.
const isSnapshot = !!(window as any).__SNAPSHOT__

// Boot order:
//   1. Apply persisted prefs synchronously and start the SSE stream.
//   2. /config is fetched in parallel by backfillFromCache (it already
//      runs that fetch alongside /cache/entries). When it lands, the
//      session-id rotation runs centrally there — if startedAt
//      doesn't match the previously-stored session, sessionStorage is
//      wiped and the affected signals are reset.
//
// This avoids a head-of-line block on /config: under multi-tab load
// browsers cap HTTP/1.1 to ~6 concurrent connections per origin, and
// each open tab holds a long-lived SSE stream. A synchronous /config
// fetch before SSE used to queue boot behind the other tabs' streams,
// making refreshes hang. Now boot only needs the new tab's own SSE
// slot to open; everything else streams through naturally.
if (!isSnapshot) {
  if (readPref('reconstruct') === '1') reconstructFromCache.value = true
  if (readPref('showStaleCache') === '1') showStaleCache.value = true
  // `showCacheOperations` is the user-facing label; the internal flag
  // is its inverse (`cacheAllHidden`). Only flip when the pref is
  // explicitly set — a missing pref keeps the "hidden by default"
  // semantics from `signals.ts`.
  const showCachePref = readPref('showCacheOperations')
  if (showCachePref === '1') cacheAllHidden.value = false
  else if (showCachePref === '0') cacheAllHidden.value = true
} else {
  // Snapshot mode: restore the cache-options toggles from the values
  // baked at export time so the viewer sees what the exporter saw.
  // sessionStorage is no-op in snapshot mode (so the viewer's local
  // prefs can't bleed in), so we read straight from the baked global.
  const baked = (window as any).__SNAPSHOT_PREFS__ as
    | {
        reconstructFromCache?: boolean
        showStaleCache?: boolean
        showCacheOperations?: boolean
      }
    | undefined
  if (baked) {
    if (baked.reconstructFromCache) reconstructFromCache.value = true
    if (baked.showStaleCache) showStaleCache.value = true
    if (typeof baked.showCacheOperations === 'boolean') {
      cacheAllHidden.value = !baked.showCacheOperations
    }
  }
}
// ── Live event stream (SSE + boot recovery) ─────────────────────────
setupEventStream()

if (!isSnapshot) {
  const saved = readPref('view')
  if (saved === 'timeline' || saved === 'cache' || saved === 'dashboard') {
    void import('./actions').then(({ setView }) => setView(saved))
  }
}

// In snapshot mode we already know the live cache state (it was baked
// into __SNAPSHOT_CACHE_INFO__/__SNAPSHOT_CACHE_ENTRIES__ and the
// stubbed fetch serves it back), so load it immediately on boot rather
// than waiting for a tab switch.
if ((window as any).__SNAPSHOT__) {
  void refreshCacheEntries()
}

// Used (read-only) by E2E inspection that wants to know whether
// reconstruction is currently visible. Kept out of public exports;
// nothing else needs it.
export const __runtimeReady = { events, paused, pausedWhileCount, expandAll }
