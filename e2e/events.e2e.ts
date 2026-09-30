import { test, expect } from './fixtures'

/**
 * Telemetry event ingestion: events posted to /event-log show up live in the
 * dashboard via the SSE stream, populate the event list, the type filter
 * sidebar, and the session sidebar.
 */
test.describe('telemetry event ingestion', () => {
  test('renders an event card immediately when one arrives via SSE', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await expect(page.locator('#eventCount')).toHaveText('0 events')

    await eventLogger.postEvent({
      eventType: 'boot',
      sessionId: 'sess-aaa',
      payload: { version: '10.3.5' },
    })

    await expect(page.locator('#eventContainer .event-card')).toHaveCount(1)
    await expect(page.locator('#eventCount')).toHaveText('1 event')
  })

  test('groups consecutive events from the same session under one separator', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'sess-aaa' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'sess-aaa' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 'sess-bbb' })

    await expect(page.locator('#eventContainer .event-card')).toHaveCount(3)
    await expect(page.locator('#eventContainer .session-separator')).toHaveCount(2)
  })

  test('populates the Event Types sidebar with one entry per type and counts', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })

    await expect(
      page.locator('#filterList [data-filter="boot"] .count'),
    ).toHaveText('2')
    await expect(
      page.locator('#filterList [data-filter="dev"] .count'),
    ).toHaveText('1')
    await expect(page.locator('#countAll')).toHaveText('3')
  })

  test('populates the Sessions sidebar', async ({ page, eventLogger }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'session-one' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'session-two' })

    await expect(page.locator('#sessionList .filter-item')).toHaveCount(2)
  })

  test('event card includes the type badge, index, and session pill', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({
      eventType: 'doctor',
      sessionId: 'sess-xyz',
      payload: { check: 'ok' },
    })
    const card = page.locator('#eventContainer .event-card').first()
    await expect(card).toBeVisible()
    await expect(card).toContainText('doctor')
    await expect(card).toContainText('sess-xyz')
  })
})
