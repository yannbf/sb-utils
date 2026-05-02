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
import { events, paused, pausedWhileCount, expandAll } from '../store/signals'

// ── Action bridges (imperative hooks the action functions need) ─────
wireRuntimeBridges({
  invalidateTimeline: () => timelineApi.value?.invalidate(),
  refreshCache: () => void refreshCache(),
})

// ── Keyboard shortcuts ──────────────────────────────────────────────
setupKeyboardShortcuts(() => timelineApi.value)

// ── Live event stream (SSE + boot recovery) ─────────────────────────
setupEventStream()

// Restore previously selected view on reload — the action bridge sets
// localStorage on every view switch, but the initial signal value is
// 'dashboard'. Read once at boot to honor the user's last choice.
try {
  const saved = localStorage.getItem('sbutils.eventlog.view')
  if (saved === 'timeline' || saved === 'cache' || saved === 'dashboard') {
    // Lazy import to avoid the whole actions module loading before
    // the boot sequence has wired the bridges.
    void import('./actions').then(({ setView }) => setView(saved))
  }
} catch {
  /* localStorage may be unavailable in private mode */
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
