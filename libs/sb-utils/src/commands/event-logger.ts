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
import { blue, bright, grey } from '../utils/colors'
import {
  createCacheRoutes,
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
  const { port, maxEvents } = options

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

  // ── Cache integration ──────────────────────────────
  // Active cache location. Mutable because the dashboard can switch project
  // roots at runtime via POST /cache/project-root.
  let cacheLocation: CacheLocation = resolveCacheLocation({
    projectRoot: options.projectRoot ?? null,
  })
  let cacheWatchHandle: { close: () => void } | null = null

  function ingestCacheChange(change: CacheChange) {
    const eventType = change.operation === 'delete' ? 'cache:delete' : 'cache:write'
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
      process.stdout.write(JSON.stringify(stored) + '\n')
    } else if (!quiet && !options.noCache) {
      const op = change.operation.toUpperCase().padEnd(6)
      log.info(`${grey(`#${index}`)} ${blue(`cache ${op}`)} ${change.namespace}/${change.key}`)
    }

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

  // Cache-discovery poll. If the cache wasn't found when the server
  // booted (e.g. user started event-logger before storybook created
  // its cache directory), re-resolve every 2s. Once it materializes,
  // update the active location and reattach the watcher so subsequent
  // live writes flow through. Stops itself once found, and re-arms
  // automatically if the user switches project roots back to a
  // location without a cache.
  let cacheDiscoveryTimer: NodeJS.Timeout | null = null
  function startCacheDiscovery() {
    if (cacheDiscoveryTimer) return
    if (cacheLocation.status === 'found') return
    if (options.noCache || options.noCacheWatch) return
    cacheDiscoveryTimer = setInterval(() => {
      const next = resolveCacheLocation({
        projectRoot: cacheLocation.projectRoot ?? null,
      })
      if (next.status === 'found') {
        cacheLocation = next
        // Mid-session discovery: emit cold-start events so the
        // dashboard sees the just-appeared entries as legitimate
        // discoveries, not "stale data". Their mtimes will be
        // post-startedAt (since the directory itself didn't exist
        // before now), so the dashboard's staleness gate keeps them
        // visible by default.
        startCacheWatcher({ emitColdStart: true })
        if (cacheDiscoveryTimer) {
          clearInterval(cacheDiscoveryTimer)
          cacheDiscoveryTimer = null
        }
        if (!quiet) {
          log.info(
            blue('cache') +
              ' detected at ' +
              grey(next.cacheRoot ?? '(unknown)')
          )
        }
      }
    }, 2000)
    if (cacheDiscoveryTimer.unref) cacheDiscoveryTimer.unref()
  }
  startCacheDiscovery()

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
        cacheLocation = resolveCacheLocation({ projectRoot: newRoot })
        // Re-seed the watcher against the new root so subsequent writes
        // appear in the timeline immediately. User explicitly pointed
        // us here, so emit cold-start events to surface the new
        // root's existing contents — the dashboard's staleness gate
        // still hides any genuinely-stale (pre-session) entries.
        startCacheWatcher({ emitColdStart: true })
        // If the new root doesn't have a cache yet, re-arm discovery
        // so the watcher attaches automatically when storybook
        // creates it later. Likewise, stop discovery if it does have
        // one — the watcher is already attached.
        if (cacheLocation.status === 'found' && cacheDiscoveryTimer) {
          clearInterval(cacheDiscoveryTimer)
          cacheDiscoveryTimer = null
        } else if (cacheLocation.status !== 'found') {
          startCacheDiscovery()
        }
        return cacheLocation
      },
    })
  )

  // GET /config — dashboard preferences resolved from CLI flags. The UI
  // reads this once on load to pick its initial toggle states.
  app.get('/config', (c) =>
    c.json({
      cacheEnabledByDefault: !options.noCache,
      startedAt,
    })
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
      log.info(`${grey(`#${index}`)} ${blue(body.eventType)}${sessionInfo}`)
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

  try {
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
            `${blue('Dashboard')}    ${url}`,
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
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException
    if (error.code === 'EADDRINUSE') {
      log.error(
        `Port ${port} is already in use. Try a different port with --port <port>`,
      )
    } else {
      log.error(`Failed to start server: ${error.message}`)
    }
    process.exit(1)
  }

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
