/**
 * Server-resolved cache state shared between the CacheView Preact
 * component and any other code that needs it (snapshot export, etc).
 */

import { signal } from '@preact/signals'

export type CacheInfo = {
  cacheStatus?: string
  projectRoot?: string | null
  cacheRoot?: string | null
  version?: string | null
  error?: string
}

export type CacheEntry = {
  key: string
  namespace: string
  file?: string
  ttl?: number | null
  expired?: boolean
  mtime?: number
  content?: unknown
}

export const cacheInfo = signal<CacheInfo>({
  cacheStatus: 'not-found',
  projectRoot: null,
  cacheRoot: null,
  version: null,
})

export const cacheEntries = signal<CacheEntry[]>([])

const initialEditMode = (() => {
  // signals.ts imports from this file, so this IIFE now runs in
  // unit-test (node) contexts as well as the browser. Guard the
  // browser-only globals so the import doesn't throw under Vitest.
  if (typeof window === 'undefined') return false
  if ((window as any).__SNAPSHOT__) return false
  try {
    return localStorage.getItem('sbutils.eventlog.cache.editMode') === '1'
  } catch {
    return false
  }
})()
export const cacheEditMode = signal<boolean>(initialEditMode)

export function setEditMode(v: boolean): void {
  cacheEditMode.value = v
  try {
    localStorage.setItem('sbutils.eventlog.cache.editMode', v ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export async function refreshCacheInfo(): Promise<void> {
  try {
    const res = await fetch('/cache/info')
    cacheInfo.value = await res.json()
  } catch (err) {
    cacheInfo.value = {
      cacheStatus: 'unreadable',
      projectRoot: null,
      cacheRoot: null,
      version: null,
      error: String(err),
    }
  }
}

export async function refreshCacheEntries(): Promise<void> {
  try {
    const res = await fetch('/cache/entries')
    const data = await res.json()
    // The /cache/entries response carries cacheStatus / projectRoot /
    // cacheRoot / version too — mirror them into cacheInfo so the
    // sidebar pill keeps refreshing even when the user never visits
    // the dedicated Cache view (i.e. cacheInfo would otherwise stay
    // at its initial 'not-found' state). Previously this function
    // gated on cacheInfo.cacheStatus === 'found' and silently wrote
    // []; that meant every live cache:write SSE event wiped the
    // count rather than growing it.
    if (data && typeof data === 'object') {
      const { cacheStatus, projectRoot, cacheRoot, version } = data as {
        cacheStatus?: string
        projectRoot?: string | null
        cacheRoot?: string | null
        version?: string | null
      }
      if (cacheStatus) {
        cacheInfo.value = { cacheStatus, projectRoot, cacheRoot, version }
      }
    }
    cacheEntries.value = Array.isArray(data?.entries) ? data.entries : []
  } catch {
    cacheEntries.value = []
  }
}

export async function refreshCache(): Promise<void> {
  await refreshCacheInfo()
  await refreshCacheEntries()
}

export async function changeCacheRoot(): Promise<boolean> {
  const next = window.prompt(
    'Switch project root\n\nAbsolute path to a Storybook project (or empty to clear).',
    cacheInfo.value.projectRoot || '',
  )
  if (next === null) return false
  const trimmed = next.trim()
  try {
    const res = await fetch('/cache/project-root', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectRoot: trimmed || null }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      window.alert('Set root failed: ' + (body.error || res.statusText))
      return false
    }
    await refreshCache()
    return true
  } catch (err) {
    window.alert('Set root failed: ' + (err as Error).message)
    return false
  }
}

export async function clearCache(): Promise<void> {
  if (!window.confirm('Wipe all cache entries? This cannot be undone.')) return
  try {
    const res = await fetch('/cache/clear', { method: 'POST' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      window.alert('Clear failed: ' + (body.error || res.statusText))
      return
    }
    await refreshCacheEntries()
  } catch (err) {
    window.alert('Clear failed: ' + (err as Error).message)
  }
}

export async function writeCacheEntry(
  entry: CacheEntry,
  newContent: unknown,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const url =
      '/cache/entries/' +
      encodeURIComponent(entry.key) +
      '?namespace=' +
      encodeURIComponent(entry.namespace)
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body.error || res.statusText }
    }
    await refreshCacheEntries()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteCacheEntry(
  entry: CacheEntry,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const url =
      '/cache/entries/' +
      encodeURIComponent(entry.key) +
      '?namespace=' +
      encodeURIComponent(entry.namespace)
    const res = await fetch(url, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body.error || res.statusText }
    }
    await refreshCacheEntries()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
