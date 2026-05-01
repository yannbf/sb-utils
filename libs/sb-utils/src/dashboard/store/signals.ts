/**
 * Reactive store. Each piece of dashboard state is a `@preact/signals`
 * signal so Preact components subscribe granularly. The legacy module
 * still mutates a `state` object imperatively; `mirrorState` copies the
 * relevant slices into signals after each mutation so components stay in
 * sync. As the legacy module shrinks the mirror layer disappears and
 * components write to signals directly.
 */

import { signal, computed } from '@preact/signals'

export type StoredEvent = {
  eventType: string
  eventId?: string
  sessionId?: string
  payload?: Record<string, unknown>
  metadata?: Record<string, unknown>
  context?: Record<string, unknown>
  _index: number
  _receivedAt: number
  _source?: string
  _import?: { id: string; name: string; importedAt: number; explanation?: string }
}

export type View = 'dashboard' | 'timeline' | 'cache'

// ── Core data ────────────────────────────────────────────
export const events = signal<StoredEvent[]>([])

// ── UI mode ──────────────────────────────────────────────
export const view = signal<View>('dashboard')
export const paused = signal(false)
export const pausedWhileCount = signal(0)
export const autoScroll = signal(true)
export const expandAll = signal(false)
export const expandedCards = signal<Set<string>>(new Set())

// ── Filter / hide state ──────────────────────────────────
export const searchQuery = signal('')
export const activeFilter = signal<string>('all')
export const activeSession = signal<string | null>(null)
export const activeImport = signal<string | null>(null)
export const activeCacheKey = signal<string | null>(null)
export const hiddenTypes = signal<Set<string>>(new Set())
export const hiddenSessions = signal<Set<string>>(new Set())
export const hiddenImports = signal<Set<string>>(new Set())
export const hiddenCacheKeys = signal<Set<string>>(new Set())
export const cacheAllHidden = signal(false)
export const telemetryAllHidden = signal(false)

// ── Reconstruction flag ──────────────────────────────────
export const realTelemetryDetected = signal(false)

// ── Toasts ───────────────────────────────────────────────
export type Toast = { id: number; text: string }
export const toasts = signal<Toast[]>([])
let _toastId = 0
export function pushToast(text: string, ttlMs = 2000) {
  const id = ++_toastId
  toasts.value = [...toasts.value, { id, text }]
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, ttlMs)
}

// ── Modal ────────────────────────────────────────────────
// Three modes: 'save' (filename + optional explanation), 'explain' (read-only
// view of an existing explanation), or null (closed). Resolution flows back
// through the modal state itself: callers `await openSaveModal({...})` and
// the user's submit/cancel resolves the promise.
export type SaveModalSpec = {
  kind: 'save'
  title: string
  defaultName: string
  extension: string
  withExplanation: boolean
}
export type ExplainModalSpec = {
  kind: 'explain'
  title: string
  text: string
}
export type ModalSpec = SaveModalSpec | ExplainModalSpec
export const modal = signal<ModalSpec | null>(null)

// ── Imports ──────────────────────────────────────────────
export type ImportBatch = {
  id: string
  name: string
  importedAt: number
  explanation?: string
}
export const imports = signal<ImportBatch[]>([])

// ── Computed: counts and groupings ───────────────────────
// Derived from `events.value` so they auto-update whenever a new event is
// pushed. Computeds memoize until their inputs change.

export const typeCounts = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {}
  for (const e of events.value) {
    const t = e.eventType || 'unknown'
    out[t] = (out[t] || 0) + 1
  }
  return out
})

export type SessionInfo = { count: number; firstSeen: number }

export const sessionMap = computed<Record<string, SessionInfo>>(() => {
  const out: Record<string, SessionInfo> = {}
  for (const e of events.value) {
    if (!e.sessionId) continue
    if (!out[e.sessionId]) out[e.sessionId] = { count: 0, firstSeen: e._receivedAt || Date.now() }
    out[e.sessionId].count++
  }
  return out
})

export type CacheKeyInfo = {
  key: string
  namespace?: string
  logicalKey?: string
  count: number
  firstSeen: number
  lastOp?: string
}

export const cacheMap = computed<Record<string, CacheKeyInfo>>(() => {
  const out: Record<string, CacheKeyInfo> = {}
  for (const e of events.value) {
    if (e._source !== 'cache-watch') continue
    const p = (e.payload || {}) as Record<string, unknown>
    const key = String(p.namespace || '') + '/' + String(p.key || '')
    const ts = e._receivedAt || Date.now()
    if (!out[key]) {
      out[key] = {
        key,
        namespace: p.namespace as string | undefined,
        logicalKey: p.key as string | undefined,
        count: 0,
        firstSeen: ts,
      }
    }
    out[key].count++
    out[key].lastOp = (p.operation as string | undefined) ?? out[key].lastOp
  }
  return out
})

// Reset everything (used by the Clear All flow).
export function resetAll() {
  events.value = []
  pausedWhileCount.value = 0
  expandedCards.value = new Set()
  hiddenTypes.value = new Set()
  hiddenSessions.value = new Set()
  hiddenImports.value = new Set()
  hiddenCacheKeys.value = new Set()
  cacheAllHidden.value = false
  telemetryAllHidden.value = false
  activeFilter.value = 'all'
  activeSession.value = null
  activeImport.value = null
  activeCacheKey.value = null
  imports.value = []
  realTelemetryDetected.value = false
}
