import { test, expect } from './fixtures'

/**
 * Telemetry reconstruction from cache: when STORYBOOK_TELEMETRY_URL
 * isn't set, Storybook still writes its outgoing events to the
 * `dev-server/lastEvents` cache file. The dashboard reconstructs them
 * on backfill and tags each with a "cache" recon badge. As soon as a
 * real instrumented event arrives via SSE, reconstruction self-cancels
 * to avoid duplication.
 */
test.describe('telemetry reconstruction from cache', () => {
  test('reconstructs events from playground cache and shows the recon badge', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
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
    await page.goto(eventLoggerWithCache.url)
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
    await page.goto(eventLoggerWithCache.url)
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
    await page.goto(eventLoggerWithCache.url)
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
