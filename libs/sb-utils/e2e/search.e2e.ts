import { test, expect } from './fixtures'

/**
 * Search filters event cards by JSON content. The `/` shortcut focuses
 * the input; Esc clears it.
 */
test.describe('search', () => {
  test('filters cards by substring across event type and payload', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({
      eventType: 'dev',
      sessionId: 's1',
      payload: { hint: 'sparkly-needle' },
    })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 's2' })

    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(3)

    await page.locator('#searchInput').fill('sparkly-needle')
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(1)
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toContainText('dev')
  })

  test('the / shortcut focuses search and Esc clears it', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await page.keyboard.press('/')
    const input = page.locator('#searchInput')
    await expect(input).toBeFocused()
    await page.keyboard.type('boot')
    await expect(input).toHaveValue('boot')
    await page.keyboard.press('Escape')
    await expect(input).toHaveValue('')
  })

  test('search is case-insensitive', async ({ page, eventLogger }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'BOOT', sessionId: 's1' })
    await page.locator('#searchInput').fill('boot')
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(1)
  })
})
