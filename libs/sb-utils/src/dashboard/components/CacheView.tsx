/**
 * Cache view — toolbar (status, path, version, edit toggle, refresh,
 * change-root, clear), edit-mode banner, empty state, and the entries
 * list grouped by namespace. JSON content uses the native
 * <JsonView /> component; per-entry editor is a simple textarea backed
 * by a local map.
 */

import { signal, computed } from '@preact/signals'
import { useEffect, useState } from 'preact/hooks'
import {
  cacheInfo,
  cacheEntries,
  cacheEditMode,
  setEditMode,
  refreshCache,
  changeCacheRoot,
  clearCache,
  writeCacheEntry,
  deleteCacheEntry,
  type CacheEntry,
} from '../store/cache'
import { view, expandAll } from '../store/signals'
import { JsonView, JsonViewExpandToggle, type ForceMode } from './JsonView'
import { CopyButton } from './CopyButton'

// Per-entry expansion + edit state — local to this module since they
// don't need to be observable from anywhere else.
const expandedKeys = signal<Set<string>>(new Set())
const editingDrafts = signal<Map<string, string>>(new Map())

const entryKey = (e: CacheEntry) => e.namespace + '/' + e.key

function formatTimeRemaining(ttlEpoch: number): string {
  const delta = ttlEpoch - Date.now()
  if (delta < 0) return Math.abs(Math.round(delta / 60_000)) + 'm ago'
  if (delta < 3_600_000) return 'in ' + Math.round(delta / 60_000) + 'm'
  if (delta < 86_400_000) return 'in ' + Math.round(delta / 3_600_000) + 'h'
  return 'in ' + Math.round(delta / 86_400_000) + 'd'
}

/**
 * "Just now / 12s ago / 4m ago / 2h ago / 3d ago". Used for cache
 * entry mtimes — past timestamps only. Coarse on purpose; the
 * absolute mtime sits in the title attribute for users who need
 * exact precision.
 */
function formatTimeAgo(epochMs: number): string {
  const delta = Date.now() - epochMs
  if (delta < 1000) return 'just now'
  if (delta < 60_000) return Math.round(delta / 1000) + 's ago'
  if (delta < 3_600_000) return Math.round(delta / 60_000) + 'm ago'
  if (delta < 86_400_000) return Math.round(delta / 3_600_000) + 'h ago'
  return Math.round(delta / 86_400_000) + 'd ago'
}

const groupedEntries = computed<Record<string, CacheEntry[]>>(() => {
  const out: Record<string, CacheEntry[]> = {}
  for (const e of cacheEntries.value) {
    if (!out[e.namespace]) out[e.namespace] = []
    out[e.namespace].push(e)
  }
  // Sort by mtime descending (most recently modified first) so the
  // entries the user is currently iterating on bubble to the top of
  // each namespace. Ties (or entries without an mtime) fall back to
  // a stable alphabetic order on the key.
  for (const ns of Object.keys(out)) {
    out[ns].sort((a, b) => {
      const dt = (b.mtime || 0) - (a.mtime || 0)
      return dt !== 0 ? dt : a.key.localeCompare(b.key)
    })
  }
  return out
})

export function CacheView() {
  // Boot: fetch info + entries on first mount, then again whenever the
  // user navigates back to the cache view (so changes from edit-mode
  // writes elsewhere reflect).
  useEffect(() => {
    void refreshCache()
  }, [])
  useEffect(() => {
    if (view.value === 'cache') void refreshCache()
  }, [view.value])

  // Header expand/collapse button is view-aware: in cache view, it
  // expands every entry. Sync expandedKeys to expandAll signal.
  useEffect(() => {
    if (expandAll.value) {
      const all = new Set<string>()
      for (const e of cacheEntries.value) all.add(entryKey(e))
      expandedKeys.value = all
    } else {
      expandedKeys.value = new Set()
    }
  }, [expandAll.value])

  const info = cacheInfo.value
  const status = info.cacheStatus || 'not-found'
  const editMode = cacheEditMode.value

  return (
    <div
      class="cache-view"
      id="cacheView"
      style={view.value === 'cache' ? undefined : { display: 'none' }}
    >
      <Toolbar status={status} />
      {editMode && (
        <div class="cache-writes-banner" id="cacheWritesBanner">
          <span>
            ⚠ Edit mode is on — saves and deletes hit the real{' '}
            <code>node_modules/.cache/storybook</code>.
          </span>
        </div>
      )}
      {status !== 'found' && (
        <div class="cache-empty" id="cacheEmpty">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
            </svg>
          </div>
          <h3 id="cacheEmptyTitle">No Storybook cache detected</h3>
          <p id="cacheEmptyMsg">
            Run <code>event-logger</code> from a Storybook project, pass{' '}
            <code>--project-root &lt;path&gt;</code>, or use "Change root…" above.
          </p>
        </div>
      )}
      {status === 'found' && <Entries />}
    </div>
  )
}

function Toolbar({ status }: { status: string }) {
  const info = cacheInfo.value
  const editMode = cacheEditMode.value
  const statusLabel = status === 'found' ? 'Active' : status === 'unreadable' ? 'Unreadable' : 'Not found'
  return (
    <div class="cache-toolbar">
      <div class="cache-root-info" id="cacheRootInfo">
        <span class={'cache-root-status ' + (status === 'found' ? '' : status)} id="cacheRootStatus">
          {statusLabel}
        </span>
        <span class="cache-root-path" id="cacheRootPath">
          {info.projectRoot || 'No project resolved — pass --project-root or click "Change root…"'}
        </span>
        {info.version && (
          <span class="cache-root-version" id="cacheRootVersion">
            sb {info.version}
          </span>
        )}
      </div>
      <div class="cache-toolbar-actions">
        <div
          class="sidebar-toggle-row"
          id="cacheEditToggleRow"
          title='Toggle edit mode — when on, edit/delete/clear actions appear'
          style={{ padding: '4px 8px', cursor: 'pointer' }}
          onClick={() => setEditMode(!editMode)}
        >
          <div style={{ marginRight: '8px' }}>
            <span class="label">Edit mode</span>
          </div>
          <div class={'toggle-switch' + (editMode ? ' on' : '')} id="cacheEditToggleSwitch" />
        </div>
        <button
          type="button"
          class="btn"
          id="cacheRefreshBtn"
          title="Reload entries from disk"
          onClick={() => void refreshCache()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
        <button
          type="button"
          class="btn"
          id="cacheChangeRootBtn"
          title="Switch to a different project root"
          onClick={() => void changeCacheRoot()}
        >
          Change root…
        </button>
        {editMode && status === 'found' && (
          <button
            type="button"
            class="btn danger"
            id="cacheClearBtn"
            title="Wipe all entries"
            onClick={() => void clearCache()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Clear cache
          </button>
        )}
      </div>
    </div>
  )
}

function Entries() {
  const grouped = groupedEntries.value
  const namespaces = Object.keys(grouped).sort()
  if (namespaces.length === 0) {
    return (
      <div class="cache-entries" id="cacheEntries">
        <div class="cache-empty">
          <h3>Cache root is empty</h3>
          <p>
            No entries written yet under <code>{cacheInfo.value.cacheRoot || ''}</code>
          </p>
        </div>
      </div>
    )
  }
  return (
    <div class="cache-entries" id="cacheEntries">
      {namespaces.map((ns) => (
        <div key={ns} class="cache-namespace" data-ns={ns}>
          <div class="cache-namespace-header">
            <span>{ns}</span>
            <span class="cache-namespace-count">
              {grouped[ns].length} entr{grouped[ns].length === 1 ? 'y' : 'ies'}
            </span>
          </div>
          {grouped[ns].map((entry) => (
            <EntryCard key={entryKey(entry)} entry={entry} />
          ))}
        </div>
      ))}
    </div>
  )
}

function EntryCard({ entry }: { entry: CacheEntry }) {
  const fullKey = entryKey(entry)
  const isExpanded = expandedKeys.value.has(fullKey)
  // JSON tree force-mode owned per cache entry. The action buttons
  // row sits OUTSIDE `.cache-entry-content` (which is the scroll
  // container), so the toggle naturally stays visible while the user
  // scrolls — no sticky needed for cache-view specifically.
  const [jsonMode, setJsonMode] = useState<ForceMode>('default')
  const draft = editingDrafts.value.get(fullKey)
  const isEditing = draft != null
  const editMode = cacheEditMode.value

  const toggleExpanded = () => {
    const next = new Set(expandedKeys.value)
    if (next.has(fullKey)) next.delete(fullKey)
    else next.add(fullKey)
    expandedKeys.value = next
  }

  const startEdit = () => {
    const next = new Map(editingDrafts.value)
    next.set(fullKey, JSON.stringify(entry.content, null, 2))
    editingDrafts.value = next
  }
  const cancelEdit = () => {
    const next = new Map(editingDrafts.value)
    next.delete(fullKey)
    editingDrafts.value = next
  }
  const saveEdit = async () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(draft || '')
    } catch (err) {
      window.alert('Invalid JSON: ' + (err as Error).message)
      return
    }
    const r = await writeCacheEntry(entry, parsed)
    if (!r.ok) {
      window.alert('Write failed: ' + (r.error || ''))
      return
    }
    cancelEdit()
  }
  const doDelete = async () => {
    if (!window.confirm(`Delete cache entry "${entry.key}" in namespace "${entry.namespace}"?`)) return
    const r = await deleteCacheEntry(entry)
    if (!r.ok) {
      window.alert('Delete failed: ' + (r.error || ''))
      return
    }
    cancelEdit()
    const next = new Set(expandedKeys.value)
    next.delete(fullKey)
    expandedKeys.value = next
  }
  const copyPath = () => {
    if (!entry.file) return
    void navigator.clipboard.writeText(entry.file)
  }

  return (
    <div
      class={'cache-entry' + (isExpanded ? ' expanded' : '')}
      data-full-key={fullKey}
    >
      <div class="cache-entry-header" onClick={toggleExpanded}>
        <span class="cache-entry-key">{entry.key}</span>
        <div class="cache-entry-meta">
          {entry.ttl ? (
            <span class={'ttl-tag' + (entry.expired ? ' expired' : '')}>
              {entry.expired ? 'expired' : 'ttl'} {formatTimeRemaining(entry.ttl)}
            </span>
          ) : null}
          {entry.mtime ? (
            <span
              class="cache-entry-mtime"
              title={`Last updated: ${new Date(entry.mtime).toLocaleString()}`}
            >
              {formatTimeAgo(entry.mtime)}
            </span>
          ) : null}
        </div>
      </div>
      <div class="cache-entry-body">
        {isEditing ? (
          <>
            {editMode && (
              <div class="cache-entry-actions">
                <button
                  data-action="save-edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    void saveEdit()
                  }}
                >
                  Save
                </button>
                <button
                  data-action="cancel-edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    cancelEdit()
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            <div class="cache-entry-file">{entry.file || ''}</div>
            <div class="cache-entry-content">
              <textarea
                spellcheck={false}
                value={draft}
                onInput={(e) => {
                  const next = new Map(editingDrafts.value)
                  next.set(fullKey, (e.currentTarget as HTMLTextAreaElement).value)
                  editingDrafts.value = next
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div class="cache-entry-actions">
              {entry.file && (
                <button
                  data-action="copy-path"
                  title={entry.file}
                  onClick={(e) => {
                    e.stopPropagation()
                    copyPath()
                  }}
                >
                  Copy path
                </button>
              )}
              {editMode && (
                <>
                  <button
                    data-action="edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEdit()
                    }}
                  >
                    Edit
                  </button>
                  <button
                    data-action="delete"
                    class="danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      void doDelete()
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div class="cache-entry-file">{entry.file || ''}</div>
            <div class="cache-entry-content">
              {/*
                Same floating tools cluster as EventCard / TimelineDrawer
                — JSON expand/collapse + Copy. Anchored to the
                cache-entry-content's padding box so both icons stay
                visible while the user scrolls a long entry.
              */}
              <div class="tab-tools">
                <JsonViewExpandToggle
                  mode={jsonMode}
                  setMode={setJsonMode}
                  value={entry.content}
                />
                <CopyButton
                  getValue={() => entry.content}
                  title="Copy content"
                />
              </div>
              <JsonView
                value={entry.content}
                mode={jsonMode}
                setMode={setJsonMode}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
