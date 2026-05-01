import { test, expect } from './fixtures'

/**
 * When a cache:write event has both `previousContent` and `content`, the
 * dashboard renders a side-by-side diff inside the expanded card. This
 * test feeds a synthetic cache event directly via /event-log so we
 * don't need a real Storybook to flip the cache.
 */
test.describe('cache write diff rendering', () => {
  test('renders side-by-side diff when prev + next content are both present', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    // Synthetic cache:write event mimicking what watchCache produces.
    await eventLogger.postEvent({
      eventType: 'cache:write',
      _source: 'cache-watch',
      payload: {
        key: 'demo',
        namespace: 'dev-server',
        file: '.cache/storybook/dev-server/demo',
        operation: 'update',
        previousContent: { count: 1, name: 'old' },
        content: { count: 2, name: 'old' },
      },
      context: { cacheRoot: '/tmp/cache', projectRoot: '/tmp/proj' },
    })

    const card = page.locator('#eventContainer .event-card').first()
    await expect(card).toBeVisible()
    // Click the header (the entire row triggers expand).
    await card.locator('.event-header').click()
    await expect(card).toHaveClass(/expanded/)

    // Side-by-side diff body: header + rows for prev vs next.
    await expect(card.locator('.sxs-diff')).toBeVisible({ timeout: 3_000 })
    await expect(card.locator('.sxs-row').first()).toBeVisible()
  })

  test('cache:delete event is labeled as delete in the type badge', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({
      eventType: 'cache:delete',
      _source: 'cache-watch',
      payload: {
        key: 'demo',
        namespace: 'dev-server',
        operation: 'delete',
      },
    })
    const card = page.locator('#eventContainer .event-card').first()
    await expect(card).toContainText('cache:delete')
  })
})
