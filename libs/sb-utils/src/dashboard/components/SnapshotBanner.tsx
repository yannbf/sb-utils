/**
 * Yellow "Snapshot" banner shown only when the page is loaded as an
 * exported HTML snapshot (window.__SNAPSHOT__ === true). Reads
 * baked metadata from window.__SNAPSHOT_META__ and offers a "View
 * explanation" button when one was provided at export time.
 *
 * This replaces the legacy `setupSnapshotMode` IIFE + the inline
 * banner HTML that the snapshot exporter used to inject — the
 * exporter now only writes the metadata; rendering is Preact's job.
 */

import { openExplanationModal } from '../store/modal'

type SnapshotMeta = {
  name?: string
  explanation?: string
  capturedAt?: string
  eventsCount?: number
  sessionsCount?: number
}

// Basename of an absolute path. Last non-empty segment of the path,
// stripped of trailing slashes. We use this for the snapshot banner's
// project label — full disk paths are too long and noisy in a yellow
// strip across the top, but the project folder name is enough to
// remind the viewer which Storybook was captured.
function basename(p: string): string {
  if (!p) return ''
  const trimmed = p.replace(/[\\/]+$/, '')
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed
}

export function SnapshotBanner() {
  if (!(window as any).__SNAPSHOT__) return null
  const meta: SnapshotMeta = ((window as any).__SNAPSHOT_META__ as SnapshotMeta) || {}
  const captured = meta.capturedAt ? new Date(meta.capturedAt).toLocaleString() : ''
  const events = meta.eventsCount ?? 0
  const sessions = meta.sessionsCount ?? 0

  // Project label sourced from the cache info baked at export time.
  // Only meaningful when the cache was actually detected — otherwise
  // there's no meaningful "project" attached to the snapshot. Full
  // path goes in the title attribute for hover-disclosure.
  const cacheInfo =
    ((window as any).__SNAPSHOT_CACHE_INFO__ as
      | { cacheStatus?: string; projectRoot?: string | null }
      | undefined) || {}
  const projectName =
    cacheInfo.cacheStatus === 'found' && cacheInfo.projectRoot
      ? basename(cacheInfo.projectRoot)
      : ''

  const showExplanation = () =>
    openExplanationModal(
      meta.name ? 'Explanation · ' + meta.name : 'Snapshot explanation',
      meta.explanation || '',
    )

  return (
    <div class="snapshot-banner">
      <div class="center">
        <span class="dot" />
        <b>Snapshot</b>
        {meta.name && <span class="name">{meta.name}</span>}
        {projectName && (
          <>
            <span class="meta">·</span>
            <span
              class="name"
              title={cacheInfo.projectRoot || ''}
            >
              {projectName}
            </span>
          </>
        )}
        <span class="meta">·</span>
        {captured && <span class="meta">captured {captured}</span>}
        <span class="meta">·</span>
        <span class="meta">
          {events} event{events === 1 ? '' : 's'} · {sessions} session
          {sessions === 1 ? '' : 's'}
        </span>
      </div>
      {meta.explanation && (
        <button type="button" class="explain-btn" onClick={showExplanation}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          View explanation
        </button>
      )}
    </div>
  )
}
