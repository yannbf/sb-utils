import fs from 'node:fs'
import path from 'node:path'
import type { CacheEntry, CacheLocation } from './types'

/**
 * Active cache root for the resolved location. Returns the directory that
 * actually holds the `<namespace>/storybook-<hash>` files.
 */
export function getActiveSubRoot(location: CacheLocation): string | null {
  if (location.status !== 'found' || !location.cacheRoot || !location.version) {
    return null
  }
  // The 'default' sub is canonical for core; if it doesn't exist fall back
  // to whatever's first.
  const sub = location.subs.includes('default') ? 'default' : location.subs[0]
  if (!sub) return null
  return path.join(location.cacheRoot, location.version, sub)
}

function readJsonFile(file: string): unknown {
  const raw = fs.readFileSync(file, 'utf-8')
  return JSON.parse(raw)
}

/**
 * Read a single cache file and turn it into a CacheEntry. Returns null if
 * the file is missing, unreadable, or doesn't match the `{ key, content }`
 * shape (Storybook's FileSystemCache writes that envelope; anything else is
 * not ours).
 */
export function readEntryFile(file: string, namespace: string): CacheEntry | null {
  let stat: fs.Stats
  try {
    stat = fs.statSync(file)
  } catch {
    return null
  }
  if (!stat.isFile()) return null

  let parsed: any
  try {
    parsed = readJsonFile(file)
  } catch {
    // File on disk but unparseable — surface a marker entry so the dashboard
    // shows the user something actionable rather than silently dropping it.
    return {
      key: `<unparseable:${path.basename(file)}>`,
      namespace,
      file,
      mtime: stat.mtimeMs,
      size: stat.size,
      content: null,
      ttl: null,
      expired: false,
    }
  }

  if (!parsed || typeof parsed !== 'object' || typeof parsed.key !== 'string') {
    return null
  }

  const ttl = typeof parsed.ttl === 'number' ? parsed.ttl : null
  return {
    key: parsed.key,
    namespace,
    file,
    mtime: stat.mtimeMs,
    size: stat.size,
    content: parsed.content,
    ttl,
    expired: ttl !== null && Date.now() > ttl,
  }
}

/**
 * Walk all namespaces under the active sub and return every parseable entry.
 * Order is undefined; callers that want stable ordering should sort.
 */
export function listEntries(location: CacheLocation): CacheEntry[] {
  const subRoot = getActiveSubRoot(location)
  if (!subRoot) return []

  const out: CacheEntry[] = []

  let namespaceDirs: string[]
  try {
    namespaceDirs = fs.readdirSync(subRoot)
  } catch {
    return []
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
      // Only files matching the storybook prefix; skips lockfiles, .DS_Store,
      // vitest deps subfolders, etc.
      if (!f.startsWith('storybook-')) continue
      const entry = readEntryFile(path.join(nsPath, f), ns)
      if (entry) out.push(entry)
    }
  }

  return out
}

/** Find a single entry by logical key (across all namespaces). */
export function findEntryByKey(location: CacheLocation, key: string): CacheEntry | null {
  return listEntries(location).find((e) => e.key === key) ?? null
}
