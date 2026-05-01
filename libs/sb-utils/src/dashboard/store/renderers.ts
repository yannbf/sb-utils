/**
 * Hybrid bridge to legacy HTML-producing renderers (renderJson,
 * renderCacheDiff, matchesFilters, formatDelta, getPreviousEventTime).
 * Preact components inject the rendered HTML strings via
 * dangerouslySetInnerHTML — keeping visual output byte-identical to the
 * legacy version while the structure migrates. Replacing these with
 * native Preact components is a separate follow-up.
 */

import type { StoredEvent } from './signals'

type Renderers = {
  renderJson: (obj: unknown, depth: number, path: string) => string
  renderCacheDiff: (payload: unknown) => string
  matchesFilters: (event: StoredEvent) => boolean
  formatDelta: (ms: number) => string
  getPreviousEventTime: (event: StoredEvent) => number | null
}

const stub: Renderers = {
  renderJson: () => '',
  renderCacheDiff: () => '',
  matchesFilters: () => true,
  formatDelta: () => '',
  getPreviousEventTime: () => null,
}

export function renderers(): Renderers {
  return ((window as unknown as { __sbDashRenderers?: Renderers }).__sbDashRenderers) || stub
}
