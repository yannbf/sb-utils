import { test, expect } from './fixtures'
import path from 'node:path'
import { writeFileSync, mkdirSync } from 'node:fs'
import os from 'node:os'

/**
 * HTML snapshot export — produces a self-contained interactive replica of
 * the live dashboard with events baked in, network stubbed, and live-only
 * controls hidden. Tests both the structural guarantees (single file, no
 * external links/scripts) and the *interactive* guarantee (the snapshot
 * file, opened in a separate page, must render the baked events and let
 * users navigate views without making network requests).
 */
test.describe('HTML snapshot export', () => {
  test('produces a self-contained HTML with baked events and runtime stubs', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'snap-s1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'snap-s1' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 'snap-s2' })

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    await page.locator('#modalExplanationInput').fill('e2e snapshot')

    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    // Self-contained — no external resources.
    expect(html).not.toMatch(/<link[^>]*href=/i)
    expect(html).not.toMatch(/<script[^>]*src=/i)

    // Snapshot mode + baked state.
    expect(html).toMatch(/window\.__SNAPSHOT__\s*=\s*true/)
    expect(html).toMatch(/__SNAPSHOT_EVENTS__/)
    expect(html).toMatch(/"eventType":"boot"/)
    expect(html).toMatch(/"eventType":"dev"/)
    expect(html).toMatch(/"eventType":"error"/)
    expect(html).toMatch(/window\.fetch\s*=\s*function/)
    expect(html).toMatch(/NoopES/) // EventSource stub

    // Bootstrap script must run before the deferred module script.
    const bootstrapIdx = html.indexOf('window.__SNAPSHOT__')
    const moduleIdx = html.search(/<script[^>]*type="module"/)
    expect(bootstrapIdx).toBeGreaterThan(0)
    expect(bootstrapIdx).toBeLessThan(moduleIdx)

    // Snapshot banner injected.
    expect(html).toContain('class="snapshot-banner"')
    expect(html).toContain('e2e snapshot') // explanation baked
  })

  test('exported snapshot is interactive — events render and tabs work without a server', async ({
    page,
    eventLogger,
    browser,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'snap-s1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'snap-s1' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 'snap-s2' })

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    // Write snapshot to disk and open it in a fresh browser context — no
    // event-logger server reachable, so any unstubbed network call would
    // fail. The snapshot must work entirely from baked state.
    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-snapshot-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)

    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    const failedRequests: string[] = []
    snap.on('requestfailed', (r) => failedRequests.push(r.url()))
    await snap.goto('file://' + snapPath)

    // Bake metadata exposes itself synchronously.
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // Events render.
    await expect(snap.locator('#eventContainer .event-card')).toHaveCount(3)
    await expect(snap.locator('#eventCount')).toHaveText('3 events')

    // Snapshot banner visible.
    await expect(snap.locator('.snapshot-banner')).toBeVisible()
    // Live-only controls hidden.
    await expect(snap.locator('#pauseBtn')).toBeHidden()
    await expect(snap.locator('#clearBtn')).toBeHidden()

    // Switch views — Timeline canvas should mount.
    await snap.locator('[data-view="timeline"]').click()
    await expect(snap.locator('#timelineView')).toBeVisible()
    await expect(snap.locator('#tlContentCanvas')).toBeVisible()

    // No HTTP requests should have been made to localhost during snapshot
    // boot — fetch is stubbed and EventSource is a noop.
    expect(failedRequests.filter((u) => /localhost|127\.0\.0\.1/.test(u))).toEqual([])

    await ctx.close()
  })
})
