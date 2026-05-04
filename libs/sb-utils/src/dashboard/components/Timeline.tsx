/**
 * Timeline view shell + imperative engine driver.
 *
 * Renders the static structure (toolbar, canvases, drawer, empty state)
 * as JSX. On mount, kicks off the imperative canvas / pan-zoom / drawer
 * engine in `features/timeline.ts` (which still queries elements by ID,
 * matching the IDs this component renders). The imperative API
 * (invalidate, fitAll, navigate, …) is exposed on a module signal so
 * the runtime + keyboard module can call it.
 *
 * The canvas drawing itself stays imperative — it's tightly coupled to
 * pan/zoom math, hi-DPI scaling, and rAF batching that don't translate
 * cleanly to declarative Preact. Wrapping the engine in a Preact effect
 * gives us proper mount lifecycle without rewriting it.
 */

import { signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { setupTimeline } from '../features/timeline'
import * as S from '../store/signals'
import { TimelineDrawer } from './TimelineDrawer'

export type TimelineApi = {
  init: () => void
  invalidate: () => void
  fitAll: () => void
  closeDrawer: () => void
  navigate: (dir: number) => void
  isDrawerOpen: () => boolean
}

export const timelineApi = signal<TimelineApi | null>(null)

export function Timeline() {
  useEffect(() => {
    const container = document.getElementById('eventContainer') as HTMLElement
    // The imperative engine no longer needs a real applyFiltersInPlace
    // — Preact owns dashboard-view filtering. The engine only calls
    // this from its "Clear all filters" empty-state button, where the
    // filter signals were already mutated to defaults via `state.X = ...`
    // (which the shim below routes to signals). A no-op is fine.
    const applyFiltersInPlace = () => {}
    const api = setupTimeline(stateLikeShim(), applyFiltersInPlace, container)
    timelineApi.value = api as unknown as TimelineApi
    // No teardown — the timeline component lives for the app lifetime.
  }, [])

  return (
    <div class="timeline" id="timelineView" style={{ display: 'none' }}>
      <div class="tl-toolbar">
        <span class="tl-live" id="tlLive">
          LIVE
        </span>
        <span id="tlZoomInfo">
          Zoom: <b>1.0×</b>
        </span>
        <span class="tl-sep" />
        <span id="tlRangeInfo">
          Range: <b>—</b>
        </span>
        <div class="tl-toolbar-right">
          <button type="button" class="tl-toggle" id="tlCollapseBtn" title="Collapse long periods with no events">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Collapse gaps
          </button>
          <button type="button" class="btn tl-btn" id="tlFitBtn" title="Fit all events (double-click canvas)">
            Fit all
          </button>
        </div>
      </div>

      <canvas class="tl-axis-canvas" id="tlAxisCanvas" />

      <div class="tl-main" id="tlMain">
        <canvas class="tl-content-canvas" id="tlContentCanvas" />
        <div class="tl-content-select" id="tlContentSelect" />
      </div>

      <div class="tl-minimap-wrap">
        <canvas id="tlMinimapCanvas" />
        <div class="tl-minimap-select" id="tlMinimapSelect" />
      </div>

      <div class="tl-tooltip" id="tlTooltip" />
      <button type="button" class="tl-jump" id="tlJumpBtn" title="Jump to now">
        Jump to now →
      </button>

      <TimelineDrawer />

      <div class="tl-empty" id="tlEmpty">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <circle cx="7" cy="12" r="2.2" fill="var(--accent)" />
            <circle cx="13" cy="12" r="2.2" fill="var(--accent)" />
            <circle cx="18" cy="12" r="2.2" fill="var(--accent)" />
          </svg>
        </div>
        <h3>Waiting for telemetry events</h3>
        <p>Events will appear on the timeline as they arrive</p>
      </div>
    </div>
  )
}

/**
 * Shim that gives the imperative engine the legacy `state` shape it
 * expects, with reads delegated to signals. Writes (e.g. the engine's
 * "Clear all filters" empty-state button setting `state.activeFilter
 * = 'all'`) are routed through the corresponding signal.
 */
function stateLikeShim() {
  return new Proxy({} as any, {
    get(_t, key: string) {
      const sig = (S as any)[key]
      if (sig && 'value' in sig) return sig.value
      return undefined
    },
    set(_t, key: string, value) {
      const sig = (S as any)[key]
      if (sig && 'value' in sig) sig.value = value
      return true
    },
  })
}
