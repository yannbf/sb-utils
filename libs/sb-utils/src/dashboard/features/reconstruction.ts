// @ts-nocheck
/**
 * Reconstruction + cache backfill. When STORYBOOK_TELEMETRY_URL isn't
 * set, Storybook still writes outgoing telemetry to the dev-server
 * `lastEvents` cache. We tail those writes (and seed from existing
 * entries on load) and synthesize matching telemetry events so the
 * dashboard works even without instrumentation. The instant a real
 * telemetry event arrives we flip the flag and stop reconstructing.
 */

import { scheduleMirror } from '../store/legacy-mirror'

export function setupReconstruction(
  state: any,
  helpers: {
    updateTypeCounts: (e: any) => void
    updateSessionMap: (e: any) => void
    updateImportMap: (e: any) => void
    updateCacheMap: (e: any) => void
    nextReconstructIndex: () => number
    pausedCountEl: HTMLElement
    renderNewEvent: (e: any) => void
    updateCounters: () => void
    Timeline: any
    cacheKeyOf: (e: any) => string | null
  },
) {
  const {
    updateTypeCounts,
    updateSessionMap,
    updateImportMap,
    updateCacheMap,
    nextReconstructIndex,
    pausedCountEl,
    renderNewEvent,
    updateCounters,
    cacheKeyOf,
  } = helpers
  const Timeline = () => helpers.Timeline

function reconstructTelemetryFromCacheWrite(cacheEvent) {
  if (state.realTelemetryDetected) return;
  if (!cacheEvent || !cacheEvent.payload) return;
  const p = cacheEvent.payload;
  // Only the lastEvents key under dev-server is the telemetry log.
  if (p.key !== 'lastEvents' || p.namespace !== 'dev-server') return;
  // Deletes don't add events.
  if (p.operation === 'delete') return;

  const next = (p.content && typeof p.content === 'object') ? p.content : {};
  const prev = (p.previousContent && typeof p.previousContent === 'object') ? p.previousContent : {};

  // Reusable accounting matching the SSE handler — keeps reconstructed
  // events behaving identically to "real" telemetry events.
  const ingest = (event) => {
    state.events.push(event);
    updateTypeCounts(event);
    updateSessionMap(event);
    updateImportMap(event);
    if (state.paused) {
      state.pausedWhileCount++;
      pausedCountEl.textContent = state.pausedWhileCount;
    } else {
      renderNewEvent(event);
    }
  };

  // First pass: collect candidates that are actually new or changed AND
  // not already present (by eventId) in state.events. We sort them by
  // their cache-recorded timestamp before assigning indices, so the
  // displayed `#N` follows chronology.
  const candidates = [];
  for (const eventType of Object.keys(next)) {
    const entry = next[eventType];
    if (!entry || typeof entry !== 'object' || !entry.body) continue;
    const prevEntry = prev[eventType];
    if (prevEntry && JSON.stringify(prevEntry) === JSON.stringify(entry)) continue;

    const body = entry.body;
    // Dedupe against any matching eventId already in state — covers
    // overlap with real telemetry that arrived between the cache write
    // and our processing.
    if (body && body.eventId && state.events.some(e => e.eventId === body.eventId)) continue;

    candidates.push({
      body,
      timestamp: typeof entry.timestamp === 'number'
        ? entry.timestamp
        : (cacheEvent._receivedAt || Date.now()),
    });
  }
  candidates.sort((a, b) => a.timestamp - b.timestamp);

  for (const c of candidates) {
    const reconstructed = Object.assign({}, c.body, {
      _source: 'cache-recon',
      _index: nextReconstructIndex(),
      _receivedAt: c.timestamp,
    });
    ingest(reconstructed);
  }
  if (candidates.length > 0) {
    updateCounters();
    if (Timeline()) Timeline().invalidate();
  }
}

// Synthesize a `cache:write` event for a pre-existing cache entry so it
// shows up in the timeline / Cache Operations sidebar with the right
// timestamp. Used by the on-load backfill — we lose nothing since we
// also have the live watcher running for subsequent changes.
function ingestSyntheticCacheCreate(entry, cacheRoot, projectRoot) {
  if (!entry || !entry.key) return;
  const ts = typeof entry.mtime === 'number' ? entry.mtime : Date.now();
  // Dedupe: don't re-synthesize a cache event for a (file, mtime) we've
  // already represented in the timeline — regardless of which operation
  // captured it. A baked snapshot's `update` write at the current mtime
  // means we've already shown this state; adding a synthetic `create`
  // for the same (file, mtime) just produces a duplicate.
  if (state.events.some(e =>
    e._source === 'cache-watch' &&
    e.payload && e.payload.file === entry.file &&
    e._receivedAt === ts
  )) return;

  const synthetic = {
    eventType: 'cache:write',
    _source: 'cache-watch',
    _index: nextReconstructIndex(),
    _receivedAt: ts,
    payload: {
      key: entry.key,
      namespace: entry.namespace,
      file: entry.file,
      operation: 'create',
      content: entry.content,
      previousContent: null,
      diff: null,
    },
    context: { cacheRoot: cacheRoot || null, projectRoot: projectRoot || null },
  };
  state.events.push(synthetic);
  updateTypeCounts(synthetic);
  updateCacheMap(synthetic);
  if (state.paused) {
    state.pausedWhileCount++;
    pausedCountEl.textContent = state.pausedWhileCount;
  } else {
    renderNewEvent(synthetic);
  }
}

// On page load: fetch every existing cache entry, materialize them as
// `cache:write op=create` events in the timeline, and reconstruct the
// telemetry stream from `lastEvents`. Best-effort — silent failure
// just means the dashboard boots empty.
async function backfillFromCache() {
  try {
    const res = await fetch('/cache/entries');
    if (!res.ok) return;
    const data = await res.json();
    const entries = (data && Array.isArray(data.entries)) ? data.entries : [];
    if (entries.length === 0) return;

    // Cache operation backfill — sorted by mtime locally; telemetry
    // reconstruction sorts by its own timestamps. Each pass is sorted
    // internally but they push into state.events as two separate runs,
    // so we re-sort the whole array at the end to merge them.
    const sorted = entries.slice().sort((a, b) => (a.mtime || 0) - (b.mtime || 0));
    for (const entry of sorted) {
      ingestSyntheticCacheCreate(entry, data.cacheRoot, data.projectRoot);
    }

    if (!state.realTelemetryDetected) {
      const lastEvents = entries.find(e => e.key === 'lastEvents' && e.namespace === 'dev-server');
      if (lastEvents && lastEvents.content && typeof lastEvents.content === 'object') {
        reconstructTelemetryFromCacheWrite({
          _source: 'cache-watch',
          _receivedAt: Date.now(),
          payload: {
            key: 'lastEvents',
            namespace: 'dev-server',
            operation: 'update',
            previousContent: {},
            content: lastEvents.content,
          },
        });
      }
    }

    // Final merge: chronological order across both backfilled streams
    // (cache:create from mtime + reconstructed telemetry from entry
    // timestamps) plus any real telemetry already loaded from /event-log.
    // The subsequent rerenderAll() in loadExisting picks up this order.
    sortEventsByTime();

    updateCounters();
    if (Timeline()) Timeline().invalidate();
  } catch (_) { /* best-effort */ }
}

// Sort state.events by _receivedAt ascending. Stable enough for our
// use — same-ms ties keep insertion order. Called after batch ingestion
// (backfill) so the dashboard list and session separators reflect true
// chronology rather than ingestion-pass grouping.
function sortEventsByTime() {
  state.events.sort((a, b) => (a._receivedAt || 0) - (b._receivedAt || 0));
}

  return { reconstructTelemetryFromCacheWrite, ingestSyntheticCacheCreate, backfillFromCache, sortEventsByTime }
}
