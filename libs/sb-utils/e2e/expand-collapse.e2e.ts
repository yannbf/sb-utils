import { test, expect } from './fixtures'

/**
 * Expand/collapse — both the global toolbar toggle (E) and per-card click.
 */
test.describe('expand / collapse', () => {
  test('per-card chevron toggles the .expanded class on a single card', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({
      eventType: 'boot',
      sessionId: 's1',
      payload: { version: '10.3.5' },
    })
    const card = page.locator('#eventContainer .event-card').first()
    await expect(card).not.toHaveClass(/expanded/)
    // Click the header (the entire row) — the legacy code binds toggle on
    // .event-header, not on the chevron alone.
    await card.locator('.event-header').click()
    await expect(card).toHaveClass(/expanded/)
  })

  test('the Expand button expands every card; pressing it again collapses', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })
    await expect(page.locator('#eventContainer .event-card')).toHaveCount(2)

    await page.locator('#expandAllBtn').click()
    await expect(page.locator('#eventContainer .event-card.expanded')).toHaveCount(2)

    await page.locator('#expandAllBtn').click()
    await expect(page.locator('#eventContainer .event-card.expanded')).toHaveCount(0)
  })

  test('the E shortcut toggles expand-all', async ({ page, eventLogger }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await page.keyboard.press('e')
    await expect(page.locator('#eventContainer .event-card.expanded')).toHaveCount(1)
  })
})
