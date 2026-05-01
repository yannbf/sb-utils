/**
 * Thin façade around the legacy action functions exposed on
 * `window.__sbDashActions`. Components import these named functions
 * instead of touching window directly so call sites stay readable and the
 * eventual replacement (direct signal mutations from Preact) is a single
 * file rewrite.
 */

type Actions = {
  setFilter: (type: string) => void
  setSession: (sid: string | null) => void
  setActiveImport: (id: string | null) => void
  setActiveCacheKey: (key: string | null) => void
  toggleHiddenType: (type: string) => void
  toggleHiddenSession: (sid: string) => void
  toggleHiddenImport: (id: string) => void
  toggleHiddenCacheKey: (key: string) => void
  toggleCacheAllHidden: () => void
  toggleTelemetryAllHidden: () => void
  deleteEventsByType: (type: string) => void
  deleteEventsBySession: (sid: string) => void
  deleteEventsByImport: (id: string) => void
  deleteEventsByCacheKey: (key: string) => void
  deleteAllTelemetryEvents: () => void
  deleteAllCacheEvents: () => void
}

const noop = () => {}
const stub: Actions = {
  setFilter: noop,
  setSession: noop,
  setActiveImport: noop,
  setActiveCacheKey: noop,
  toggleHiddenType: noop,
  toggleHiddenSession: noop,
  toggleHiddenImport: noop,
  toggleHiddenCacheKey: noop,
  toggleCacheAllHidden: noop,
  toggleTelemetryAllHidden: noop,
  deleteEventsByType: noop,
  deleteEventsBySession: noop,
  deleteEventsByImport: noop,
  deleteEventsByCacheKey: noop,
  deleteAllTelemetryEvents: noop,
  deleteAllCacheEvents: noop,
}

export function actions(): Actions {
  return ((window as unknown as { __sbDashActions?: Actions }).__sbDashActions) || stub
}
