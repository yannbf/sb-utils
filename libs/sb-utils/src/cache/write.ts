import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describeCacheLayout, findCacheRoot } from './discover'
import { getActiveSubRoot } from './read'
import type { CacheEntry, CacheLocation } from './types'

// Storybook's FileSystemCache hashes filenames as:
//   storybook-<sha256(<key>)>
// (We confirmed empirically: sha256('session') matches the on-disk filename.)
function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

function fileNameFor(key: string): string {
  return `storybook-${hashKey(key)}`
}

export type WriteOptions = {
  namespace?: string
  // When the cache directory tree doesn't exist yet, refuse unless the caller
  // explicitly opts in. Prevents accidentally creating .cache/storybook on
  // projects that have no Storybook installed.
  createIfMissing?: boolean
  // Required when createIfMissing is true and there's no existing version dir
  // — we don't invent a version partition silently.
  version?: string
  // Absolute epoch ms when the entry should be considered expired. Matches
  // FileSystemCache's stored `ttl` field. Omit to write a non-expiring entry.
  ttl?: number
}

export type WriteResult = {
  entry: CacheEntry
  created: boolean
}

/**
 * Write `<key, content>` into the cache, mimicking Storybook's FileSystemCache
 * envelope format. Returns the resulting CacheEntry.
 *
 * Throws on:
 *   - cache not found and createIfMissing is false
 *   - createIfMissing without a usable version
 *   - filesystem errors
 */
export function writeEntry(
  location: CacheLocation,
  key: string,
  content: unknown,
  opts: WriteOptions = {}
): WriteResult {
  const namespace = opts.namespace ?? 'dev-server'

  let subRoot = getActiveSubRoot(location)

  if (!subRoot) {
    if (!opts.createIfMissing) {
      const reason =
        location.status === 'not-found'
          ? 'no Storybook cache directory was detected'
          : `cache layout is ${location.status}`
      throw new Error(
        `Refusing to write to cache: ${reason}. Pass createIfMissing=true (and a version) to force.`
      )
    }
    if (!location.projectRoot) {
      throw new Error('Cannot create a cache without a known projectRoot')
    }
    const version = opts.version ?? location.version
    if (!version) {
      throw new Error(
        'Cannot create a missing cache without an explicit version (the cache dir is partitioned per Storybook version)'
      )
    }
    const cacheRoot =
      location.cacheRoot ?? path.join(location.projectRoot, 'node_modules', '.cache', 'storybook')
    subRoot = path.join(cacheRoot, version, 'default')
    fs.mkdirSync(subRoot, { recursive: true })
  }

  const namespaceDir = path.join(subRoot, namespace)
  fs.mkdirSync(namespaceDir, { recursive: true })

  const file = path.join(namespaceDir, fileNameFor(key))
  const created = !fs.existsSync(file)
  // Same envelope FileSystemCache writes; same `JSON.stringify` defaults.
  const envelope: Record<string, unknown> = { key, content }
  if (typeof opts.ttl === 'number') envelope.ttl = opts.ttl
  fs.writeFileSync(file, JSON.stringify(envelope), 'utf-8')

  const stat = fs.statSync(file)
  return {
    entry: {
      key,
      namespace,
      file,
      mtime: stat.mtimeMs,
      size: stat.size,
      content,
      ttl: typeof opts.ttl === 'number' ? opts.ttl : null,
      expired: typeof opts.ttl === 'number' && Date.now() > opts.ttl,
    },
    created,
  }
}

/**
 * Delete one entry. Returns true if a file was removed, false if it didn't
 * exist (callers can map this to 404 vs 204).
 */
export function deleteEntry(
  location: CacheLocation,
  key: string,
  opts: { namespace?: string } = {}
): boolean {
  const subRoot = getActiveSubRoot(location)
  if (!subRoot) return false

  if (opts.namespace) {
    const file = path.join(subRoot, opts.namespace, fileNameFor(key))
    if (!fs.existsSync(file)) return false
    fs.unlinkSync(file)
    return true
  }

  // No namespace specified — search all namespaces and delete the first match.
  // Supports the dashboard's "delete by key" affordance without forcing the
  // user to pick the right namespace dropdown.
  let namespaceDirs: string[]
  try {
    namespaceDirs = fs.readdirSync(subRoot)
  } catch {
    return false
  }

  for (const ns of namespaceDirs) {
    const file = path.join(subRoot, ns, fileNameFor(key))
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
      return true
    }
  }
  return false
}

/**
 * Recursively delete every storybook-* file under the active sub-root.
 * Leaves the directory tree itself in place so the watcher's filesystem
 * handles stay valid.
 */
export function clearCache(location: CacheLocation): { deleted: number } {
  const subRoot = getActiveSubRoot(location)
  if (!subRoot) return { deleted: 0 }

  let deleted = 0
  let namespaceDirs: string[]
  try {
    namespaceDirs = fs.readdirSync(subRoot)
  } catch {
    return { deleted: 0 }
  }

  for (const ns of namespaceDirs) {
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
      if (!f.startsWith('storybook-')) continue
      try {
        fs.unlinkSync(path.join(nsPath, f))
        deleted++
      } catch {
        // Permissions / race — keep going, deletion is best-effort.
      }
    }
  }
  return { deleted }
}

// Re-export discovery helpers to keep imports tidy.
export { describeCacheLayout, findCacheRoot }
