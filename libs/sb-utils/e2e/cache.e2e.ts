import { test, expect } from './fixtures'

/**
 * Cache view — uses the playground project's pre-existing Storybook cache
 * for entries, and the watcher emits cache events live to the dashboard.
 */
test.describe('cache view', () => {
  test('shows "No Storybook cache detected" when no project root resolves', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await page.locator('[data-view="cache"]').click()
    await expect(page.locator('#cacheView')).toBeVisible()
    await expect(page.locator('#cacheEmpty')).toBeVisible()
    await expect(page.locator('#cacheEmpty')).toContainText('No Storybook cache detected')
  })

  test('lists cache entries when a project root with a Storybook cache is provided', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.locator('[data-view="cache"]').click()
    // Playground has at least dev-server/lastEvents + telemetry entries.
    await expect(page.locator('#cacheEntries .cache-entry').first()).toBeVisible({
      timeout: 5_000,
    })
    const entryCount = await page.locator('#cacheEntries .cache-entry').count()
    expect(entryCount).toBeGreaterThan(0)
  })

  test('reports the resolved Storybook cache path and version in the toolbar', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.locator('[data-view="cache"]').click()
    await expect(page.locator('#cacheRootStatus')).toContainText('Active')
    await expect(page.locator('#cacheRootPath')).toContainText('playground')
    await expect(page.locator('#cacheRootVersion')).toContainText('sb 10.3.5')
  })

  test('cache events from the watcher show up in the Cache Operations sidebar', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    // Backfill produces at least one cache:write per entry — we just need
    // the master "All operations" count to update.
    await expect(page.locator('#cacheAllCount')).not.toHaveText('0', {
      timeout: 5_000,
    })
  })

  test('Edit mode toggle reveals Edit/Delete buttons + Clear cache', async ({
    page,
    eventLoggerWithCache,
  }) => {
    await page.goto(eventLoggerWithCache.url)
    await page.locator('[data-view="cache"]').click()
    const firstEntry = page.locator('#cacheEntries .cache-entry').first()
    await expect(firstEntry).toBeVisible({ timeout: 5_000 })
    // Cache entries are collapsed by default — expand one so its action
    // buttons render in the DOM (they only render when the body is
    // visible).
    await firstEntry.locator('.cache-entry-header').click()
    await expect(firstEntry).toHaveClass(/expanded/)

    // Initially Edit / Delete are absent (only Copy is shown).
    await expect(page.locator('#cacheClearBtn')).toHaveCount(0)
    await expect(
      firstEntry.locator('.cache-entry-actions [data-action="edit"]'),
    ).toHaveCount(0)
    await expect(
      firstEntry.locator('.cache-entry-actions [data-action="copy"]'),
    ).toBeVisible()

    // Flip the toggle.
    await page.locator('#cacheEditToggleRow').click()
    await expect(page.locator('#cacheEditToggleSwitch.on')).toBeVisible()
    await expect(page.locator('#cacheClearBtn')).toBeVisible()
    await expect(page.locator('#cacheWritesBanner')).toBeVisible()
    await expect(
      firstEntry.locator('.cache-entry-actions [data-action="edit"]'),
    ).toBeVisible()
    await expect(
      firstEntry.locator('.cache-entry-actions [data-action="delete"]'),
    ).toBeVisible()

    // Toggle off — they go away again.
    await page.locator('#cacheEditToggleRow').click()
    await expect(page.locator('#cacheClearBtn')).toHaveCount(0)
    await expect(
      firstEntry.locator('.cache-entry-actions [data-action="edit"]'),
    ).toHaveCount(0)
  })
})
