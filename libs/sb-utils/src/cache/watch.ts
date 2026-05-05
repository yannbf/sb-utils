import fs from 'node:fs'
import path from 'node:path'
import { isCacheFile, readEntryFile } from './read'
import type { CacheChange, CacheDiff, CacheEntry, CacheLocation } from './types'

// Plain JSON is treated atomically — diffs are key-by-key on the top-level
// object. Anything that isn't a plain object is reduced to "value changed".
function diffObjects(prev: unknown, next: unknown): CacheDiff | null {
  const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v)

  if (!isObj(prev) || !isObj(next)) {
    if (prev === next) return null
    return {
      added: {},
      removed: {},
      changed: { '<root>': { from: prev, to: next } },
    }
  }

  const added: Record<string, unknown> = {}
  const removed: Record<string, unknown> = {}
  const changed: Record<string, { from: unknown; to: unknown }> = {}

  for (const k of Object.keys(next)) {
    if (!(k in prev)) {
      added[k] = next[k]
    } else if (JSON.stringify(prev[k]) !== JSON.stringify(next[k])) {
      changed[k] = { from: prev[k], to: next[k] }
    }
  }
  for (const k of Object.keys(prev)) {
    if (!(k in next)) removed[k] = prev[k]
  }

  if (
    Object.keys(added).length === 0 &&
    Object.keys(removed).length === 0 &&
    Object.keys(changed).length === 0
  ) {
    return null
  }
  return { added, removed, changed }
}

type WatchHandle = {
  close: () => void
}

/**
 * Watch the cache root for `<namespace>/storybook-*` file changes.
 *
 * Native `fs.watch({ recursive: true })` is reliable on macOS/Windows and
 * functional (with caveats) on modern Linux. We don't pull in chokidar yet
 * — if Linux reliability becomes an issue we can swap the impl behind this
 * same surface.
 *
 * `emitColdStart`: when true, emits a synthetic `create` change for every
 * file the watcher sees during cold-start seed. Boot-time attach passes
 * `false` (existing entries are pre-existing, treated as "stale" by the
 * dashboard's gate). Mid-session discovery / project-root change passes
 * `true` so the user sees the cache's contents as they're discovered —
 * the entries are genuinely new from the user's perspective.
 */
export function watchCache(
  getLocation: () => CacheLocation,
  onChange: (change: CacheChange) => void,
  options: { emitColdStart?: boolean } = {}
): WatchHandle {
  const location = getLocation()
  if (location.status !== 'found' || !location.cacheRoot) {
    return { close: () => {} }
  }
  const emitColdStart = options.emitColdStart ?? false

  // Snapshot existing content so we can compute diffs on update and surface
  // previousContent on delete. Keyed by absolute file path.
  const snapshot = new Map<string, CacheEntry>()

  const subRoot = (() => {
    const sub = location.subs.includes('default') ? 'default' : location.subs[0]
    return sub && location.version
      ? path.join(location.cacheRoot, location.version, sub)
      : location.cacheRoot
  })()

  // Cold-start seed.
  try {
    const namespaces = fs.readdirSync(subRoot)
    for (const ns of namespaces) {
      const nsPath = path.join(subRoot, ns)
      let stat: fs.Stats
      try {
        stat = fs.statSync(nsPath)
      } catch {
        continue
      }
      if (!stat.isDirectory()) continue
      let files: string[]
      try {
        files = fs.readdirSync(nsPath)
      } catch {
        continue
      }
      for (const f of files) {
        if (!isCacheFile(f)) continue
        const file = path.join(nsPath, f)
        const entry = readEntryFile(file, ns)
        if (!entry) continue
        snapshot.set(file, entry)
        if (emitColdStart) {
          onChange({
            operation: 'create',
            key: entry.key,
            namespace: entry.namespace,
            file: entry.file,
            content: entry.content,
            previousContent: null,
            diff: null,
            timestamp: entry.mtime,
          })
        }
      }
    }
  } catch {
    // Cache vanished between getLocation() and now — bail; watch will surface
    // it as a not-found state on next info call.
  }

  // Coalesce burst-y filesystem events. fs.watch fires multiple events per
  // single `writeFile` on most platforms; debounce per-file so we emit once.
  const debounceTimers = new Map<string, NodeJS.Timeout>()
  const DEBOUNCE_MS = 50

  function handleEvent(absPath: string) {
    if (!isCacheFile(path.basename(absPath))) return

    const existing = debounceTimers.get(absPath)
    if (existing) clearTimeout(existing)

    const timer = setTimeout(() => {
      debounceTimers.delete(absPath)
      processEvent(absPath)
    }, DEBOUNCE_MS)
    debounceTimers.set(absPath, timer)
  }

  function processEvent(absPath: string) {
    const namespace = path.basename(path.dirname(absPath))
    const fileExists = fs.existsSync(absPath)
    const previous = snapshot.get(absPath)

    if (!fileExists) {
      if (!previous) return // delete of file we never knew about
      snapshot.delete(absPath)
      onChange({
        operation: 'delete',
        key: previous.key,
        namespace: previous.namespace,
        file: previous.file,
        content: null,
        previousContent: previous.content,
        diff: null,
        timestamp: Date.now(),
      })
      return
    }

    const entry = readEntryFile(absPath, namespace)
    if (!entry) return // file exists but unparseable / not ours

    if (!previous) {
      snapshot.set(absPath, entry)
      onChange({
        operation: 'create',
        key: entry.key,
        namespace: entry.namespace,
        file: entry.file,
        content: entry.content,
        previousContent: null,
        diff: null,
        timestamp: entry.mtime,
      })
      return
    }

    // Skip no-op writes (mtime touched but content identical).
    if (JSON.stringify(previous.content) === JSON.stringify(entry.content)) {
      snapshot.set(absPath, entry)
      return
    }

    const diff = diffObjects(previous.content, entry.content)
    snapshot.set(absPath, entry)
    onChange({
      operation: 'update',
      key: entry.key,
      namespace: entry.namespace,
      file: entry.file,
      content: entry.content,
      previousContent: previous.content,
      diff,
      timestamp: entry.mtime,
    })
  }

  let watcher: fs.FSWatcher | null = null
  try {
    watcher = fs.watch(subRoot, { recursive: true }, (_event, filename) => {
      if (!filename) return
      handleEvent(path.join(subRoot, filename))
    })
  } catch {
    // Recursive watch unavailable (very old Node, exotic filesystems). Fall
    // back to per-namespace watches at the directory level. Less granular but
    // covers the common case.
    const watchers: fs.FSWatcher[] = []
    try {
      const namespaces = fs.readdirSync(subRoot)
      for (const ns of namespaces) {
        const nsPath = path.join(subRoot, ns)
        try {
          if (!fs.statSync(nsPath).isDirectory()) continue
          watchers.push(
            fs.watch(nsPath, (_event, filename) => {
              if (!filename) return
              handleEvent(path.join(nsPath, filename))
            })
          )
        } catch {
          // Per-namespace failure is non-fatal.
        }
      }
    } catch {}
    return {
      close: () => {
        for (const w of watchers) {
          try {
            w.close()
          } catch {}
        }
        for (const t of debounceTimers.values()) clearTimeout(t)
      },
    }
  }

  return {
    close: () => {
      try {
        watcher?.close()
      } catch {}
      for (const t of debounceTimers.values()) clearTimeout(t)
    },
  }
}
