import fs from 'node:fs'
import path from 'node:path'
import type { CacheLocation, CacheStatus } from './types'

// Storybook's resolvePathInStorybookCache picks the first available of:
//   <project>/node_modules/.cache/storybook
//   <project>/.cache/storybook
// We mirror that lookup order.
const CACHE_DIR_CANDIDATES = [
  path.join('node_modules', '.cache', 'storybook'),
  path.join('.cache', 'storybook'),
]

/**
 * Walk up from `from` looking for a directory that contains both a
 * `package.json` and one of the storybook cache dirs.
 *
 * Returns null if we reach the root without finding one — the caller renders
 * the "no cache" empty state in that case.
 */
export function findProjectRoot(from: string = process.cwd()): string | null {
  let dir = path.resolve(from)
  // Bound the walk so a misconfigured cwd doesn't spin forever.
  for (let i = 0; i < 50; i++) {
    if (
      fs.existsSync(path.join(dir, 'package.json')) &&
      CACHE_DIR_CANDIDATES.some((c) => fs.existsSync(path.join(dir, c)))
    ) {
      return dir
    }
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
  return null
}

/** Resolve the active cache root inside a known project directory. */
export function findCacheRoot(projectRoot: string): string | null {
  for (const candidate of CACHE_DIR_CANDIDATES) {
    const full = path.join(projectRoot, candidate)
    if (fs.existsSync(full)) return full
  }
  return null
}

function readDirSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((name) => {
      try {
        return fs.statSync(path.join(dir, name)).isDirectory()
      } catch {
        return false
      }
    })
  } catch {
    return []
  }
}

/**
 * Inspect a cache root and surface its layout. Picks the highest-versioned
 * sub-directory as the active one (sorted lexicographically — works for both
 * stable semver and the long pre-release suffixes).
 */
export function describeCacheLayout(cacheRoot: string): {
  version: string | null
  otherVersions: string[]
  subs: string[]
  namespaces: string[]
} {
  const versionDirs = readDirSafe(cacheRoot).sort()
  if (versionDirs.length === 0) {
    return { version: null, otherVersions: [], subs: [], namespaces: [] }
  }
  // Highest = last after sort. For stable versions this is the latest semver;
  // for pre-release shas this is at least deterministic.
  const version = versionDirs[versionDirs.length - 1]
  const otherVersions = versionDirs.slice(0, -1)

  const versionRoot = path.join(cacheRoot, version)
  const subs = readDirSafe(versionRoot)
  // 'default' is the canonical sub used by core. Surface it first so dashboard
  // grouping is predictable; vitest-style hashed subs sort alphabetically.
  subs.sort((a, b) => (a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)))
  const activeSub = subs[0] ?? null
  const namespaces = activeSub ? readDirSafe(path.join(versionRoot, activeSub)) : []
  return { version, otherVersions, subs, namespaces }
}

export type ResolveOptions = {
  // Explicit project root takes precedence over auto-discovery.
  projectRoot?: string | null
  // The cwd to anchor auto-discovery from. Defaults to process.cwd().
  cwd?: string
}

/**
 * Public entry point. Always returns a CacheLocation — including for
 * "no cache" / "unreadable" states — so the dashboard can render empty
 * states cleanly without a separate code path.
 */
export function resolveCacheLocation(opts: ResolveOptions = {}): CacheLocation {
  const cwd = opts.cwd ?? process.cwd()

  let projectRoot: string | null
  if (opts.projectRoot) {
    // Honor explicit override even if it doesn't have a cache yet — surface
    // 'not-found' so the user can correct or `--allow-cache-writes
    // --create-if-missing`.
    projectRoot = path.resolve(opts.projectRoot)
  } else {
    projectRoot = findProjectRoot(cwd)
  }

  if (!projectRoot) {
    return {
      status: 'not-found',
      projectRoot: null,
      cacheRoot: null,
      version: null,
      otherVersions: [],
      subs: [],
      namespaces: [],
    }
  }

  const cacheRoot = findCacheRoot(projectRoot)
  if (!cacheRoot) {
    return {
      status: 'not-found',
      projectRoot,
      cacheRoot: null,
      version: null,
      otherVersions: [],
      subs: [],
      namespaces: [],
    }
  }

  let layout: ReturnType<typeof describeCacheLayout>
  let status: CacheStatus = 'found'
  try {
    layout = describeCacheLayout(cacheRoot)
    if (!layout.version) status = 'not-found'
  } catch {
    layout = { version: null, otherVersions: [], subs: [], namespaces: [] }
    status = 'unreadable'
  }

  return {
    status,
    projectRoot,
    cacheRoot,
    version: layout.version,
    otherVersions: layout.otherVersions,
    subs: layout.subs,
    namespaces: layout.namespaces,
  }
}
