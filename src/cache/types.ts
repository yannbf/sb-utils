// Storybook's cache lives at <project>/node_modules/.cache/storybook (or
// .cache/storybook) and is namespaced as: <cacheRoot>/<version>/<sub>/<dir>/
// Each file is JSON: { "key": "<logical>", "content": <any> }, named
// `storybook-<sha256(key)>`.

export type CacheStatus = 'found' | 'not-found' | 'unreadable'

export type CacheLocation = {
  status: CacheStatus
  projectRoot: string | null
  cacheRoot: string | null
  // The active version directory. Picked from `versions` based on the
  // project's declared storybook version when available, otherwise the
  // highest-sorted entry.
  version: string | null
  // Every version directory that exists under cacheRoot, sorted.
  // Storybook partitions its cache per-version, so a project that has
  // run multiple storybook versions ends up with one dir per version.
  versions: string[]
  // Other version directories that exist but aren't the active one.
  // (Kept for callers that only care about the non-active set.)
  otherVersions: string[]
  // Max file mtime (ms) under each version directory. Used to pick the
  // most-recently-updated version as the auto-default and to power UI
  // affordances like "(latest)" labels in the picker. Empty when no
  // versions exist.
  versionMtimes: Record<string, number>
  // The default sub-namespace (always 'default' for core; project-hash dirs
  // for vitest-style isolated caches).
  subs: string[]
  // Top-level groupings inside the active sub (e.g. 'dev-server', 'telemetry').
  namespaces: string[]
  // The storybook version declared in the nearest package.json
  // (walking up from projectRoot to the git root). Null when no
  // package.json between projectRoot and the git root declares
  // storybook in dependencies / devDependencies. Surfaced so the
  // dashboard can label the matching version dir as "current".
  projectStorybookVersion: string | null
}

export type CacheEntry = {
  key: string
  namespace: string
  file: string
  mtime: number
  size: number
  content: unknown
  // Storybook's FileSystemCache stores `ttl` as an absolute epoch ms when set.
  // Surfaced for UI but not auto-applied — we want to show expired entries
  // in the inspector, not hide them.
  ttl: number | null
  expired: boolean
}

// Emitted by the watcher when a cache file is created/updated/deleted.
export type CacheChange = {
  operation: 'create' | 'update' | 'delete'
  key: string
  namespace: string
  file: string
  content: unknown
  previousContent: unknown
  diff: CacheDiff | null
  timestamp: number
}

// Tiny structural diff. Not a full deep-diff library — just enough to make
// timeline events readable.
export type CacheDiff = {
  added: Record<string, unknown>
  removed: Record<string, unknown>
  changed: Record<string, { from: unknown; to: unknown }>
}
