import { test, expect } from './fixtures'

/**
 * JSON export + import round-trip. The export modal generates a payload
 * shaped like `{ version, explanation, events }` that the import endpoint
 * can re-ingest.
 */
test.describe('JSON export / import', () => {
  test('Export → Export as JSON downloads a file with the captured events', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1', payload: { v: 1 } })
    await eventLogger.postEvent({ eventType: 'dev', sessionId: 's1' })
    await expect(page.locator('#eventCount')).toHaveText('2 events')

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="json"]').click()

    // Save modal: keep default filename, click Save and capture the download.
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const json = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    expect(json.version).toBe(1)
    expect(json.events).toHaveLength(2)
    expect(json.events[0].eventType).toBe('boot')
    expect(json.events[1].eventType).toBe('dev')
  })

  test('JSON export includes the entered explanation', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    await eventLogger.postEvent({ eventType: 'boot', sessionId: 's1' })

    await page.locator('#exportBtn').click()
    await page.locator('[data-export="json"]').click()
    await page.locator('#modalExplanationInput').fill('repro of issue 99')

    const downloadPromise = page.waitForEvent('download')
    await page.locator('#modalSubmitBtn').click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const c of stream) chunks.push(c as Buffer)
    const json = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    expect(json.explanation).toBe('repro of issue 99')
  })

  test('drag-drop import ingests events back into the dashboard', async ({
    page,
    eventLogger,
  }) => {
    await page.goto(eventLogger.url)
    // Use the import API directly since simulating real drag/drop in
    // Playwright is finicky. The drag/drop UI just calls this endpoint.
    const resp = await page.request.post(`${eventLogger.url}/event-log/import?name=test.json`, {
      data: {
        version: 1,
        explanation: 'imported',
        events: [
          { eventType: 'boot', sessionId: 'imp-s1' },
          { eventType: 'dev', sessionId: 'imp-s1' },
        ],
      },
    })
    expect(resp.ok()).toBe(true)
    const body = await resp.json()
    expect(body.imported).toBe(2)

    await expect(page.locator('#eventContainer .event-card')).toHaveCount(2)
    await expect(page.locator('#importsSection')).toBeVisible()
    await expect(page.locator('#importList .filter-item')).toHaveCount(1)
  })
})
