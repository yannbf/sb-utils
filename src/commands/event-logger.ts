import { intro, log, note, outro } from '@clack/prompts'
import { serve } from '@hono/node-server'
import type { ServerType } from '@hono/node-server'
import { streamSSE } from 'hono/streaming'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isAgent, agent } from 'std-env'
import { blue, bright, green, grey } from '../utils/colors'
import {
  createCacheRoutes,
  findProjectStorybookVersion,
  resolveCacheLocation,
  watchCache,
  type CacheChange,
  type CacheLocation,
} from '../cache'

type TelemetryEvent = {
  eventType: string
  eventId?: string
  sessionId?: string
  payload?: Record<string, unknown>
  metadata?: Record<string, unknown>
  context?: Record<string, unknown>
  [key: string]: unknown
}

type StoredEvent = TelemetryEvent & {
  _index: number
  _receivedAt: number
}

type SSEClient = {
  write: (data: string) => void
}

export type EventLoggerOptions = {
  port: number
  open: boolean
  json: boolean
  quiet: boolean
  maxEvents: number
  importPath?: string
  projectRoot?: string
  /**
   * Suppress cache event logging in the CLI and tell the dashboard to start
   * with the cache toggle off. The watcher and routes still run so the user
   * can flip it back on from the UI without restarting the process.
   */
  noCache?: boolean
  /**
   * Hard-off for the cache watcher (server-side). Kills cache event capture
   * entirely. The dashboard's Cache tab still reads via /cache/* on demand.
   */
  noCacheWatch?: boolean
}

export async function eventLogger(options: EventLoggerOptions): Promise<void> {
  const { maxEvents } = options
  // Mutable so the EADDRINUSE retry loop in startListening() can bump it
  // without re-threading every consumer (URL string, ready payload, etc.).
  let port = options.port

  // Auto-enable JSON mode when running inside an AI agent
  const detectedAgent = isAgent ? agent : undefined
  const jsonMode = options.json || !!detectedAgent
  const quiet = options.quiet || !!detectedAgent

  if (!quiet) {
    intro('Storybook Telemetry Debugger')
  }

  const events: StoredEvent[] = []
  const sseClients = new Set<SSEClient>()
  let eventCounter = 0
  // Separate counter for the human CLI log. Cache events bump
  // `eventCounter` (so the dashboard can order them) but don't print a
  // line, which would otherwise leave visible gaps like #0, #4, #7…
  let telemetryDisplayCounter = 0
  // Wall-clock time the server booted. Exposed via /config so the
  // dashboard can mark cache entries with mtime < startedAt as "stale"
  // (pre-existing artifacts from before this debug session) and hide
  // them by default.
  const startedAt = Date.now()

  type ImportBatch = {
    id: string
    name: string
    importedAt: number
    explanation?: string
  }
  let importCounter = 0

  function makeBatch(name: string): ImportBatch {
    const id = `import-${Date.now().toString(36)}-${(importCounter++).toString(36)}`
    return { id, name, importedAt: Date.now() }
  }

  function ingestEvents(
    raw: unknown,
    source: string,
    batch?: ImportBatch,
  ): { added: number; error?: string } {
    // Expect the wrapped shape `{ events: [...], explanation?: string }`
    // produced by the dashboard's JSON export.
    if (
      !raw ||
      typeof raw !== 'object' ||
      !Array.isArray((raw as { events?: unknown }).events)
    ) {
      return {
        added: 0,
        error: `${source}: expected a JSON object shaped like { events, explanation? }`,
      }
    }
    const arr = (raw as { events: unknown[] }).events
    const wrapped = raw as { explanation?: unknown }
    if (
      batch &&
      typeof wrapped.explanation === 'string' &&
      wrapped.explanation.trim()
    ) {
      batch.explanation = wrapped.explanation
    }
    let added = 0
    for (const item of arr as unknown[]) {
      if (!item || typeof item !== 'object') continue
      const ev = item as TelemetryEvent
      if (typeof ev.eventType !== 'string') continue
      const index = eventCounter++
      const receivedAt =
        typeof (ev as { _receivedAt?: unknown })._receivedAt === 'number'
          ? (ev as any as { _receivedAt: number })._receivedAt
          : Date.now()
      const stored: StoredEvent = {
        ...ev,
        _index: index,
        _receivedAt: receivedAt,
      }
      if (batch) {
        ;(stored as StoredEvent & { _import: ImportBatch })._import = batch
      }
      if (maxEvents > 0 && events.length >= maxEvents) events.shift()
      events.push(stored)
      added++
    }
    return { added }
  }

  if (options.importPath) {
    try {
      const resolved = path.resolve(process.cwd(), options.importPath)
      const content = fs.readFileSync(resolved, 'utf-8')
      const parsed = JSON.parse(content)
      const batch = makeBatch(path.basename(resolved))
      const { added, error } = ingestEvents(parsed, resolved, batch)
      if (error) {
        log.error(error)
        process.exit(1)
      }
      if (!quiet && !jsonMode) {
        log.info(`Imported ${added} events from ${resolved}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      log.error(`Failed to import ${options.importPath}: ${message}`)
      process.exit(1)
    }
  }

  function broadcastEvent(event: StoredEvent) {
    const data = JSON.stringify(event)
    for (const client of sseClients) {
      try {
        client.write(data)
      } catch {
        sseClients.delete(client)
      }
    }
  }

  /**
   * Send an out-of-band SSE control frame the dashboard recognizes. Used
   * by the auto re-evaluation loop to tell the client "I just switched
   * cache version dirs — drop your local cache events and re-fetch
   * info" without smuggling it through a real telemetry event.
   *
   * Frames look like `{ "_control": "<name>", ...payload }`. The
   * dashboard's SSE handler bails out before the StoredEvent pipeline
   * when `_control` is set, so these never appear in the event list.
   */
  function broadcastCacheReset(reason: string) {
    const data = JSON.stringify({ _control: 'cache-reset', reason })
    for (const client of sseClients) {
      try {
        client.write(data)
      } catch {
        sseClients.delete(client)
      }
    }
  }

  // ── Cache integration ──────────────────────────────
  // Cached installed storybook version. Once detected (non-null), it's
  // frozen — `findProjectStorybookVersion` walks the FS and we don't
  // want to re-do that on every cache write. Stays null until storybook
  // is installed mid-session, at which point the periodic
  // re-evaluation timer picks it up and writes here once.
  let cachedInstalledVersion: string | null = null

  function rememberInstalledVersionFrom(projectRoot: string | null): void {
    if (cachedInstalledVersion) return
    if (!projectRoot) return
    let v: string | null = null
    try {
      v = findProjectStorybookVersion(projectRoot)
    } catch {
      v = null
    }
    if (v) cachedInstalledVersion = v
  }

  // Active cache location. Mutable because the dashboard can switch project
  // roots at runtime via POST /cache/project-root.
  let cacheLocation: CacheLocation = resolveCacheLocation({
    projectRoot: options.projectRoot ?? null,
  })
  if (cacheLocation.projectStorybookVersion) {
    cachedInstalledVersion = cacheLocation.projectStorybookVersion
  }
  // The version the user has explicitly pinned via the dashboard (or
  // `null` for "auto-pick from project's storybook dependency").
  // Re-applied on every project-root switch and discovery re-resolve.
  let pinnedVersion: string | null = null
  let cacheWatchHandle: { close: () => void } | null = null

  function ingestCacheChange(change: CacheChange) {
    const eventType =
      change.operation === 'delete' ? 'cache:delete' : 'cache:write'
    const index = eventCounter++
    // The dashboard reads `_source` to differentiate cache events from
    // telemetry for styling and filtering. StoredEvent is open-ended so this
    // is structurally valid.
    const stored: StoredEvent & { _source: string } = {
      eventType,
      _index: index,
      _receivedAt: change.timestamp,
      _source: 'cache-watch',
      payload: {
        key: change.key,
        namespace: change.namespace,
        file: change.file,
        operation: change.operation,
        content: change.content,
        previousContent: change.previousContent,
        diff: change.diff,
      },
      context: {
        cacheRoot: cacheLocation.cacheRoot,
        projectRoot: cacheLocation.projectRoot,
      },
    }
    if (maxEvents > 0 && events.length >= maxEvents) events.shift()
    events.push(stored)

    if (jsonMode) {
      // AI agents consume the NDJSON stream — they get every cache
      // event so their automation can see the full picture.
      process.stdout.write(JSON.stringify(stored) + '\n')
    }
    // Human CLI output intentionally omits cache operations: they're
    // chatty (every Storybook write triggers one) and the dashboard is
    // the proper UI for inspecting them. Telemetry events still get a
    // line in the human log, and `noCache` / `noCacheWatch` still
    // gate the watcher itself.

    broadcastEvent(stored)
  }

  function startCacheWatcher(opts: { emitColdStart?: boolean } = {}) {
    if (cacheWatchHandle) {
      cacheWatchHandle.close()
      cacheWatchHandle = null
    }
    if (options.noCacheWatch) return
    cacheWatchHandle = watchCache(() => cacheLocation, ingestCacheChange, opts)
  }
  // Boot-time attach: don't emit cold-start. Existing entries are
  // pre-session by definition; the dashboard's "Show stale cache
  // data" toggle handles the opt-in.
  startCacheWatcher()

  // Drop every cache-watch event we've stored. Used right before we
  // re-seed the watcher against a new project root or version dir —
  // without this, the events array (and the dashboard's count) keeps
  // growing each time the user switches.
  function clearCacheWatchEvents() {
    for (let i = events.length - 1; i >= 0; i--) {
      if ((events[i] as any)._source === 'cache-watch') events.splice(i, 1)
    }
  }

  // Periodic cache-location re-evaluation. Three things can change
  // mid-session that this loop is responsible for picking up:
  //
  //   1. Cache directory appears for the first time (user started
  //      event-logger before running storybook).
  //   2. A new version dir gets created — typically by `storybook
  //      init` upgrading or first-installing storybook. Once
  //      populated, its mtime overtakes existing dirs, so the
  //      auto-pick should switch to it.
  //   3. `storybook` becomes declared in the project's package.json
  //      mid-session. We freeze the value once found and stop
  //      re-walking the FS — every subsequent re-evaluation reuses
  //      the cached installed version so we don't pay the find cost
  //      on every tick.
  //
  // Throttled to 2s so a busy storybook write loop doesn't translate
  // into hot-path FS walks.
  const REEVALUATE_INTERVAL_MS = 2000
  let cacheReevaluateTimer: NodeJS.Timeout | null = null

  function compareVersionsList(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
    return true
  }

  function reevaluateCacheLocation(): void {
    if (options.noCache || options.noCacheWatch) return
    rememberInstalledVersionFrom(cacheLocation.projectRoot)
    const next = resolveCacheLocation({
      projectRoot: cacheLocation.projectRoot ?? null,
      version: pinnedVersion,
      installedVersion: cachedInstalledVersion,
    })
    const wasFound = cacheLocation.status === 'found'
    const isFound = next.status === 'found'

    if (!isFound) {
      // Bookkeeping: keep cacheLocation in sync if projectStorybookVersion
      // just became known on a not-found root (very edge-y, but keeps
      // the dashboard label up to date).
      if (
        !wasFound &&
        next.projectStorybookVersion !== cacheLocation.projectStorybookVersion
      ) {
        cacheLocation = next
        broadcastCacheReset('info-update')
      }
      return
    }

    if (!wasFound) {
      // First detection mid-session. Emit cold-start events so the
      // just-discovered entries surface in the dashboard.
      cacheLocation = next
      startCacheWatcher({ emitColdStart: true })
      if (!quiet) {
        log.info(
          blue('cache') +
            ' detected at ' +
            grey(next.cacheRoot ?? '(unknown)'),
        )
      }
      broadcastCacheReset('first-discovery')
      return
    }

    // Both old and new are found. Switch the watcher only when the
    // active version actually changed — listing-only changes (a new
    // empty version dir, a renamed sibling) don't move the watcher
    // off the user's currently-inspected dir.
    const versionChanged = next.version !== cacheLocation.version
    const versionsListChanged = !compareVersionsList(
      next.versions,
      cacheLocation.versions,
    )
    const projectVersionChanged =
      next.projectStorybookVersion !== cacheLocation.projectStorybookVersion

    if (!versionChanged && !versionsListChanged && !projectVersionChanged) {
      return
    }

    cacheLocation = next
    if (versionChanged) {
      // The cold-start events we're about to emit refer to entries
      // under the NEW version dir. Drop the previous version's
      // events first so the dashboard counts don't pile up. The
      // client receives the reset control frame and drops its local
      // copies before the new cold-start events arrive.
      broadcastCacheReset('version-changed')
      clearCacheWatchEvents()
      startCacheWatcher({ emitColdStart: true })
    } else {
      // Versions list changed (a new empty dir, or a delete of a
      // non-active dir) but the user still inspects the same active
      // version. Just nudge the dashboard to refetch /cache/info.
      broadcastCacheReset('info-update')
    }
  }

  function startCacheReevaluation(): void {
    if (cacheReevaluateTimer) return
    if (options.noCache || options.noCacheWatch) return
    cacheReevaluateTimer = setInterval(reevaluateCacheLocation, REEVALUATE_INTERVAL_MS)
    if (cacheReevaluateTimer.unref) cacheReevaluateTimer.unref()
  }
  startCacheReevaluation()

  // Load and cache the prebuilt dashboard HTML at startup. Vite + the
  // singlefile plugin emit dist/event-log-dashboard.html with all CSS + JS
  // inlined, so the server only needs one asset. Snapshots reuse the same
  // file (the client fetches it back and injects baked state).
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const findAsset = (filename: string): string | null => {
    const candidates = [
      path.join(__dirname, '..', filename),
      path.join(__dirname, filename),
    ]
    return candidates.find((p) => fs.existsSync(p)) ?? null
  }

  const htmlPath = findAsset('event-log-dashboard.html')
  if (!htmlPath) {
    log.error('Could not find event-log-dashboard.html')
    process.exit(1)
  }
  const cachedHtml = fs.readFileSync(htmlPath, 'utf-8')

  const app = new Hono()

  // Global CORS — this is a debug tool, allow all origins
  app.use('*', cors())

  // Dashboard UI (cached, no file read per request)
  app.get('/', (c) => {
    return c.html(cachedHtml)
  })

  // The HTML snapshot exporter fetches this same path back to clone the
  // current shipped dashboard, then injects baked state. Serving via a named
  // route keeps the snapshot client code simple and decoupled from the
  // build's filename hashing decisions.
  app.get('/event-log-dashboard.html', (c) => {
    return c.html(cachedHtml)
  })

  // Cache inspection sub-app at /cache/*
  app.route(
    '/cache',
    createCacheRoutes({
      getLocation: () => cacheLocation,
      setProjectRoot: (newRoot) => {
        // Switching project roots resets any previously-pinned
        // version AND the cached installed-version (the new project
        // may have a different storybook dependency, or none at all).
        pinnedVersion = null
        cachedInstalledVersion = null
        cacheLocation = resolveCacheLocation({ projectRoot: newRoot })
        if (cacheLocation.projectStorybookVersion) {
          cachedInstalledVersion = cacheLocation.projectStorybookVersion
        }
        // Tell every connected dashboard to drop its local cache
        // events BEFORE we emit the new cold-start. The control
        // frame is queued onto the same SSE stream as the cold-start
        // events and is delivered first.
        broadcastCacheReset('project-switch')
        clearCacheWatchEvents()
        // Re-seed the watcher against the new root so subsequent writes
        // appear in the timeline immediately. User explicitly pointed
        // us here, so emit cold-start events to surface the new
        // root's existing contents — the dashboard's staleness gate
        // still hides any genuinely-stale (pre-session) entries.
        startCacheWatcher({ emitColdStart: true })
        return cacheLocation
      },
      setVersion: (version) => {
        pinnedVersion = version
        cacheLocation = resolveCacheLocation({
          projectRoot: cacheLocation.projectRoot ?? null,
          version,
          installedVersion: cachedInstalledVersion,
        })
        broadcastCacheReset('version-changed')
        clearCacheWatchEvents()
        // Re-attach the watcher against the newly-active version dir
        // and surface its existing contents (the entries are new from
        // the user's perspective — they just switched into them).
        startCacheWatcher({ emitColdStart: true })
        return cacheLocation
      },
    }),
  )

  // GET /config — dashboard preferences resolved from CLI flags. The UI
  // reads this once on load to pick its initial toggle states.
  app.get('/config', (c) =>
    c.json({
      cacheEnabledByDefault: !options.noCache,
      startedAt,
    }),
  )

  // SSE endpoint for real-time streaming
  app.get('/sse', (c) => {
    return streamSSE(c, async (stream) => {
      const client: SSEClient = {
        write: (data: string) => {
          stream.writeSSE({ data }).catch(() => {
            sseClients.delete(client)
          })
        },
      }
      sseClients.add(client)

      // Keep the connection alive
      const keepAlive = setInterval(() => {
        stream.writeSSE({ event: 'ping', data: '' }).catch(() => {
          clearInterval(keepAlive)
          sseClients.delete(client)
        })
      }, 30_000)

      // Block until the client disconnects
      await new Promise<void>((resolve) => {
        stream.onAbort(() => {
          clearInterval(keepAlive)
          sseClients.delete(client)
          resolve()
        })
      })
    })
  })

  // Receive telemetry events
  app.post('/event-log', async (c) => {
    let body: TelemetryEvent
    try {
      body = (await c.req.json()) as TelemetryEvent
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    const index = eventCounter++
    const storedEvent: StoredEvent = {
      ...body,
      _index: index,
      _receivedAt: Date.now(),
    }

    // Enforce max events limit
    if (maxEvents > 0 && events.length >= maxEvents) {
      events.shift()
    }
    events.push(storedEvent)

    if (jsonMode) {
      // NDJSON output for AI agents
      process.stdout.write(JSON.stringify(storedEvent) + '\n')
    } else if (!quiet) {
      const sessionInfo = body.sessionId
        ? ` ${grey(`session:${body.sessionId.slice(0, 8)}`)}`
        : ''
      const displayIndex = telemetryDisplayCounter++
      log.info(`${grey(`#${displayIndex}`)} ${blue(body.eventType)}${sessionInfo}`)
    }

    broadcastEvent(storedEvent)
    return c.text('OK')
  })

  // JSON API: all events, with optional query filters
  app.get('/event-log', (c) => {
    const type = c.req.query('type')
    const sessionId = c.req.query('sessionId')
    let result = events as StoredEvent[]
    if (type) {
      result = result.filter((e) => e.eventType === type)
    }
    if (sessionId) {
      result = result.filter((e) => e.sessionId === sessionId)
    }
    return c.json(result)
  })

  // JSON API: event count and summary
  app.get('/event-log/count', (c) => {
    const byType: Record<string, number> = {}
    const bySessions: Record<string, number> = {}
    for (const event of events) {
      byType[event.eventType] = (byType[event.eventType] || 0) + 1
      if (event.sessionId) {
        bySessions[event.sessionId] = (bySessions[event.sessionId] || 0) + 1
      }
    }
    return c.json({ total: events.length, byType, bySessions })
  })

  // JSON API: export captured events as a downloadable, re-importable file.
  // Matches the dashboard's JSON export shape so agents can produce the same
  // artifact without assembling it by hand.
  app.get('/event-log/export', (c) => {
    const type = c.req.query('type')
    const sessionId = c.req.query('sessionId')
    const explanation = c.req.query('explanation') ?? ''
    let result = events as StoredEvent[]
    if (type) result = result.filter((e) => e.eventType === type)
    if (sessionId) result = result.filter((e) => e.sessionId === sessionId)
    // Strip the per-server `_index` ordinal but keep `_receivedAt` so
    // re-importing the file preserves event timing (without it, the
    // timeline view collapses every dot onto the moment of import).
    const cleaned = result.map((e) => {
      const { _index, ...rest } = e as StoredEvent
      return rest
    })
    const payload = { version: 1, explanation, events: cleaned }
    const filename = `telemetry-${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19)}.json`
    c.header('Content-Disposition', `attachment; filename="${filename}"`)
    return c.json(payload)
  })

  // JSON API: events by type (legacy endpoint, kept for compat)
  app.get('/events/:type', (c) => {
    const type = c.req.param('type')
    return c.json(events.filter((e) => e.eventType === type))
  })

  // JSON API: clear events
  app.post('/clear', (c) => {
    const previousCount = events.length
    events.length = 0
    return c.json({ cleared: true, previousCount })
  })

  // JSON API: import a batch of events (used by dashboard drag-and-drop)
  app.post('/event-log/import', async (c) => {
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }
    const rawName = c.req.query('name')
    const name =
      rawName && rawName.trim()
        ? rawName.trim()
        : `import-${new Date().toISOString()}.json`
    const batch = makeBatch(name)
    const { added, error } = ingestEvents(body, 'import', batch)
    if (error) return c.json({ error }, 400)
    // Broadcast each newly-stored event so any connected dashboard updates live.
    for (const stored of events.slice(-added)) broadcastEvent(stored)
    return c.json({ imported: added, total: events.length, batch })
  })

  let server: ServerType

  // Auto-bump the port when EADDRINUSE: another `event-logger` (or any
  // server) is already on it. We try up to MAX_PORT_RETRIES higher
  // ports before giving up. Bumping is silent in jsonMode (the agent
  // sees the actual `dashboard` URL in the ready payload anyway) and
  // logs a single "trying N+1..." line for humans.
  const MAX_PORT_RETRIES = 10
  let portRetries = 0

  const startListening = (): void => {
    server = serve({ fetch: app.fetch, port }, () => {
      const url = `http://localhost:${port}`

      if (jsonMode) {
        // Structured ready message to stderr; events stream as NDJSON to stdout
        const readyPayload: Record<string, unknown> = {
          status: 'ready',
          dashboard: url,
          api: `${url}/event-log`,
          sse: `${url}/sse`,
          telemetryUrl: `${url}/event-log`,
          cache: {
            status: cacheLocation.status,
            projectRoot: cacheLocation.projectRoot,
            cacheRoot: cacheLocation.cacheRoot,
            version: cacheLocation.version,
            watching: !options.noCacheWatch && cacheLocation.status === 'found',
            enabledByDefault: !options.noCache,
          },
        }
        if (detectedAgent) {
          readyPayload.agent = detectedAgent
          readyPayload.usage = {
            capture: `Run any Storybook command with STORYBOOK_TELEMETRY_URL=${url}/event-log to capture events`,
            queryAll: `GET ${url}/event-log — all captured events (supports ?type=<eventType>&sessionId=<id> filters)`,
            queryCount: `GET ${url}/event-log/count — event count summary by type and session`,
            export: `GET ${url}/event-log/export — download a re-importable { version, explanation, events } JSON file (supports ?type=, ?sessionId=, ?explanation=)`,
            clear: `POST ${url}/clear — delete all captured events`,
            stream: `GET ${url}/sse — real-time SSE stream of incoming events`,
            cacheInfo: `GET ${url}/cache/info — resolved Storybook cache layout (status, paths, version, namespaces)`,
            cacheList: `GET ${url}/cache/entries — list all cache entries (supports ?key=, ?keyPrefix=, ?namespace=, ?projectRoot=)`,
            cacheRead: `GET ${url}/cache/entries/<key> — read one entry by logical key`,
            cacheWrite: `PUT ${url}/cache/entries/<key> — write JSON body as cache content (supports ?namespace=, ?ttl=, ?createIfMissing=true&version=)`,
            cacheDelete: `DELETE ${url}/cache/entries/<key> — delete one entry`,
            cacheClear: `POST ${url}/cache/clear — wipe all entries`,
            cacheSwitchRoot: `POST ${url}/cache/project-root with { projectRoot } — switch the active project the dashboard inspects`,
          }
        }
        process.stderr.write(JSON.stringify(readyPayload) + '\n')
      } else if (!quiet) {
        const cacheLine = options.noCache
          ? `${blue('Cache')}        ${grey('disabled (--no-cache) — toggle on in the dashboard to re-enable')}`
          : cacheLocation.status === 'found'
            ? `${blue('Cache')}        ${cacheLocation.projectRoot} (sb ${cacheLocation.version})`
            : `${blue('Cache')}        ${grey('not detected — pass --project-root <path> or pick one in the dashboard')}`
        note(
          [
            `${green('Dashboard')}    ${url}`,
            `${blue('Event API')}    ${url}/event-log`,
            `${blue('Cache API')}    ${url}/cache/entries`,
            `${blue('SSE stream')}   ${url}/sse`,
            cacheLine,
            '',
            `Point Storybook at this collector:`,
            `STORYBOOK_TELEMETRY_URL=${url}/event-log`,
          ]
            .map(bright)
            .join('\n'),
          bright('Server running'),
        )

        log.info('Waiting for events...')
      }

      if (options.open) {
        import('node:child_process').then(({ exec }) => {
          const cmd =
            process.platform === 'darwin'
              ? 'open'
              : process.platform === 'win32'
                ? 'start'
                : 'xdg-open'
          exec(`${cmd} ${url}`)
        })
      }
    })

    // EADDRINUSE arrives asynchronously on the underlying http.Server's
    // `error` event — the synchronous serve() call above does not throw.
    // Without this listener the process crashes with an "Unhandled
    // 'error' event". Listening here lets us retry on the next port up.
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && portRetries < MAX_PORT_RETRIES) {
        const busy = port
        port = port + 1
        portRetries++
        if (jsonMode) {
          process.stderr.write(
            JSON.stringify({ status: 'port-busy', busy, retrying: port }) + '\n',
          )
        } else if (!quiet) {
          log.warn(
            `Port ${busy} is in use — trying ${port}...`,
          )
        }
        try {
          server.close()
        } catch {
          /* ignore */
        }
        startListening()
        return
      }
      if (err.code === 'EADDRINUSE') {
        log.error(
          `Could not find a free port after ${MAX_PORT_RETRIES + 1} attempts (last tried ${port}). Pass --port <port> to pick one explicitly.`,
        )
      } else {
        log.error(`Failed to start server: ${err.message}`)
      }
      process.exit(1)
    })
  }
  startListening()

  // Graceful shutdown
  const shutdown = () => {
    const sessionCount = new Set(events.map((e) => e.sessionId).filter(Boolean))
      .size

    // Close all SSE clients
    sseClients.clear()

    cacheWatchHandle?.close()

    server.close()

    if (jsonMode) {
      process.stderr.write(
        JSON.stringify({
          status: 'shutdown',
          eventsReceived: events.length,
          sessions: sessionCount,
        }) + '\n',
      )
    } else if (!quiet) {
      outro(`Captured ${events.length} events across ${sessionCount} sessions`)
    }

    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
