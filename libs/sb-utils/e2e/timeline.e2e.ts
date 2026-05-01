import { test, expect } from './fixtures'

/**
 * Timeline view — canvas-based with sidebar filters that share state with
 * the dashboard view. Switching tabs preserves filters.
 */
test.describe('timeline view', () => {
  test('switching to Timeline shows canvases and the LIVE pill', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })

    await page.locator('[data-view="timeline"]').click()
    await expect(page.locator('#timelineView')).toBeVisible()
    await expect(page.locator('#tlContentCanvas')).toBeVisible()
    await expect(page.locator('#tlAxisCanvas')).toBeVisible()
    await expect(page.locator('#tlLive')).toBeVisible()
  })

  test('Timeline tab persists when switching to Cache and back', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await page.locator('[data-view="timeline"]').click()
    await expect(page.locator('#timelineView')).toBeVisible()
    await page.locator('[data-view="cache"]').click()
    await expect(page.locator('#cacheView')).toBeVisible()
    await page.locator('[data-view="timeline"]').click()
    await expect(page.locator('#timelineView')).toBeVisible()
  })

  test('sidebar filters apply on the Timeline view too', async ({
    page,
    eventLogger,
  }) => {
    // Filter applied in dashboard view should carry over to timeline —
    // both views read from the same `state.activeFilter`. We verify by
    // checking the filter row stays "active" across view switches.
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })

    await page.locator('#filterList [data-filter="dev"] .label-row').click()
    await expect(
      page.locator('#filterList [data-filter="dev"]'),
    ).toHaveClass(/active/)

    await page.locator('[data-view="timeline"]').click()
    await expect(
      page.locator('#filterList [data-filter="dev"]'),
    ).toHaveClass(/active/)
  })

  test('"Fit all" button is present in the timeline toolbar', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await page.locator('[data-view="timeline"]').click()
    await expect(page.locator('#tlFitBtn')).toBeVisible()
  })

  test('V keyboard shortcut toggles between dashboard and timeline', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await page.keyboard.press('v')
    await expect(page.locator('#timelineView')).toBeVisible()
    await page.keyboard.press('v')
    await expect(page.locator('#eventContainer')).toBeVisible()
    await expect(page.locator('#timelineView')).toBeHidden()
  })
})
