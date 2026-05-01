/**
 * Runtime orchestrator. Wires the imperative dashboard runtime onto the
 * Preact-rendered shell:
 *
 * - SSE event stream + on-load recovery (features/event-stream).
 * - Cache reconstruction + backfill triggers (features/reconstruction).
 * - Action bridges so signal-driven actions can poke the still-imperative
 *   Timeline canvas + Cache view fetcher.
 * - Global keyboard shortcuts.
 * - Two `window` exposes for the Timeline drawer's HTML-string markup
 *   (toggleCard for the drawer's tab clicks; __sbToggleJson for the
 *   collapsible JSON tree). These go away when the drawer migrates to
 *   Preact JSX.
 *
 * No legacy `state` object lives here anymore — every component / module
 * reads and writes signals directly. The mirror layer is gone.
 */

import { setupEventStream } from './event-stream'
import { wireRuntimeBridges } from './actions'
import { setupKeyboardShortcuts } from './keyboard'
import { timelineApi } from '../components/Timeline'
import { refreshCache, refreshCacheEntries } from '../store/cache'
import { toggleJsonHtml } from '../lib/legacy-html'
import { events, paused, pausedWhileCount, expandAll, expandedCards } from '../store/signals'

// ── Browser-side action bridges for inline `onclick` markup ─────────
// The Timeline drawer still produces HTML-string event cards (with
// inline `onclick="toggleCard(this.parentElement)"` and
// `onclick="__sbToggleJson(this)"`). Until the drawer migrates to JSX
// these globals must exist.
;(window as any).toggleCard = (cardEl: HTMLElement) => {
  const idx = cardEl.dataset.index
  if (!idx) return
  const next = new Set(expandedCards.value)
  // Keep the inline onclick semantics: toggle the .expanded class
  // imperatively AND mirror to signal so any Preact-rendered cards
  // with the same index also flip.
  cardEl.classList.toggle('expanded')
  if (cardEl.classList.contains('expanded')) next.add(idx)
  else next.delete(idx)
  expandedCards.value = next
}
;(window as any).__sbToggleJson = (btn: HTMLElement) => toggleJsonHtml(btn)

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
