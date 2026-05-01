// @ts-nocheck
/**
 * Cache view — toolbar + entries list + per-entry diff/edit. Mounts onto
 * the existing #cacheView IDs the JSX shell renders. Public API:
 * { refresh, onCacheEvent, setAllExpanded }.
 *
 * Native Preact CacheView is tracked in IMPROVEMENTS.md.
 */

import { escapeHtml } from '../lib/format'
import { renderJsonHtml } from '../lib/legacy-html'

export function setupCacheView(_state: any, _scheduleMirror: (s: any) => void) {
  const renderJson = renderJsonHtml
const CacheView = (() => {
  // Server-resolved cache state. Edit mode is purely client-side now.
  let info = { cacheStatus: 'not-found', projectRoot: null, cacheRoot: null, version: null };
  let entries = [];
  // Edit mode controls whether write affordances (Edit/Delete/Clear) appear.
  // Persisted in localStorage per-browser. Never on in snapshots — they're
  // read-only artifacts and the underlying cache isn't mutable from here.
  let editMode = false;
  if (!window.__SNAPSHOT__) {
    try { editMode = localStorage.getItem('sbutils.eventlog.cache.editMode') === '1'; } catch (_) {}
  }
  // Track expanded entries by `${namespace}/${key}` so refresh doesn't collapse them.
  const expanded = new Set();
  // Same key set used to remember which entries are mid-edit.
  const editing = new Map();

  const $ = (id) => document.getElementById(id);

  function entryKey(entry) { return entry.namespace + '/' + entry.key; }

  async function fetchInfo() {
    try {
      const res = await fetch('/cache/info');
      info = await res.json();
    } catch (err) {
      info = { cacheStatus: 'unreadable', projectRoot: null, cacheRoot: null, version: null, error: String(err) };
    }
    renderHeader();
  }

  async function fetchEntries() {
    if (info.cacheStatus !== 'found') { entries = []; renderEntries(); return; }
    try {
      const res = await fetch('/cache/entries');
      const data = await res.json();
      entries = Array.isArray(data.entries) ? data.entries : [];
    } catch (err) {
      entries = [];
    }
    renderEntries();
  }

  function renderHeader() {
    const status = info.cacheStatus || 'not-found';
    const statusEl = $('cacheRootStatus');
    statusEl.textContent = status === 'found' ? 'Active' : status === 'unreadable' ? 'Unreadable' : 'Not found';
    statusEl.className = 'cache-root-status ' + (status === 'found' ? '' : status);

    const pathEl = $('cacheRootPath');
    pathEl.textContent = info.projectRoot || 'No project resolved — pass --project-root or click “Change root…”';

    const versionEl = $('cacheRootVersion');
    if (info.version) {
      versionEl.style.display = '';
      versionEl.textContent = 'sb ' + info.version;
    } else {
      versionEl.style.display = 'none';
    }

    // Edit mode toggle visual state + dependent affordances.
    $('cacheEditToggleSwitch').classList.toggle('on', editMode);
    $('cacheWritesBanner').style.display = editMode ? '' : 'none';
    $('cacheClearBtn').style.display = editMode && status === 'found' ? '' : 'none';

    // Empty-state visibility.
    $('cacheEmpty').style.display = status === 'found' ? 'none' : '';
  }

  function renderEntries() {
    const container = $('cacheEntries');
    if (info.cacheStatus !== 'found') { container.innerHTML = ''; return; }

    // Group by namespace.
    const byNs = new Map();
    for (const e of entries) {
      if (!byNs.has(e.namespace)) byNs.set(e.namespace, []);
      byNs.get(e.namespace).push(e);
    }
    const namespaces = Array.from(byNs.keys()).sort();

    if (namespaces.length === 0) {
      container.innerHTML = '<div class="cache-empty"><h3>Cache root is empty</h3><p>No entries written yet under <code>' + escapeHtml(info.cacheRoot || '') + '</code></p></div>';
      return;
    }

    container.innerHTML = namespaces.map(ns => {
      const items = byNs.get(ns).sort((a, b) => a.key.localeCompare(b.key));
      return (
        '<div class="cache-namespace" data-ns="' + escapeHtml(ns) + '">' +
          '<div class="cache-namespace-header">' +
            '<span>' + escapeHtml(ns) + '</span>' +
            '<span class="cache-namespace-count">' + items.length + ' entr' + (items.length === 1 ? 'y' : 'ies') + '</span>' +
          '</div>' +
          items.map(renderEntry).join('') +
        '</div>'
      );
    }).join('');

    // Re-bind events.
    container.querySelectorAll('.cache-entry-header').forEach(h => {
      h.addEventListener('click', () => {
        const wrap = h.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        if (expanded.has(key)) { expanded.delete(key); wrap.classList.remove('expanded'); }
        else { expanded.add(key); wrap.classList.add('expanded'); }
      });
    });
    container.querySelectorAll('[data-action="copy"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = b.closest('.cache-entry').dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        navigator.clipboard.writeText(JSON.stringify(entry.content, null, 2));
        b.textContent = 'Copied!';
        setTimeout(() => { b.textContent = 'Copy content'; }, 1200);
      });
    });
    container.querySelectorAll('[data-action="edit"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        editing.set(key, JSON.stringify(entry.content, null, 2));
        renderEntries();
      });
    });
    container.querySelectorAll('[data-action="cancel-edit"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = b.closest('.cache-entry').dataset.fullKey;
        editing.delete(key);
        renderEntries();
      });
    });
    container.querySelectorAll('[data-action="save-edit"]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        const ta = wrap.querySelector('textarea');
        let parsed;
        try { parsed = JSON.parse(ta.value); }
        catch (err) { alert('Invalid JSON: ' + err.message); return; }
        try {
          const url = '/cache/entries/' + encodeURIComponent(entry.key) + '?namespace=' + encodeURIComponent(entry.namespace);
          const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            alert('Write failed: ' + (body.error || res.statusText));
            return;
          }
          editing.delete(key);
          await fetchEntries();
        } catch (err) {
          alert('Write failed: ' + err.message);
        }
      });
    });
    container.querySelectorAll('[data-action="delete"]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const wrap = b.closest('.cache-entry');
        const key = wrap.dataset.fullKey;
        const entry = entries.find(x => entryKey(x) === key);
        if (!entry) return;
        if (!confirm('Delete cache entry "' + entry.key + '" in namespace "' + entry.namespace + '"?')) return;
        try {
          const url = '/cache/entries/' + encodeURIComponent(entry.key) + '?namespace=' + encodeURIComponent(entry.namespace);
          const res = await fetch(url, { method: 'DELETE' });
          if (!res.ok && res.status !== 204) {
            const body = await res.json().catch(() => ({}));
            alert('Delete failed: ' + (body.error || res.statusText));
            return;
          }
          editing.delete(key);
          expanded.delete(key);
          await fetchEntries();
        } catch (err) {
          alert('Delete failed: ' + err.message);
        }
      });
    });
  }

  function renderEntry(entry) {
    const fullKey = entryKey(entry);
    const isExpanded = expanded.has(fullKey);
    const isEditing = editing.has(fullKey);
    const ttlTag = entry.ttl
      ? '<span class="ttl-tag' + (entry.expired ? ' expired' : '') + '">' +
          (entry.expired ? 'expired' : 'ttl') + ' ' +
          formatTimeRemaining(entry.ttl) +
        '</span>'
      : '';

    let bodyHtml;
    if (isEditing) {
      bodyHtml =
        '<div class="cache-entry-body">' +
          (editMode
            ? '<div class="cache-entry-actions">' +
                '<button data-action="save-edit">Save</button>' +
                '<button data-action="cancel-edit">Cancel</button>' +
              '</div>'
            : '') +
          '<div class="cache-entry-file">' + escapeHtml(entry.file || '') + '</div>' +
          '<div class="cache-entry-content"><textarea spellcheck="false">' +
            escapeHtml(editing.get(fullKey)) +
          '</textarea></div>' +
        '</div>';
    } else {
      const actions = editMode
        ? '<button data-action="copy">Copy content</button>' +
          '<button data-action="edit">Edit</button>' +
          '<button data-action="delete" class="danger">Delete</button>'
        : '<button data-action="copy">Copy content</button>';
      // Wrap renderJson output in `.json-view` so the same `white-space:
      // pre-wrap` rule that lays out dashboard event-card JSON applies here —
      // otherwise the rendered output collapses onto a single line.
      bodyHtml =
        '<div class="cache-entry-body">' +
          '<div class="cache-entry-actions">' + actions + '</div>' +
          '<div class="cache-entry-file">' + escapeHtml(entry.file || '') + '</div>' +
          '<div class="cache-entry-content"><div class="json-view">' +
            renderJson(entry.content, 0, 'cache-' + fullKey) +
          '</div></div>' +
        '</div>';
    }

    return (
      '<div class="cache-entry' + (isExpanded ? ' expanded' : '') + '" data-full-key="' + escapeHtml(fullKey) + '">' +
        '<div class="cache-entry-header">' +
          '<span class="cache-entry-expand"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>' +
          '<span class="cache-entry-key">' + escapeHtml(entry.key) + '</span>' +
          '<span class="cache-entry-meta">' +
            ttlTag +
            '<span>' + formatBytes(entry.size) + '</span>' +
            '<span>' + formatRelativeTime(entry.mtime) + '</span>' +
          '</span>' +
        '</div>' +
        bodyHtml +
      '</div>'
    );
  }

  function formatBytes(n) {
    if (n == null) return '';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  }
  function formatRelativeTime(ts) {
    if (!ts) return '';
    const delta = Date.now() - ts;
    if (delta < 60_000) return 'just now';
    if (delta < 3_600_000) return Math.round(delta / 60_000) + 'm ago';
    if (delta < 86_400_000) return Math.round(delta / 3_600_000) + 'h ago';
    return Math.round(delta / 86_400_000) + 'd ago';
  }
  function formatTimeRemaining(ttlEpoch) {
    const delta = ttlEpoch - Date.now();
    if (delta < 0) return Math.abs(Math.round(delta / 60_000)) + 'm ago';
    if (delta < 3_600_000) return 'in ' + Math.round(delta / 60_000) + 'm';
    if (delta < 86_400_000) return 'in ' + Math.round(delta / 3_600_000) + 'h';
    return 'in ' + Math.round(delta / 86_400_000) + 'd';
  }

  async function refresh() {
    await fetchInfo();
    await fetchEntries();
  }

  async function changeRoot() {
    const next = prompt(
      'Switch project root.\n\nEnter the absolute path to a project that has node_modules/.cache/storybook. Leave empty to auto-discover from the server\'s cwd.',
      info.projectRoot || ''
    );
    if (next == null) return;
    try {
      const res = await fetch('/cache/project-root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectRoot: next.trim() || null }),
      });
      const data = await res.json();
      info = data;
      renderHeader();
      await fetchEntries();
    } catch (err) {
      alert('Failed to change project root: ' + err.message);
    }
  }

  async function clearAll() {
    if (!editMode) return;
    if (!confirm('Wipe ALL cache entries under ' + info.cacheRoot + '?')) return;
    try {
      const res = await fetch('/cache/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { alert('Clear failed: ' + (data.error || res.statusText)); return; }
      await fetchEntries();
    } catch (err) { alert('Clear failed: ' + err.message); }
  }

  function toggleEditMode() {
    if (window.__SNAPSHOT__) return; // snapshots are read-only by construction
    editMode = !editMode;
    try { localStorage.setItem('sbutils.eventlog.cache.editMode', editMode ? '1' : '0'); } catch (_) {}
    renderHeader();
    renderEntries();
  }

  // Live updates: when a cache:write or cache:delete event arrives via SSE,
  // refresh entries (cheap — server is local).
  function onCacheEvent(event) {
    if (state.view === 'cache') fetchEntries();
  }

  // Driven by the global Expand/Collapse-all button when the cache view
  // is active. Marks every entry expanded/collapsed and persists the
  // intent in the local `expanded` set so subsequent fetchEntries() runs
  // don't reset it.
  function setAllExpanded(shouldExpand) {
    expanded.clear();
    if (shouldExpand) {
      for (const e of entries) expanded.add(entryKey(e));
    }
    renderEntries();
  }

  // Initial fetch + bindings. We fetch BOTH info and entries up-front
  // (not just info) so the Cache tab is fully populated when the user
  // first visits it — important in HTML snapshots, where the user
  // shouldn't have to switch tabs and back to trigger entry rendering.
  //
  // The original inline script wrapped this in DOMContentLoaded, but
  // when this module runs the DOM is already parsed (it imports after
  // Preact has mounted), so we execute synchronously.
  function _bootstrap() {
    $('cacheRefreshBtn').addEventListener('click', refresh);
    $('cacheChangeRootBtn').addEventListener('click', changeRoot);
    $('cacheClearBtn').addEventListener('click', clearAll);
    $('cacheEditToggleRow').addEventListener('click', toggleEditMode);
    refresh();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bootstrap);
  } else {
    _bootstrap();
  }

  return { refresh, onCacheEvent, setAllExpanded };
})();

  return CacheView
}
