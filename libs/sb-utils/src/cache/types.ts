// Storybook's cache lives at <project>/node_modules/.cache/storybook (or
// .cache/storybook) and is namespaced as: <cacheRoot>/<version>/<sub>/<dir>/
// Each file is JSON: { "key": "<logical>", "content": <any> }, named
// `storybook-<sha256(key)>`.

export type CacheStatus = 'found' | 'not-found' | 'unreadable'

export type CacheLocation = {
  status: CacheStatus
  projectRoot: string | null
  cacheRoot: string | null
  // The active version directory (highest if multiple are present).
  version: string | null
  // Other version directories that exist but aren't the active one.
  otherVersions: string[]
  // The default sub-namespace (always 'default' for core; project-hash dirs
  // for vitest-style isolated caches).
  subs: string[]
  // Top-level groupings inside the active sub (e.g. 'dev-server', 'telemetry').
  namespaces: string[]
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
