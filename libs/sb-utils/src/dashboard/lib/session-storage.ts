/**
 * Session-aware preference storage. Uses sessionStorage so values
 * automatically clear when the tab is closed, AND tracks the server's
 * `startedAt` so prefs are reset whenever the user kills + restarts
 * the event-logger CLI (different startedAt → wipe).
 *
 * In snapshot mode the storage layer is a no-op: snapshots are shared
 * artifacts and writes here would leak the viewer's UI state. The
 * dashboard runtime gates this separately too (it checks
 * `__SNAPSHOT__` before calling the setters), but the no-op here is a
 * defensive double-check.
 *
 * Keys are namespaced under `sbutils.eventlog.` so stray reads
 * elsewhere (snapshot exports, etc.) can't collide.
 */

const NS = 'sbutils.eventlog.'
const SESSION_KEY = NS + 'session'

function isSnapshot(): boolean {
  return !!(window as any).__SNAPSHOT__
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch {
    return fallback
  }
}

/**
 * Compare the stored session id (server startedAt) against the
 * server's current startedAt. If different, wipe every key the
 * dashboard owns (everything starting with `sbutils.eventlog.`) and
 * rewrite the session key. Returns true if the storage was reset.
 *
 * Called once by the runtime as soon as /config is read; subsequent
 * reads via `readPref()` see the post-reset state.
 */
export function rotateSessionIfChanged(startedAt: number): boolean {
  if (isSnapshot()) return false
  return safe(() => {
    const prev = sessionStorage.getItem(SESSION_KEY)
    if (prev === String(startedAt)) return false
    // Different (or first run in this tab) — wipe ours.
    const toRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i)
      if (k && k.startsWith(NS)) toRemove.push(k)
    }
    for (const k of toRemove) sessionStorage.removeItem(k)
    sessionStorage.setItem(SESSION_KEY, String(startedAt))
    return true
  }, false)
}

export function readPref(name: string): string | null {
  if (isSnapshot()) return null
  return safe(() => sessionStorage.getItem(NS + name), null)
}

export function writePref(name: string, value: string): void {
  if (isSnapshot()) return
  safe(() => sessionStorage.setItem(NS + name, value), undefined)
}

export function deletePref(name: string): void {
  if (isSnapshot()) return
  safe(() => sessionStorage.removeItem(NS + name), undefined)
}
