import { test, expect } from './fixtures'

/**
 * Telemetry reconstruction from cache: when STORYBOOK_TELEMETRY_URL
 * isn't set, Storybook still writes its outgoing events to the
 * `dev-server/lastEvents` cache file. The dashboard reconstructs them
 * on backfill and tags each with a "cache" recon badge. As soon as a
 * real instrumented event arrives via SSE, reconstruction self-cancels
 * to avoid duplication.
 *
 * Reconstruction is opt-in (off by default) — these tests flip the
 * persisted `sbutils.eventlog.reconstruct` flag before navigation so
 * the boot sequence picks it up.
 */
test.describe('telemetry reconstruction from cache', () => {
  // Prefs now live in sessionStorage, namespaced by the server's
  // startedAt (see lib/session-storage.ts). We can't pre-seed them via
  // addInitScript because the runtime rotates the session on first
  // boot, wiping any keys whose session id doesn't match. So we do an
  // initial load to let the rotation stamp the right session id, then
  // write the prefs and reload — the second load picks them up.
  async function bootWithPrefs(
    page: import('@playwright/test').Page,
    url: string,
  ) {
    await page.goto(url)
    // Wait for the runtime to settle (config fetch + rotation).
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    await page.evaluate(() => {
      sessionStorage.setItem('sbutils.eventlog.reconstruct', '1')
      sessionStorage.setItem('sbutils.eventlog.showStaleCache', '1')
    })
    await page.reload()
  }

  test('reconstructs events from playground cache and shows the recon badge', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await bootWithPrefs(page, eventLoggerWithCache.url)
    // Backfill is async — wait for the recon badge to appear.
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    const reconCount = await page.locator('.event-recon-badge').count()
    expect(reconCount).toBeGreaterThan(0)
  })

  test('reconstructed events are flagged as cache-recon and show the cache label', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await bootWithPrefs(page, eventLoggerWithCache.url)
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    await expect(
      page.locator('[data-source="cache-recon"]').first(),
    ).toBeVisible()
  })

  test('cache backfill creates synthetic cache:write entries for existing files', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await bootWithPrefs(page, eventLoggerWithCache.url)
    // Cache Operations sidebar should be non-empty after backfill.
    await expect(page.locator('#cacheAllCount')).not.toHaveText('0', {
      timeout: 5_000,
    })
    const allOpsCount = await page
      .locator('#cacheAllCount')
      .textContent()
    expect(Number(allOpsCount)).toBeGreaterThan(0)
  })

  test('a real telemetry event arriving via SSE coexists with reconstructed ones', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await bootWithPrefs(page, eventLoggerWithCache.url)
    // Wait for backfill to finish.
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    const reconCount = await page.locator('.event-recon-badge').count()

    // Now post a real telemetry event — this should land in the timeline
    // alongside reconstructed ones, AND not get a recon badge.
    await eventLoggerWithCache.postEvent({
      eventType: 'real-event',
      sessionId: 'real-sess',
      payload: { live: true },
    })

    // The new event must appear (at least one card contains "real-event")
    // and must NOT carry a recon badge.
    await expect(
      page.locator('#eventContainer .event-card', { hasText: 'real-event' }),
    ).toHaveCount(1)
    const realCard = page
      .locator('#eventContainer .event-card', { hasText: 'real-event' })
      .first()
    await expect(realCard.locator('.event-recon-badge')).toHaveCount(0)
    // Total recon-badge count is unchanged.
    const reconAfter = await page.locator('.event-recon-badge').count()
    expect(reconAfter).toBe(reconCount)
  })
})

/**
 * Reconstruction is opt-in: by default no recon badges show. The user
 * has to flip the toggle in the Cache Operations gear menu — at which
 * point the synthetic events appear immediately (no reload required).
 */
test.describe('reconstruction toggle (opt-in via gear menu)', () => {
  test('boots with no recon badges when the toggle is off', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Wait long enough for backfill to have run.
    await page.waitForTimeout(800)
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)
  })

  test('flipping the gear toggle reconstructs telemetry immediately', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.waitForTimeout(800)
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)

    // Open the gear popover and flip the reconstruct toggle on.
    await page.locator('#cacheOpsGearBtn').click()
    await expect(page.locator('.cache-ops-menu')).toBeVisible()
    await page.locator('.cache-ops-toggle').first().click()
    await expect(page.locator('.cache-ops-toggle').first()).toHaveAttribute('aria-checked', 'true')

    // Recon events appear without a reload.
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
  })

  test('toggling reconstruction ON un-hides cache events if they were hidden', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // First hide cache manually so we have something for reconstruct
    // to un-hide.
    const cacheRow = page.locator('[data-cache-key="__all__"]')
    await cacheRow.hover()
    await page.locator('#cacheAllEyeBtn').click()
    await expect(cacheRow).toHaveClass(/hidden-item/)

    // Toggle reconstruction. The first .cache-ops-toggle is the
    // reconstruct one (rows are stable in CacheOpsMenu).
    await page.locator('#cacheOpsGearBtn').click()
    await page.locator('.cache-ops-toggle').first().click()

    await expect(cacheRow).not.toHaveClass(/hidden-item/)
  })

  test('toggling reconstruction OFF removes previously-reconstructed events', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Flip ON. Reconstruct toggle is the first row in the gear popover.
    await page.locator('#cacheOpsGearBtn').click()
    const reconstructToggle = page.locator('.cache-ops-toggle').first()
    await reconstructToggle.click()
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    const reconCount = await page.locator('.event-recon-badge').count()
    expect(reconCount).toBeGreaterThan(0)

    // Flip OFF — every reconstructed event should disappear.
    await reconstructToggle.click()
    await expect(reconstructToggle).toHaveAttribute('aria-checked', 'false')
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)
  })

  test('cache-options gear shows a badge when any toggle is on', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Default: no badge.
    await expect(page.locator('#cacheOpsGearBtn .cache-ops-gear-dot')).toHaveCount(0)
    await expect(page.locator('#cacheOpsGearBtn')).not.toHaveClass(/modified/)

    // Flip a toggle.
    await page.locator('#cacheOpsGearBtn').click()
    await page.locator('.cache-ops-toggle').first().click()

    await expect(page.locator('#cacheOpsGearBtn .cache-ops-gear-dot')).toHaveCount(1)
    await expect(page.locator('#cacheOpsGearBtn')).toHaveClass(/modified/)

    // Flip back off.
    await page.locator('.cache-ops-toggle').first().click()
    await expect(page.locator('#cacheOpsGearBtn .cache-ops-gear-dot')).toHaveCount(0)
  })

  test('preferences live in sessionStorage and reset across server restarts', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.locator('#cacheOpsGearBtn').click()
    await page.locator('.cache-ops-toggle').first().click()
    await expect(page.locator('.cache-ops-toggle').first()).toHaveAttribute(
      'aria-checked',
      'true',
    )

    // sessionStorage: holds reconstruct + a session id; localStorage:
    // empty (we no longer write there).
    const stored = await page.evaluate(() => ({
      sReconstruct: sessionStorage.getItem('sbutils.eventlog.reconstruct'),
      sSession: sessionStorage.getItem('sbutils.eventlog.session'),
      lReconstruct: localStorage.getItem('sbutils.eventlog.reconstruct'),
    }))
    expect(stored.sReconstruct).toBe('1')
    expect(stored.sSession).not.toBeNull()
    expect(stored.lReconstruct).toBeNull()

    // Simulate a server restart by stamping a different session id and
    // reloading: the runtime should wipe our pref.
    await page.evaluate(() => {
      sessionStorage.setItem('sbutils.eventlog.session', '0')
    })
    await page.reload()
    // The pref should be gone — open the gear menu and check the
    // toggle reads OFF.
    await page.locator('#cacheOpsGearBtn').click()
    await expect(page.locator('.cache-ops-toggle').first()).toHaveAttribute(
      'aria-checked',
      'false',
    )
    // And the badge should be cleared.
    await expect(page.locator('#cacheOpsGearBtn .cache-ops-gear-dot')).toHaveCount(0)
  })

  test('show-stale-cache toggle materializes pre-existing cache entries', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // The playground's cache files were written long before the test
    // server booted, so they're stale by definition. With the default
    // off they don't appear in the Cache Operations sidebar. Toggling
    // the second gear option on backfills them.
    await page.goto(eventLoggerWithCache.url)
    // Wait for boot to settle (config + entries fetch).
    await page.waitForTimeout(800)
    await expect(page.locator('#cacheAllCount')).toHaveText('0')

    await page.locator('#cacheOpsGearBtn').click()
    // Show-stale-cache is the second row in the gear popover.
    const staleToggle = page.locator('.cache-ops-toggle').nth(1)
    await staleToggle.click()
    await expect(staleToggle).toHaveAttribute('aria-checked', 'true')

    await expect(page.locator('#cacheAllCount')).not.toHaveText('0', {
      timeout: 5_000,
    })

    // Flip OFF — pre-existing entries vanish again.
    await staleToggle.click()
    await expect(page.locator('#cacheAllCount')).toHaveText('0')
  })

  test('toggle ON replays cache even after a real telemetry event has been seen', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // Establishes the user-opt-in pathway: even after realTelemetryDetected
    // has flipped (because a live telemetry event arrived), explicitly
    // turning the toggle on replays the existing cache. The live-path
    // gate stays off; only the explicit on-toggle replay bypasses it.
    await page.goto(eventLoggerWithCache.url)
    await eventLoggerWithCache.postEvent({
      eventType: 'live-event',
      sessionId: 'live',
    })
    // Wait for that real event to land + flip realTelemetryDetected.
    await expect(
      page.locator('#eventContainer .event-card', { hasText: 'live-event' }),
    ).toHaveCount(1, { timeout: 5_000 })
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)

    // Now flip the toggle.
    await page.locator('#cacheOpsGearBtn').click()
    await page.locator('.cache-ops-toggle').first().click()

    // Recon badges show up — playground's lastEvents was replayed
    // despite real telemetry having arrived first.
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
  })
})
