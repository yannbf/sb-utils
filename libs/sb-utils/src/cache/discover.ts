import fs from 'node:fs'
import path from 'node:path'
import {
  findProjectStorybookVersion,
  pickMatchingVersion,
} from './storybook-version'
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
 * Recursively walk a cache version directory and return the highest
 * mtime found. Capped at a small depth — Storybook's cache layout is
 * `<version>/<sub>/<namespace>/<file>` (3 levels of dirs) so depth 4
 * covers files. Returns 0 on any error so the caller falls back to
 * lexicographic ordering for that version.
 */
function maxMtimeMs(dir: string, depth = 4): number {
  let max = 0
  let stat: fs.Stats
  try {
    stat = fs.statSync(dir)
  } catch {
    return 0
  }
  if (stat.mtimeMs > max) max = stat.mtimeMs
  if (depth <= 0 || !stat.isDirectory()) return max
  let children: string[]
  try {
    children = fs.readdirSync(dir)
  } catch {
    return max
  }
  for (const child of children) {
    const m = maxMtimeMs(path.join(dir, child), depth - 1)
    if (m > max) max = m
  }
  return max
}

/**
 * Inspect a cache root and surface its layout. Returns every version
 * directory found plus the layout for the active one. The "active"
 * version is chosen by `pickActiveVersion`: prefer an exact match
 * for `preferred`, otherwise fall back to the most-recently-updated
 * version dir (max file mtime under it).
 */
export function describeCacheLayout(
  cacheRoot: string,
  preferred?: string | null,
): {
  version: string | null
  versions: string[]
  otherVersions: string[]
  versionMtimes: Record<string, number>
  subs: string[]
  namespaces: string[]
} {
  const versions = readDirSafe(cacheRoot).sort()
  if (versions.length === 0) {
    return {
      version: null,
      versions: [],
      otherVersions: [],
      versionMtimes: {},
      subs: [],
      namespaces: [],
    }
  }
  const versionMtimes: Record<string, number> = {}
  for (const v of versions) {
    versionMtimes[v] = maxMtimeMs(path.join(cacheRoot, v))
  }
  const version = pickActiveVersion(versions, preferred ?? null, versionMtimes)
  const otherVersions = versions.filter((v) => v !== version)

  const versionRoot = path.join(cacheRoot, version)
  const subs = readDirSafe(versionRoot)
  // 'default' is the canonical sub used by core. Surface it first so dashboard
  // grouping is predictable; vitest-style hashed subs sort alphabetically.
  subs.sort((a, b) => (a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)))
  const activeSub = subs[0] ?? null
  const namespaces = activeSub ? readDirSafe(path.join(versionRoot, activeSub)) : []
  return { version, versions, otherVersions, versionMtimes, subs, namespaces }
}

/**
 * Resolve which version dir to treat as "active" given the available
 * dirs and an optional preference.
 *
 *   1. If `preferred` matches one of the available dirs exactly, use it.
 *      (`preferred` is set when the caller has explicitly pinned a
 *      version — the dashboard's version picker.)
 *   2. Otherwise pick the dir with the most recent contents (max file
 *      mtime under it). This is what users typically want by default:
 *      "show me the cache from my latest run", regardless of whether
 *      it matches the version declared in package.json.
 *   3. As a last-resort tie-breaker (no mtimes available), fall back to
 *      the highest-sorted entry.
 */
export function pickActiveVersion(
  versions: string[],
  preferred: string | null,
  mtimes: Record<string, number> = {},
): string {
  const exact = pickMatchingVersion(versions, preferred ?? null)
  if (exact) return exact
  // mtime descending; ties broken by lexicographic descending so the
  // result is deterministic.
  const sorted = [...versions].sort((a, b) => {
    const dt = (mtimes[b] ?? 0) - (mtimes[a] ?? 0)
    if (dt !== 0) return dt
    return b.localeCompare(a)
  })
  return sorted[0]
}

export type ResolveOptions = {
  // Explicit project root takes precedence over auto-discovery.
  projectRoot?: string | null
  // The cwd to anchor auto-discovery from. Defaults to process.cwd().
  cwd?: string
  /**
   * Pin the active cache version. When set, the resolved location's
   * `version` is forced to this value (or 'not-found' if the dir
   * doesn't exist on disk). When omitted, we auto-pick: prefer the
   * project's declared storybook version when it matches a version
   * dir, otherwise pick the most-recently-updated version dir.
   */
  version?: string | null
  /**
   * Pre-resolved storybook version. When provided, skips the
   * package.json walk and uses this value as `projectStorybookVersion`
   * in the result. Lets long-running callers (the event-logger) cache
   * the lookup once they've found it, so they don't re-walk the FS on
   * every re-resolve. Pass `null` to force a re-walk.
   */
  installedVersion?: string | null
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
      versions: [],
      otherVersions: [],
      versionMtimes: {},
      subs: [],
      namespaces: [],
      projectStorybookVersion: null,
    }
  }

  // Pull the project's declared storybook version up-front so we can
  // bias the version-dir pick toward it (and surface it to the
  // dashboard for "currently used" labelling). Honour an explicit
  // override from the caller — long-running callers cache the result
  // and avoid re-walking the FS on every re-resolve.
  let projectStorybookVersion: string | null = null
  if (opts.installedVersion !== undefined) {
    projectStorybookVersion = opts.installedVersion
  } else {
    try {
      projectStorybookVersion = findProjectStorybookVersion(projectRoot)
    } catch {
      projectStorybookVersion = null
    }
  }

  const cacheRoot = findCacheRoot(projectRoot)
  if (!cacheRoot) {
    return {
      status: 'not-found',
      projectRoot,
      cacheRoot: null,
      version: null,
      versions: [],
      otherVersions: [],
      versionMtimes: {},
      subs: [],
      namespaces: [],
      projectStorybookVersion,
    }
  }

  // Auto-pick prefers the project's declared storybook version when
  // its cache dir exists; otherwise `describeCacheLayout` falls back
  // to the most-recently-updated version dir. An explicit pin via
  // `opts.version` always wins.
  const preferred = opts.version ?? projectStorybookVersion

  let layout: ReturnType<typeof describeCacheLayout>
  let status: CacheStatus = 'found'
  try {
    layout = describeCacheLayout(cacheRoot, preferred)
    if (!layout.version) status = 'not-found'
    // If the caller pinned an explicit version that doesn't actually
    // exist on disk, surface that as not-found and clear the active
    // version so the UI can prompt the user to pick a different one
    // rather than silently falling back to the highest-sorted version
    // (which would be misleading — they wouldn't see their pick win).
    if (opts.version && !layout.versions.includes(opts.version)) {
      layout = { ...layout, version: null, subs: [], namespaces: [] }
      status = 'not-found'
    }
  } catch {
    layout = {
      version: null,
      versions: [],
      otherVersions: [],
      versionMtimes: {},
      subs: [],
      namespaces: [],
    }
    status = 'unreadable'
  }

  return {
    status,
    projectRoot,
    cacheRoot,
    version: layout.version,
    versions: layout.versions,
    otherVersions: layout.otherVersions,
    versionMtimes: layout.versionMtimes,
    subs: layout.subs,
    namespaces: layout.namespaces,
    projectStorybookVersion,
  }
}
