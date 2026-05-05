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
 * Filename gate for "this file is (probably) a cache entry we should
 * surface in the dashboard". Lists every regular file under each
 * namespace directory — covers Storybook's `FileSystemCache` outputs
 * (`storybook-<sha>`) AND foreign-but-useful artifacts other
 * subsystems drop into the same tree, e.g. vitest's
 * `story-tests/test-results-<ts>.json` dumps. Excludes hidden files
 * (`.DS_Store`, dot-lockfiles) so we don't get noise.
 *
 * Used by both the read-time enumerator and the watch-time accept
 * gate so live + on-load views agree on what counts. Deletion (in
 * write.ts) intentionally stays strict to `storybook-*` so we never
 * touch files we didn't write.
 */
export function isCacheFile(f: string): boolean {
  if (!f) return false
  if (f.startsWith('.')) return false
  return true
}

/**
 * Derive a logical key for files that don't ship Storybook's
 * `{ key, content }` envelope (e.g. vitest test-result dumps). Strips
 * a trailing `.json` extension to keep the dashboard label compact.
 */
function deriveKeyFromFilename(file: string): string {
  return path.basename(file).replace(/\.json$/i, '')
}

/**
 * Read a single cache file and turn it into a CacheEntry. Falls back
 * to using the filename as the entry's key when the file isn't in
 * Storybook's `{ key, content }` envelope — covers test-result
 * dumps and any future foreign JSON drops without a custom adapter.
 * Returns null only when the file is missing or not a regular file.
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

  // Storybook's FileSystemCache envelope: `{ key, content, ttl? }`.
  if (parsed && typeof parsed === 'object' && typeof parsed.key === 'string') {
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

  // Foreign shape — vitest's story-tests dumps, manual writes, etc.
  // Surface them with the filename as the key and the parsed JSON as
  // content. Non-JSON or non-object payloads still get represented so
  // the user sees something in the cache view.
  return {
    key: deriveKeyFromFilename(file),
    namespace,
    file,
    mtime: stat.mtimeMs,
    size: stat.size,
    content: parsed,
    ttl: null,
    expired: false,
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
      // Accept any regular file under the namespace — covers
      // Storybook's `storybook-<sha>` files AND foreign artifacts
      // like vitest's `story-tests/test-results-*.json`. Hidden
      // files (`.DS_Store`, dot-lockfiles) and non-files (subdirs
      // such as vitest deps) are filtered downstream.
      if (!isCacheFile(f)) continue
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
