import { test, expect } from '@playwright/test'
import { spawn, type ChildProcess } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
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

/**
 * Cache-discovery polling — the user starts event-logger pointing at a
 * project that doesn't have a Storybook cache yet, then storybook
 * (simulated here by writing files) creates the cache directory and
 * entries while the server is running. The watcher should attach
 * automatically once the cache materializes, with no UI action needed.
 */
test.describe('cache discovery', () => {
  let tmpRoot: string
  let port: number
  let proc: ChildProcess

  test.beforeEach(async () => {
    tmpRoot = mkdtempSync(path.join(os.tmpdir(), 'sb-utils-discover-'))
    port = await freePort()
    proc = spawn(
      process.execPath,
      [
        BIN,
        'event-logger',
        '--port',
        String(port),
        '--quiet',
        '--project-root',
        tmpRoot,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    )
    proc.stdout?.on('data', () => {})
    proc.stderr?.on('data', () => {})
    await waitForReady(port)
  })

  test.afterEach(async () => {
    proc.kill('SIGTERM')
    await new Promise((r) => setTimeout(r, 50))
    try {
      rmSync(tmpRoot, { recursive: true, force: true })
    } catch {
      /* noop */
    }
  })

  test('attaches the watcher when the cache directory appears mid-session', async ({
    page,
  }) => {
    // No cache yet at start.
    const infoBefore = await (await fetch(`http://127.0.0.1:${port}/cache/info`)).json()
    expect(infoBefore.cacheStatus).toBe('not-found')

    // Boot the dashboard so we can verify a cache:write event arrives
    // via SSE once the watcher attaches.
    await page.goto(`http://127.0.0.1:${port}`)
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    // Cache events are hidden by default — flip "Show cache
    // operations" so the seed entry + live write surface as cards.
    await page.locator('#cacheOpsShowToggle').click()

    // Storybook creates the cache directory + a seed entry.
    const cacheDir = path.join(
      tmpRoot,
      'node_modules',
      '.cache',
      'storybook',
      '10.3.5',
      'default',
      'dev-server',
    )
    mkdirSync(cacheDir, { recursive: true })
    writeFileSync(
      path.join(cacheDir, 'storybook-seed.json'),
      JSON.stringify({ key: 'lastEvents', value: {} }),
    )

    // Discovery polls every 2s — wait up to 5s for the server to pick
    // it up. The seed entry created BEFORE discovery should also
    // surface (cold-start emit) — entries from a just-discovered
    // cache aren't "stale" in the user-facing sense, they're
    // newly-visible.
    await expect
      .poll(
        async () =>
          (await (await fetch(`http://127.0.0.1:${port}/cache/info`)).json())
            .cacheStatus,
        { timeout: 6_000 },
      )
      .toBe('found')
    await expect(
      page.locator('#eventContainer .event-card', { hasText: 'lastEvents' }),
    ).toHaveCount(1, { timeout: 5_000 })

    // A NEW write after the watcher is attached emits a live
    // cache:write event via SSE — no reload required.
    writeFileSync(
      path.join(cacheDir, 'storybook-live.json'),
      JSON.stringify({ key: 'live-key', value: { hello: 'world' } }),
    )

    await expect(
      page.locator('#eventContainer .event-card', { hasText: 'live-key' }),
    ).toHaveCount(1, { timeout: 5_000 })
  })
})
