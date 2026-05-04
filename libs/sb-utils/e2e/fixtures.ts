import { test as base, expect } from '@playwright/test'
import { spawn, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import net from 'node:net'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..')
const BIN = path.join(REPO_ROOT, 'dist/bin.mjs')

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.unref()
    srv.on('error', reject)
    srv.listen(0, () => {
      const port = (srv.address() as net.AddressInfo).port
      srv.close(() => resolve(port))
    })
  })
}

async function waitForReady(port: number, timeoutMs = 10_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/`)
      if (r.ok) return
    } catch {
      /* not yet */
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error(`event-logger on :${port} did not become ready in ${timeoutMs}ms`)
}

export type EventLoggerHandle = {
  port: number
  url: string
  proc: ChildProcess
  /** Post a telemetry event from the test process. */
  postEvent: (body: Record<string, unknown>) => Promise<void>
  /** Force a clear via the API. */
  clear: () => Promise<void>
}

type Fixtures = {
  eventLogger: EventLoggerHandle
  /** Variant: spawned with --project-root pointing at libs/sb-utils/mocks. */
  eventLoggerWithCache: EventLoggerHandle
}

async function spawnLogger(extraArgs: string[] = []): Promise<EventLoggerHandle> {
  const port = await freePort()
  const proc = spawn(
    process.execPath,
    [BIN, 'event-logger', '--port', String(port), '--quiet', ...extraArgs],
    {
      // Spawn from /tmp so the CLI's cache auto-resolution doesn't latch
      // onto a stray Storybook cache under the repo (sb-utils itself, or
      // the mocks fixture). Tests that *want* a real cache pass an
      // explicit --project-root via `eventLoggerWithCache`.
      cwd: '/tmp',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  // Drain output so the pipe doesn't fill.
  proc.stdout?.on('data', () => {})
  proc.stderr?.on('data', () => {})
  await waitForReady(port)
  const url = `http://127.0.0.1:${port}`
  return {
    port,
    url,
    proc,
    postEvent: async (body) => {
      const r = await fetch(`${url}/event-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error(`postEvent failed: ${r.status}`)
    },
    clear: async () => {
      await fetch(`${url}/clear`, { method: 'POST' })
    },
  }
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  eventLogger: async ({}, use) => {
    const handle = await spawnLogger()
    try {
      await use(handle)
    } finally {
      handle.proc.kill('SIGTERM')
      await new Promise((r) => setTimeout(r, 50))
    }
  },
  // eslint-disable-next-line no-empty-pattern
  eventLoggerWithCache: async ({}, use) => {
    const handle = await spawnLogger([
      '--project-root',
      path.join(REPO_ROOT, 'mocks'),
    ])
    try {
      await use(handle)
    } finally {
      handle.proc.kill('SIGTERM')
      await new Promise((r) => setTimeout(r, 50))
    }
  },
})

export { expect }
