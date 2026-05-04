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

  test('reconstructs events from mocks cache and shows the recon badge', async ({
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
    // Cache events are hidden by default — flip "Show cache operations"
    // on so the synthetic cache:write cards become visible in the
    // dashboard list, then assert at least one rendered.
    await page.locator('#cacheOpsShowToggle').click()
    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]').first(),
    ).toBeVisible({ timeout: 5_000 })
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
 * flips the inline "Reconstruct telemetry from cache" toggle in the
 * Cache Operations sidebar — synthetic events appear immediately (no
 * reload required).
 */
test.describe('reconstruction toggle (opt-in via sidebar)', () => {
  test('boots with no recon badges when the toggle is off', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Wait long enough for backfill to have run.
    await page.waitForTimeout(800)
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)
  })

  test('flipping reconstruct ON only surfaces recent telemetry; needs stale toggle for old data', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // Reconstruction respects the staleness gate: with stale=off
    // (default), only telemetry events at-or-after the server's
    // startedAt are reconstructed. The mocks' lastEvents file is
    // entirely pre-existing, so reconstruct alone yields zero events.
    // Flipping stale also brings the older entries through.
    await page.goto(eventLoggerWithCache.url)
    await page.waitForTimeout(800)
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)

    await page.locator('#cacheOpsReconstructToggle').click()
    await expect(page.locator('#cacheOpsReconstructToggle')).toHaveAttribute(
      'aria-checked',
      'true',
    )
    // Stale is still off — mocks' pre-existing lastEvents entries are
    // skipped.
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)

    // Now flip stale on — the previously-skipped entries get
    // reconstructed in the same flow.
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
  })

  test('toggling reconstruct ON does not auto-flip "Show cache operations"', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // The three toggles are independent — turning reconstruct on
    // surfaces cache-recon events (which aren't gated by
    // cacheAllHidden) but leaves the "Show cache operations" toggle
    // in whatever state the user left it in.
    await page.goto(eventLoggerWithCache.url)
    await expect(page.locator('#cacheOpsShowToggle')).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await page.locator('#cacheOpsReconstructToggle').click()
    await expect(page.locator('#cacheOpsReconstructToggle')).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.locator('#cacheOpsShowToggle')).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  test('toggling reconstruction OFF removes previously-reconstructed events', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Flip both reconstruct + stale ON so the mocks' pre-existing
    // lastEvents content is reconstructed.
    await page.locator('#cacheOpsReconstructToggle').click()
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    const reconCount = await page.locator('.event-recon-badge').count()
    expect(reconCount).toBeGreaterThan(0)

    // Flip reconstruct OFF — every reconstructed event should disappear.
    await page.locator('#cacheOpsReconstructToggle').click()
    await expect(page.locator('#cacheOpsReconstructToggle')).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)
  })

  test('toggling stale OFF after both were on drops stale cache:write AND stale cache-recon events', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // Show cache + reconstruct + stale all on → reconstruction +
    // stale cache:write entries visible.
    await page.goto(eventLoggerWithCache.url)
    await page.locator('#cacheOpsShowToggle').click()
    await page.locator('#cacheOpsReconstructToggle').click()
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]').first(),
    ).toBeVisible({ timeout: 5_000 })
    const initialRecon = await page.locator('.event-recon-badge').count()
    expect(initialRecon).toBeGreaterThan(0)

    // Flip stale off — should drop both stale cache:write events
    // (cache cards → 0) AND stale cache-recon events (no badges left).
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]'),
    ).toHaveCount(0)
    await expect(page.locator('.event-recon-badge')).toHaveCount(0)
    // Reconstruct toggle stayed on — flipping stale on again brings
    // the recon events back (round-trip test).
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
  })

  test('"Show stale cache data" toggle is hidden when no stale data exists', async ({
    page,
    eventLogger,
  }) => {
    // No project root → no cache entries → no stale row in the section.
    // The other two toggles ("Show cache operations" + "Reconstruct")
    // still render.
    await page.goto(eventLogger.url)
    await expect(page.locator('#cacheOpsShowToggle')).toBeVisible()
    await expect(page.locator('#cacheOpsReconstructToggle')).toBeVisible()
    await expect(page.locator('#cacheOpsStaleToggle')).toHaveCount(0)
  })

  test('"Show stale cache data" row mentions the detected entry count', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.waitForFunction(
      () => sessionStorage.getItem('sbutils.eventlog.session') != null,
      undefined,
      { timeout: 5_000 },
    )
    // The pill renders next to the "Show stale cache data" title.
    await expect(page.locator('.cache-ops-menu-pill')).toContainText(
      /\d+ entr(?:y|ies) detected/,
      { timeout: 5_000 },
    )
  })

  test('preferences live in sessionStorage and reset across server restarts', async ({
    page,
    eventLogger,
  }) => {
    // Use the no-cache fixture so the stale-data row doesn't render.
    await page.goto(eventLogger.url)
    await page.locator('#cacheOpsReconstructToggle').click()
    await expect(page.locator('#cacheOpsReconstructToggle')).toHaveAttribute(
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
    // The pref should be gone — the toggle reads OFF after reload.
    await expect(page.locator('#cacheOpsReconstructToggle')).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  test('show-stale-cache toggle materializes pre-existing cache entries', async ({
    page,
    eventLoggerWithCache,
  }) => {
    // The mocks' cache files were written long before the test server
    // booted, so they're stale by definition. With the default off
    // (and "Show cache operations" also off), they don't appear in the
    // dashboard. Flipping both surfaces them.
    await page.goto(eventLoggerWithCache.url)
    await page.waitForTimeout(800)
    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]'),
    ).toHaveCount(0)

    await page.locator('#cacheOpsShowToggle').click()
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(page.locator('#cacheOpsStaleToggle')).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]').first(),
    ).toBeVisible({ timeout: 5_000 })

    // Flip stale OFF — pre-existing entries vanish again.
    await page.locator('#cacheOpsStaleToggle').click()
    await expect(
      page.locator('#eventContainer .event-card[data-cache-event="true"]'),
    ).toHaveCount(0)
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

    // Now flip both toggles — reconstruct + stale — so the mocks'
    // pre-existing lastEvents content is replayed even though a real
    // event already landed first.
    await page.locator('#cacheOpsReconstructToggle').click()
    await page.locator('#cacheOpsStaleToggle').click()

    // Recon badges show up — mocks' lastEvents was replayed despite
    // real telemetry having arrived first.
    await expect(page.locator('.event-recon-badge').first()).toBeVisible({
      timeout: 5_000,
    })
  })
})
