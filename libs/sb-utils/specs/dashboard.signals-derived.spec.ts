/**
 * Computed signal tests. Pure JS runtime — no DOM needed since the
 * signals module doesn't touch `window`.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  events,
  typeCounts,
  sessionMap,
  imports,
  resetAll,
  type StoredEvent,
} from '../src/dashboard/store/signals'

beforeEach(() => {
  resetAll()
})

const ev = (overrides: Partial<StoredEvent>): StoredEvent => ({
  eventType: 'boot',
  _index: Math.floor(Math.random() * 1e9),
  _receivedAt: Date.now(),
  ...overrides,
})

describe('typeCounts', () => {
  it('counts events by eventType', () => {
    events.value = [
      ev({ eventType: 'boot' }),
      ev({ eventType: 'boot' }),
      ev({ eventType: 'dev' }),
    ]
    expect(typeCounts.value).toEqual({ boot: 2, dev: 1 })
  })

  it('updates when events.value reference changes', () => {
    events.value = [ev({ eventType: 'boot' })]
    expect(typeCounts.value.boot).toBe(1)
    events.value = [...events.value, ev({ eventType: 'boot' })]
    expect(typeCounts.value.boot).toBe(2)
  })
})

describe('sessionMap', () => {
  it('groups events by sessionId, ignoring those without one', () => {
    events.value = [
      ev({ sessionId: 'sess-a' }),
      ev({ sessionId: 'sess-a' }),
      ev({ sessionId: 'sess-b' }),
      ev({ sessionId: undefined }),
    ]
    expect(Object.keys(sessionMap.value).sort()).toEqual(['sess-a', 'sess-b'])
    expect(sessionMap.value['sess-a'].count).toBe(2)
    expect(sessionMap.value['sess-b'].count).toBe(1)
  })

  it('records firstSeen as the first event _receivedAt', () => {
    events.value = [
      ev({ sessionId: 'sess-a', _receivedAt: 1000 }),
      ev({ sessionId: 'sess-a', _receivedAt: 2000 }),
    ]
    expect(sessionMap.value['sess-a'].firstSeen).toBe(1000)
  })
})

describe('imports', () => {
  it('rolls up events sharing an _import metadata blob', () => {
    events.value = [
      ev({ _import: { id: 'imp-1', name: 'first.json', importedAt: 1000 } }),
      ev({ _import: { id: 'imp-1', name: 'first.json', importedAt: 1000 } }),
      ev({ _import: { id: 'imp-2', name: 'second.json', importedAt: 2000 } }),
    ]
    expect(imports.value).toHaveLength(2)
    const imp1 = imports.value.find((x) => x.id === 'imp-1')!
    expect(imp1.count).toBe(2)
    expect(imp1.name).toBe('first.json')
  })

  it('omits events without _import metadata', () => {
    events.value = [ev({}), ev({})]
    expect(imports.value).toEqual([])
  })

  it('sorts most-recent-first by importedAt', () => {
    events.value = [
      ev({ _import: { id: 'old', name: 'a', importedAt: 1000 } }),
      ev({ _import: { id: 'new', name: 'b', importedAt: 2000 } }),
    ]
    expect(imports.value.map((x) => x.id)).toEqual(['new', 'old'])
  })
})
