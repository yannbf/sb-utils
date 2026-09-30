import { test, expect } from './fixtures'

/**
 * Pause + the buffered-while-paused counter banner.
 */
test.describe('pause / buffered counter', () => {
  test('Pause stops adding events to the visible list, banner counts buffered events', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await expect(page.locator('#eventContainer .event-card')).toHaveCount(1)

    await page.locator('#pauseBtn').click()
    // While paused, banner becomes visible and tracks new events.
    const banner = page.locator('#pausedBanner')
    await expect(banner).toHaveClass(/visible/)

    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 's1' })
    await expect(page.locator('#pausedCount')).toHaveText('2')

    // Resume drains the buffer back into the visible list.
    await page.locator('#pausedResumeBtn').click()
    await expect(banner).not.toHaveClass(/visible/)
    await expect(page.locator('#eventContainer .event-card')).toHaveCount(3)
    await expect(page.locator('#pausedCount')).toHaveText('0')
  })

  test('Space toggles paused', async ({ page, eventLogger }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await expect(page.locator('#eventContainer .event-card')).toHaveCount(1)

    await page.keyboard.press(' ')
    await expect(page.locator('#pausedBanner')).toHaveClass(/visible/)

    await page.keyboard.press(' ')
    await expect(page.locator('#pausedBanner')).not.toHaveClass(/visible/)
  })
})
