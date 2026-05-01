/**
 * Re-export the imperative actions module so components can `import
 * { setFilter } from '../store/actions'`. This indirection used to
 * proxy through `window.__sbDashActions`; it now just re-exports
 * from `features/actions.ts`. Kept as a stable import path for
 * components even after that file moves.
 */

export {
  setFilter,
  setSession,
  setActiveImport,
  setActiveCacheKey,
  toggleHiddenType,
  toggleHiddenSession,
  toggleHiddenImport,
  toggleHiddenCacheKey,
  toggleCacheAllHidden,
  toggleTelemetryAllHidden,
  deleteEventsByType,
  deleteEventsBySession,
  deleteEventsByImport,
  deleteEventsByCacheKey,
  deleteAllTelemetryEvents,
  deleteAllCacheEvents,
  setPaused,
  setAutoScroll,
  setExpandAll,
  setSearchQuery,
  setView,
  exportEvents,
  exportHtmlSnapshot,
  clearAll,
  wireRuntimeBridges,
} from '../features/actions'

// Backwards-compatible default export used by Sidebar / Header /
// PausedBanner — `actions().setFilter(t)` keeps working.
import * as A from '../features/actions'
export function actions() {
  return A
}
