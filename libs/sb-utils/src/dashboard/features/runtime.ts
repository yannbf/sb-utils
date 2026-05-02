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

// Restore prefs BEFORE the event stream boots so backfillFromCache
// (kicked off inside setupEventStream) sees the right showStaleCache /
// reconstructFromCache values. We need /config to settle first so the
// session-id rotation can wipe stale entries from a previous run; do
// it synchronously via a top-level await on a one-shot promise the
// async boot below resolves into.
async function bootRuntime() {
  if (!isSnapshot) {
    try {
      const r = await fetch('/config')
      if (r.ok) {
        const cfg = await r.json()
        if (typeof cfg?.startedAt === 'number') {
          serverStartedAt.value = cfg.startedAt
          rotateSessionIfChanged(cfg.startedAt)
        }
      }
    } catch {
      /* /config unreachable — boot with defaults */
    }
    if (readPref('reconstruct') === '1') reconstructFromCache.value = true
    if (readPref('showStaleCache') === '1') showStaleCache.value = true
  }

  // ── Live event stream (SSE + boot recovery) ───────────────────────
  setupEventStream()

  if (!isSnapshot) {
    const saved = readPref('view')
    if (saved === 'timeline' || saved === 'cache' || saved === 'dashboard') {
      void import('./actions').then(({ setView }) => setView(saved))
    }
  }
}
void bootRuntime()

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
