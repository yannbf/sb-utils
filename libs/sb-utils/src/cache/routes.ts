import { Hono } from 'hono'
import { resolveCacheLocation } from './discover'
import { findEntryByKey, listEntries } from './read'
import { clearCache, deleteEntry, writeEntry } from './write'
import type { CacheLocation } from './types'

export type CacheRoutesOptions = {
  /**
   * Returns the server's currently-active CacheLocation. Wrapped in a getter
   * because the user can switch project roots from the dashboard at runtime.
   */
  getLocation: () => CacheLocation
  /**
   * Replace the server's resolved location (e.g. when the user picks a
   * different project root from the dashboard).
   */
  setProjectRoot: (projectRoot: string | null) => CacheLocation
  /**
   * Pin the active cache version. The server re-resolves the location
   * with the chosen version so subsequent reads (and the watcher)
   * target it. Pass null to revert to auto-pick.
   */
  setVersion: (version: string | null) => CacheLocation
}

/**
 * Resolve the location to operate on for a given request. Honors
 * `?projectRoot=<abs>` and `?version=<v>` query overrides per-request
 * without mutating the server's default — useful for one-off lookups
 * across projects / versions.
 */
function locationForRequest(c: any, opts: CacheRoutesOptions): CacheLocation {
  const projectRoot = c.req.query('projectRoot')
  const version = c.req.query('version')
  if (projectRoot || version) {
    const base = projectRoot ? null : opts.getLocation().projectRoot
    return resolveCacheLocation({
      projectRoot: projectRoot ?? base,
      version: version ?? null,
    })
  }
  return opts.getLocation()
}

function withSummary(location: CacheLocation, body: Record<string, unknown> = {}) {
  return {
    cacheStatus: location.status,
    projectRoot: location.projectRoot,
    cacheRoot: location.cacheRoot,
    version: location.version,
    versions: location.versions,
    projectStorybookVersion: location.projectStorybookVersion,
    ...body,
  }
}

export function createCacheRoutes(opts: CacheRoutesOptions): Hono {
  const app = new Hono()

  // GET /cache/info — full layout.
  app.get('/info', (c) => {
    const loc = locationForRequest(c, opts)
    return c.json({
      cacheStatus: loc.status,
      projectRoot: loc.projectRoot,
      cacheRoot: loc.cacheRoot,
      version: loc.version,
      versions: loc.versions,
      otherVersions: loc.otherVersions,
      subs: loc.subs,
      namespaces: loc.namespaces,
      projectStorybookVersion: loc.projectStorybookVersion,
    })
  })

  // POST /cache/project-root { projectRoot } — switch the active root.
  app.post('/project-root', async (c) => {
    let body: any
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }
    const projectRoot =
      body && typeof body.projectRoot === 'string' ? body.projectRoot : null
    const newLoc = opts.setProjectRoot(projectRoot || null)
    return c.json({
      cacheStatus: newLoc.status,
      projectRoot: newLoc.projectRoot,
      cacheRoot: newLoc.cacheRoot,
      version: newLoc.version,
      versions: newLoc.versions,
      subs: newLoc.subs,
      namespaces: newLoc.namespaces,
      projectStorybookVersion: newLoc.projectStorybookVersion,
    })
  })

  // POST /cache/version { version } — pin the active cache version.
  // Accepts null/empty to revert to the server's auto-pick.
  app.post('/version', async (c) => {
    let body: any
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }
    const version =
      body && typeof body.version === 'string' && body.version.trim()
        ? body.version.trim()
        : null
    const newLoc = opts.setVersion(version)
    return c.json({
      cacheStatus: newLoc.status,
      projectRoot: newLoc.projectRoot,
      cacheRoot: newLoc.cacheRoot,
      version: newLoc.version,
      versions: newLoc.versions,
      subs: newLoc.subs,
      namespaces: newLoc.namespaces,
      projectStorybookVersion: newLoc.projectStorybookVersion,
    })
  })

  // GET /cache/entries — list all (optional ?key, ?keyPrefix, ?namespace).
  app.get('/entries', (c) => {
    const loc = locationForRequest(c, opts)
    if (loc.status !== 'found') {
      return c.json(withSummary(loc, { entries: [] }))
    }
    const keyExact = c.req.query('key')
    const keyPrefix = c.req.query('keyPrefix')
    const namespace = c.req.query('namespace')
    let entries = listEntries(loc)
    if (keyExact) entries = entries.filter((e) => e.key === keyExact)
    if (keyPrefix) entries = entries.filter((e) => e.key.startsWith(keyPrefix))
    if (namespace) entries = entries.filter((e) => e.namespace === namespace)
    // Stable sort: namespace, then key.
    entries.sort(
      (a, b) =>
        a.namespace.localeCompare(b.namespace) || a.key.localeCompare(b.key)
    )
    return c.json(withSummary(loc, { entries }))
  })

  // GET /cache/entries/:key — single entry by logical key.
  app.get('/entries/:key', (c) => {
    const loc = locationForRequest(c, opts)
    if (loc.status !== 'found') {
      return c.json(withSummary(loc, { error: 'cache not found' }), 409)
    }
    const key = decodeURIComponent(c.req.param('key'))
    const entry = findEntryByKey(loc, key)
    if (!entry) {
      return c.json(withSummary(loc, { error: 'not found', key }), 404)
    }
    return c.json(withSummary(loc, { entry }))
  })

  // PUT /cache/entries/:key — write content. Writes are not gated server-side
  // (this is a local debug tool). The dashboard exposes a read-only/edit
  // toggle to guard against accidental mutations.
  app.put('/entries/:key', async (c) => {
    const loc = locationForRequest(c, opts)
    const key = decodeURIComponent(c.req.param('key'))
    const namespace = c.req.query('namespace') ?? undefined
    const ttlRaw = c.req.query('ttl')
    const createIfMissing = c.req.query('createIfMissing') === 'true'
    const version = c.req.query('version') ?? undefined

    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    try {
      const result = writeEntry(loc, key, body, {
        namespace,
        createIfMissing,
        version,
        ttl: ttlRaw ? Number(ttlRaw) : undefined,
      })
      return c.json(
        withSummary(loc, {
          entry: result.entry,
          created: result.created,
        }),
        result.created ? 201 : 200
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return c.json(withSummary(loc, { error: message }), 409)
    }
  })

  // DELETE /cache/entries/:key.
  app.delete('/entries/:key', (c) => {
    const loc = locationForRequest(c, opts)
    const key = decodeURIComponent(c.req.param('key'))
    const namespace = c.req.query('namespace') ?? undefined
    const removed = deleteEntry(loc, key, { namespace })
    if (!removed) {
      return c.json(withSummary(loc, { error: 'not found', key }), 404)
    }
    return c.body(null, 204)
  })

  // POST /cache/clear.
  app.post('/clear', (c) => {
    const loc = locationForRequest(c, opts)
    const result = clearCache(loc)
    return c.json(withSummary(loc, result))
  })

  return app
}
