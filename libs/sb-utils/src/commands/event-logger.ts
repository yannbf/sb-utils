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
import { blue, grey } from '../utils/colors'

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

  // Load and cache dashboard HTML at startup
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const htmlPaths = [
    path.join(__dirname, '..', 'event-log-dashboard.html'),
    path.join(__dirname, 'event-log-dashboard.html'),
  ]
  const htmlPath = htmlPaths.find((p) => fs.existsSync(p))
  if (!htmlPath) {
    log.error('Could not find event-log-dashboard.html')
    process.exit(1)
  }
  const cachedHtml = fs.readFileSync(htmlPath, 'utf-8').replaceAll('{{PORT}}', String(port))

  const app = new Hono()

  // Global CORS — this is a debug tool, allow all origins
  app.use('*', cors())

  // Dashboard UI (cached, no file read per request)
  app.get('/', (c) => {
    return c.html(cachedHtml)
  })

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
    const storedEvent: StoredEvent = { ...body, _index: index, _receivedAt: Date.now() }

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
        }
        if (detectedAgent) {
          readyPayload.agent = detectedAgent
          readyPayload.usage = {
            capture: `Run any Storybook command with STORYBOOK_TELEMETRY_URL=${url}/event-log to capture events`,
            queryAll: `GET ${url}/event-log — all captured events (supports ?type=<eventType>&sessionId=<id> filters)`,
            queryCount: `GET ${url}/event-log/count — event count summary by type and session`,
            clear: `POST ${url}/clear — delete all captured events`,
            stream: `GET ${url}/sse — real-time SSE stream of incoming events`,
          }
        }
        process.stderr.write(JSON.stringify(readyPayload) + '\n')
      } else if (!quiet) {
        note(
          [
            `${blue('Dashboard')}    ${url}`,
            `${blue('Event API')}    ${url}/event-log`,
            `${blue('SSE stream')}   ${url}/sse`,
            '',
            `Point Storybook at this collector:`,
            grey(`STORYBOOK_TELEMETRY_URL=${url}/event-log`),
          ].join('\n'),
          'Server running',
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
      log.error(`Port ${port} is already in use. Try a different port with --port <port>`)
    } else {
      log.error(`Failed to start server: ${error.message}`)
    }
    process.exit(1)
  }

  // Graceful shutdown
  const shutdown = () => {
    const sessionCount = new Set(events.map((e) => e.sessionId).filter(Boolean)).size

    // Close all SSE clients
    sseClients.clear()

    server.close()

    if (jsonMode) {
      process.stderr.write(
        JSON.stringify({ status: 'shutdown', eventsReceived: events.length, sessions: sessionCount }) + '\n',
      )
    } else if (!quiet) {
      outro(`Captured ${events.length} events across ${sessionCount} sessions`)
    }

    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
