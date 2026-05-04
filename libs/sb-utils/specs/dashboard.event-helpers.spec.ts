import { describe, expect, it } from 'vitest'
import { hasErrorPayload, summaryFor } from '../src/dashboard/lib/event-helpers'
import type { StoredEvent } from '../src/dashboard/store/signals'

describe('hasErrorPayload', () => {
  it('returns false for events with no payload', () => {
    expect(hasErrorPayload(null)).toBe(false)
    expect(hasErrorPayload(undefined)).toBe(false)
    expect(hasErrorPayload({})).toBe(false)
    expect(hasErrorPayload({ payload: null })).toBe(false)
    expect(hasErrorPayload({ payload: 'string' })).toBe(false)
  })

  it('returns true when an `error` key has a populated value', () => {
    expect(hasErrorPayload({ payload: { error: 'boom' } })).toBe(true)
    expect(hasErrorPayload({ payload: { error: { message: 'x' } } })).toBe(true)
    expect(hasErrorPayload({ payload: { errorMessage: 'failed' } })).toBe(true)
    expect(hasErrorPayload({ payload: { metadataErrorMessage: 'oops' } })).toBe(true)
  })

  it('returns true when a `fail` key has a populated value', () => {
    expect(hasErrorPayload({ payload: { failed: true } })).toBe(true)
    expect(hasErrorPayload({ payload: { failureReason: 'timeout' } })).toBe(true)
    expect(hasErrorPayload({ payload: { numFailures: 3 } })).toBe(true)
  })

  it('matches keys case-insensitively', () => {
    expect(hasErrorPayload({ payload: { Error: 'boom' } })).toBe(true)
    expect(hasErrorPayload({ payload: { FAILURE: 'x' } })).toBe(true)
  })

  it('treats empty values as not-real even when the key matches', () => {
    expect(hasErrorPayload({ payload: { error: null } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: undefined } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: '' } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: '   ' } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: 0 } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: false } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: {} } })).toBe(false)
    expect(hasErrorPayload({ payload: { error: [] } })).toBe(false)
    expect(hasErrorPayload({ payload: { failureReason: '' } })).toBe(false)
  })

  it('ignores keys without `error` or `fail`', () => {
    expect(hasErrorPayload({ payload: { status: 'broken', message: 'x' } })).toBe(false)
    expect(hasErrorPayload({ payload: { warning: 'something' } })).toBe(false)
  })

  it('walks nested objects and arrays', () => {
    expect(hasErrorPayload({ payload: { context: { error: 'nested' } } })).toBe(true)
    expect(
      hasErrorPayload({ payload: { results: [{ status: 'ok' }, { error: 'boom' }] } }),
    ).toBe(true)
    expect(
      hasErrorPayload({
        payload: { deeply: { nested: { tree: { failureCount: 5 } } } },
      }),
    ).toBe(true)
  })

  it('matches a real-world test-result payload (nested counts)', () => {
    const payload = {
      agent: { name: 'claude-code/2.1.123/agent' },
      analysis: {
        total: 10,
        passed: 8,
        passedButEmptyRender: 0,
        successRate: 0.8,
        successRateWithoutEmptyRender: 0.8,
        uniqueErrorCount: 2,
        categorizedErrors: {
          UNKNOWN_ERROR: { uniqueCount: 2, count: 2, matchedDependencies: [] },
        },
        cssCheck: 'not-run',
      },
      unhandledErrorCount: 0,
      duration: 3043,
      watch: false,
    }
    expect(hasErrorPayload({ payload })).toBe(true)
  })

  it('treats nested empty error fields as not-real', () => {
    expect(
      hasErrorPayload({ payload: { analysis: { errorCount: 0, failureReason: '' } } }),
    ).toBe(false)
  })

  it('skips cache:write events even when they contain error-like fields', () => {
    expect(
      hasErrorPayload({
        _source: 'cache-watch',
        payload: { content: { error: 'boom' }, key: 'x', namespace: 'y' },
      }),
    ).toBe(false)
  })

  it('does flag reconstructed telemetry (cache-recon) when payload has errors', () => {
    expect(
      hasErrorPayload({ _source: 'cache-recon', payload: { error: 'boom' } }),
    ).toBe(true)
  })

  it('survives self-referential payloads without infinite loop', () => {
    const a: any = { name: 'root' }
    a.self = a
    expect(hasErrorPayload({ payload: a })).toBe(false)
    a.error = 'boom'
    expect(hasErrorPayload({ payload: a })).toBe(true)
  })
})

const ev = (payload: Record<string, unknown>): StoredEvent =>
  ({ eventType: 'x', _index: 0, _receivedAt: 0, payload }) as StoredEvent

describe('summaryFor', () => {
  it('boot: surfaces eventType (e.g. "dev")', () => {
    expect(summaryFor(ev({ eventType: 'dev' }))).toBe('dev')
  })

  it('init-step: surfaces step + result', () => {
    expect(summaryFor(ev({ step: 'playwright-install', result: 'installed' }))).toBe(
      'playwright-install · installed',
    )
  })

  it('onboarding-checklist-status: surfaces item + status', () => {
    expect(summaryFor(ev({ item: 'moreStories', status: 'done' }))).toBe(
      'moreStories · done',
    )
  })

  it('still surfaces error message via the error branch', () => {
    expect(summaryFor(ev({ error: { message: 'boom' } }))).toBe('error: boom')
    expect(summaryFor(ev({ error: 'flat' }))).toBe('error: flat')
  })

  it('returns empty string for events with no descriptive fields', () => {
    expect(summaryFor(ev({ unrelated: 1 }))).toBe('')
    expect(summaryFor(null)).toBe('')
  })
})
