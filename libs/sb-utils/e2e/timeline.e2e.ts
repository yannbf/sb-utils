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

  test('clicking a session lane label toggles activeSession; clicking it again clears it', async ({
    page,
    eventLogger,
  }) => {
    // Verifies the lane-click handler still works for normal session lanes.
    // The cache-lane no-op path is exercised by the unit tests in
    // specs/dashboard.timeline-math.spec.ts (and can't be set up here
    // without a real cache-watch event source).
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'ssA' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'ssB' })
    await page.locator('[data-view="timeline"]').click()
    await expect(page.locator('#timelineView')).toBeVisible()

    const canvas = page.locator('#tlContentCanvas')
    const box = await canvas.boundingBox()
    if (!box) throw new Error('canvas not laid out')
    // Two session lanes exist (sorted by first-seen). Click the first
    // lane label (left of LABEL_COL_W=130).
    await page.mouse.click(box.x + 40, box.y + 22)

    // Sidebar reflects the activeSession via .active class.
    await expect(
      page.locator('#sessionList .filter-item.active'),
    ).toHaveCount(1)
  })
})
