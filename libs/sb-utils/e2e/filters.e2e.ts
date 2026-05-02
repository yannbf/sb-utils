import { test, expect } from './fixtures'

/**
 * Sidebar filtering: click an event-type row to filter the main list to
 * only that type; click "All events" to reset. EYE buttons hide a type
 * (subtractive filter), DEL buttons remove it server- and client-side.
 */
test.describe('sidebar filtering', () => {
  test('clicking an event-type row filters the main list to that type', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 's1' })
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(3)

    await page.locator('#filterList [data-filter="dev"] .label-row').click()
    const visibleCards = page.locator('#eventContainer .event-card:not(.filtered-out)')
    await expect(visibleCards).toHaveCount(1)
    await expect(visibleCards.first()).toContainText('dev')

    await page.locator('#filterList [data-filter="all"] .label-row').click()
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(3)
  })

  test('clicking a session row filters by sessionId', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 'sess-aaa' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 'sess-bbb' })
    await page.locator('#sessionList .filter-item').first().click()
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(1)
  })

  test('eye button on a type hides every card of that type', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })

    // Sidebar action buttons are display:none until row hover. Hover the row
    // to reveal the actions, then click.
    const bootRow = page.locator('#filterList [data-filter="boot"]')
    await bootRow.hover()
    await bootRow.locator('.eye-btn').click()
    const visible = page.locator('#eventContainer .event-card:not(.filtered-out)')
    await expect(visible).toHaveCount(1)
    await expect(visible.first()).toContainText('dev')
  })

  test('master "All events" eye toggle hides every telemetry event', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })

    // The master row's actions are also hover-revealed.
    const allRow = page.locator('#filterList [data-filter="all"]')
    await allRow.hover()
    await allRow.locator('#eventsAllEyeBtn').click()
    await expect(page.locator('#eventContainer .event-card:not(.filtered-out)')).toHaveCount(0)
  })

  test('event index reflects visible-only ordering when cache is hidden', async ({
    page,
    eventLogger,
  }) => {
    // Posting cache + telemetry events together, then hiding cache,
    // should number the visible (telemetry-only) cards as #1, #2, #3 —
    // not #1 #4 #6 with gaps for the hidden ones.
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({
      eventType: 'cache:write',
      _source: 'cache-watch',
      payload: { namespace: 'ns', key: 'k1', operation: 'create', content: { v: 1 } },
    } as any)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })
    await eventLogger.postEvent({
      eventType: 'cache:write',
      _source: 'cache-watch',
      payload: { namespace: 'ns', key: 'k2', operation: 'create', content: { v: 2 } },
    } as any)
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })
    await eventLogger.postEvent({ eventType: 'error', sessionId: 's1' })

    // Hide cache via the master "All operations" eye toggle.
    const cacheRow = page.locator('[data-cache-key="__all__"]')
    await cacheRow.hover()
    await page.locator('#cacheAllEyeBtn').click()

    const visibleCards = page.locator('#eventContainer .event-card:not(.filtered-out)')
    await expect(visibleCards).toHaveCount(3)

    const indices = await visibleCards.locator('.event-index').allTextContents()
    expect(indices).toEqual(['#1', '#2', '#3'])
  })
})
