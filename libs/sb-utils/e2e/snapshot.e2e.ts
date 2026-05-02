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

    // Banner metadata is baked (the banner itself is rendered by Preact
    // at runtime, not pre-injected as static HTML).
    expect(html).toContain('e2e snapshot') // explanation baked
    expect(html).toMatch(/__SNAPSHOT_META__/)
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

  test('snapshot hides stale cache entries by default (bakes startedAt)', async ({
    page,
    eventLoggerWithCache,
    browser,
  }) => {
    // Use the playground project so the cache has pre-existing
    // (stale) entries. Export a snapshot WITHOUT toggling
    // showStaleCache — the snapshot should bake the live startedAt
    // so the viewer sees the same default-hidden behavior.
    await page.goto(eventLoggerWithCache.url)
    // Wait for the dashboard to settle (config + entries fetch).
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    // Confirm no stale cache events are visible in the live dashboard.
    await expect(page.locator('#cacheAllCount')).toHaveText('0')

    // Export.
    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    // The bake must include the startedAt so the snapshot's stubbed
    // /config returns it and the staleness gate fires.
    expect(html).toMatch(/__SNAPSHOT_STARTED_AT__\s*=\s*\d+/)

    // Open the snapshot in a fresh context.
    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-stale-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)
    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    await snap.goto('file://' + snapPath)
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // Stale cache entries from the playground are NOT visible by default.
    await expect(snap.locator('#cacheAllCount')).toHaveText('0')

    await ctx.close()
  })

  test('snapshot exposes the yellow attention badge when baked entries are stale', async ({
    page,
    eventLoggerWithCache,
    browser,
  }) => {
    // Export a snapshot from the playground (stale entries exist) WITHOUT
    // toggling anything. The viewer should see the same yellow
    // attention badge the exporter saw — the staleCacheCount signal
    // is populated from the stubbed /cache/entries response.
    await page.goto(eventLoggerWithCache.url)
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    await expect(page.locator('#cacheOpsGearBtn')).toHaveClass(/attention/)

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-attention-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)
    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    await snap.goto('file://' + snapPath)
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // Yellow badge present in the snapshot too.
    await expect(snap.locator('#cacheOpsGearBtn')).toHaveClass(/attention/, {
      timeout: 5_000,
    })
    // The gear popover surfaces the "N entries detected" pill.
    await snap.locator('#cacheOpsGearBtn').click()
    await expect(snap.locator('.cache-ops-menu-pill')).toContainText(/\d+ entr(?:y|ies) detected/)

    await ctx.close()
  })

  test('snapshot preserves the exporter\'s cache toggle state', async ({
    page,
    eventLoggerWithCache,
    browser,
  }) => {
    // The exporter wants the viewer to see what they saw. So if the
    // exporter had stale=on at export time, the snapshot should boot
    // with stale=on too — visible entries match the exporter's view.
    await page.goto(eventLoggerWithCache.url)
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    await page.locator('#cacheOpsGearBtn').click()
    await page.locator('.cache-ops-toggle').nth(1).click() // stale ON
    await expect(page.locator('#cacheAllCount')).not.toHaveText('0', {
      timeout: 5_000,
    })

    // Export.
    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    // Bake includes the exporter's prefs.
    expect(html).toMatch(/__SNAPSHOT_PREFS__\s*=\s*\{[^}]*"showStaleCache":\s*true/)

    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-stale-baked-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)

    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    await snap.goto('file://' + snapPath)
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // Stale entries are visible because the exporter's stale=on was
    // restored from the baked prefs.
    await expect(
      snap.locator('#eventContainer .event-card:not(.filtered-out)').first(),
    ).toBeVisible({ timeout: 5_000 })

    // Toggle inside the snapshot still flips state — viewer can hide
    // stale entries if they want. The toggle reads on initially.
    await snap.locator('#cacheOpsGearBtn').click()
    await expect(snap.locator('.cache-ops-toggle').nth(1)).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await snap.locator('.cache-ops-toggle').nth(1).click()
    await expect(
      snap.locator('#eventContainer .event-card:not(.filtered-out)'),
    ).toHaveCount(0)

    await ctx.close()
  })

  test('snapshot ignores any sessionStorage preferences from the viewing machine', async ({
    page,
    eventLogger,
    browser,
  }) => {
    // Generate a snapshot.
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-ls-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)

    // Open in a fresh context. Pre-seed both localStorage AND
    // sessionStorage with values that would change UI state if the
    // snapshot honored them — neither is supposed to bleed through.
    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    await snap.addInitScript(() => {
      try {
        localStorage.setItem('sbutils.eventlog.view', 'cache')
        localStorage.setItem('sbutils.eventlog.reconstruct', '1')
        sessionStorage.setItem('sbutils.eventlog.view', 'cache')
        sessionStorage.setItem('sbutils.eventlog.reconstruct', '1')
      } catch {
        /* noop */
      }
    })
    await snap.goto('file://' + snapPath)
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // View remained on dashboard despite the viewer's "cache" preference.
    await expect(snap.locator('#eventContainer')).toBeVisible()
    await expect(snap.locator('#cacheView')).toBeHidden()
    // Reconstruct toggle stayed off despite the viewer's "1" preference —
    // no cache-recon source attribute on any rendered card.
    await expect(snap.locator('[data-source="cache-recon"]')).toHaveCount(0)

    await ctx.close()
  })

  test('snapshot banner "View explanation" opens the explanation modal', async ({
    page,
    eventLogger,
    browser,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="html"]').click()
    await page.locator('#modalExplanationInput').fill('repro of telemetry-XYZ')
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const html = Buffer.concat(chunks).toString('utf-8')

    const dir = path.join(os.tmpdir(), 'sb-utils-e2e-explain-' + Date.now())
    mkdirSync(dir, { recursive: true })
    const snapPath = path.join(dir, 'snapshot.html')
    writeFileSync(snapPath, html)

    const ctx = await browser.newContext({})
    const snap = await ctx.newPage()
    await snap.goto('file://' + snapPath)
    await expect.poll(() => snap.evaluate(() => (window as any).__SNAPSHOT__)).toBe(true)

    // Banner should expose the explain button when an explanation was
    // baked into the snapshot.
    const explainBtn = snap.locator('.snapshot-banner .explain-btn')
    await expect(explainBtn).toBeVisible()
    await explainBtn.click()

    // Modal opens with the baked explanation text.
    await expect(snap.locator('#modalOverlay.active')).toBeVisible()
    await expect(snap.locator('#modalBody')).toContainText('repro of telemetry-XYZ')
    // Close button dismisses the modal.
    await snap.locator('#modalCloseActionBtn').click()
    await expect(snap.locator('#modalOverlay.active')).toHaveCount(0)

    await ctx.close()
  })
})
