/**
 * Generate a self-contained HTML snapshot of the current dashboard.
 * Fetches the prebuilt single-file dashboard the server is serving,
 * injects a synchronous bootstrap `<script>` at the top of <head> with
 * baked events / cache state / metadata + stubs for `fetch` and
 * `EventSource`, then triggers a Blob download.
 *
 * The banner that appears in the snapshot is rendered at runtime by
 * `components/SnapshotBanner.tsx` reading the baked `__SNAPSHOT_META__`.
 * No banner HTML is injected here.
 */

import { events, realTelemetryDetected, pushToast } from '../store/signals'
import { openSaveModal } from '../store/modal'

export async function exportHtmlSnapshot(): Promise<void> {
  const snapAt = new Date()
  const defaultName =
    'storybook-telemetry-snapshot-' +
    snapAt.toISOString().replace(/[:.]/g, '-').slice(0, 19) +
    '.html'
  const result = await openSaveModal({
    kind: 'html',
    defaultName,
    extension: 'html',
    withExplanation: true,
  })
  if (!result) return
  const filename = result.filename
  const explanation = result.explanation || ''
  const snapshotName = filename.replace(/\.html$/i, '')

  const eventsArr = events.value.slice()
  const sessionCount = new Set(eventsArr.map((e) => e.sessionId).filter(Boolean)).size

  // Best-effort: capture cache state at snapshot time. If the routes
  // are unreachable (snapshot of a snapshot, etc.) we still produce a
  // valid file — the cache view will just say "not detected".
  let cacheInfo: unknown = null
  let cacheEntries: unknown = null
  try {
    const [infoRes, entriesRes] = await Promise.all([fetch('/cache/info'), fetch('/cache/entries')])
    cacheInfo = await infoRes.json()
    const data = (await entriesRes.json()) as { entries?: unknown }
    cacheEntries = Array.isArray(data?.entries) ? data.entries : []
  } catch (_) {
    /* leave nulls */
  }

  // Fetch the prebuilt single-file dashboard the server is serving. It
  // already has CSS + the Preact bundle inlined, so no DOM cloning,
  // CSS-fetching, or asset stripping is needed. Falls back to cloning
  // the live document if the fetch fails (defensive — the export only
  // runs against a live server, so the fallback is rarely exercised).
  let baseHtml: string | null = null
  try {
    const res = await fetch('/event-log-dashboard.html', { cache: 'no-store' })
    if (res.ok) baseHtml = await res.text()
  } catch (_) {
    /* fall through */
  }
  let clone: HTMLElement
  if (baseHtml) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(baseHtml, 'text/html')
    clone = doc.documentElement
  } else {
    clone = document.documentElement.cloneNode(true) as HTMLElement
  }

  // Reassert title in the cloned document so snapshot tabs are
  // distinguishable in the browser tab strip.
  const titleEl = clone.querySelector('title')
  if (titleEl) {
    titleEl.textContent = snapshotName + ' · Snapshot · ' + eventsArr.length + ' events'
  }

  // Bake snapshot globals + fetch / EventSource stubs as a synchronous
  // `<script>` at the top of <head>. Vite's bundle is a deferred
  // `<script type="module">` so this runs first by definition.
  const bootstrap = document.createElement('script')
  bootstrap.textContent = [
    '(function() {',
    '  window.__SNAPSHOT__ = true;',
    '  window.__SNAPSHOT_EVENTS__ = ' + JSON.stringify(eventsArr) + ';',
    // Carry the realTelemetryDetected flag so reconstruction doesn't
    // re-run on snapshot load. Storybook generates DIFFERENT eventIds
    // for HTTP-sent telemetry vs the body it stores in the lastEvents
    // cache — eventId-based dedup misses, and reconstruction would
    // silently add ghost events for every entry that originally fired
    // as real telemetry.
    '  window.__SNAPSHOT_REAL_TELEMETRY_DETECTED__ = ' +
      JSON.stringify(realTelemetryDetected.value) +
      ';',
    '  window.__SNAPSHOT_CACHE_INFO__ = ' + JSON.stringify(cacheInfo) + ';',
    '  window.__SNAPSHOT_CACHE_ENTRIES__ = ' + JSON.stringify(cacheEntries) + ';',
    '  window.__SNAPSHOT_META__ = ' +
      JSON.stringify({
        name: snapshotName,
        explanation,
        capturedAt: snapAt.toISOString(),
        eventsCount: eventsArr.length,
        sessionsCount: sessionCount,
      }) +
      ';',
    '  window.fetch = function(input, init) {',
    '    var url = typeof input === "string" ? input : (input && input.url) || "";',
    '    var method = (init && init.method) || "GET";',
    '    if (method === "GET" && /\\/event-log(\\?|$)/.test(url)) {',
    '      return Promise.resolve(new Response(JSON.stringify(window.__SNAPSHOT_EVENTS__), { status: 200, headers: { "Content-Type": "application/json" } }));',
    '    }',
    '    if (method === "GET" && /\\/cache\\/info(\\?|$)/.test(url)) {',
    '      var info = window.__SNAPSHOT_CACHE_INFO__ || { cacheStatus: "not-found", projectRoot: null, cacheRoot: null, version: null };',
    '      return Promise.resolve(new Response(JSON.stringify(info), { status: 200, headers: { "Content-Type": "application/json" } }));',
    '    }',
    '    if (method === "GET" && /\\/cache\\/entries(\\?|$)/.test(url)) {',
    '      var info2 = window.__SNAPSHOT_CACHE_INFO__ || { cacheStatus: "not-found", projectRoot: null, cacheRoot: null, version: null };',
    '      var body = Object.assign({}, info2, { entries: window.__SNAPSHOT_CACHE_ENTRIES__ || [] });',
    '      return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } }));',
    '    }',
    '    if (method === "GET" && /\\/config(\\?|$)/.test(url)) {',
    '      return Promise.resolve(new Response(JSON.stringify({ cacheEnabledByDefault: true, snapshot: true }), { status: 200, headers: { "Content-Type": "application/json" } }));',
    '    }',
    '    return Promise.resolve(new Response("", { status: 204 }));',
    '  };',
    '  function NoopES() { this.readyState = 2; this.close = function(){}; this.addEventListener = function(){}; this.removeEventListener = function(){}; this.onopen = null; this.onerror = null; this.onmessage = null; }',
    '  NoopES.CONNECTING = 0; NoopES.OPEN = 1; NoopES.CLOSED = 2;',
    '  window.EventSource = NoopES;',
    '})();',
  ].join('\n')

  const headEl = clone.querySelector('head')
  if (headEl) headEl.insertBefore(bootstrap, headEl.firstChild)
  else clone.insertBefore(bootstrap, clone.firstChild)

  const html = '<!DOCTYPE html>\n' + clone.outerHTML
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  pushToast('Exported HTML snapshot')
}
