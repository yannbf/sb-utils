/**
 * Recursive JSON tree renderer. Replaces the legacy `renderJson` HTML
 * string + inline `onclick="toggleJson(this)"` pair with proper Preact
 * components — collapse state lives in `useState` per node.
 *
 * Default render shows depth 0–2 expanded; depth ≥ 3 collapsed. Per-
 * node toggles are isolated to that node — clicking a caret never
 * affects siblings or ancestors. The toolbar's expand/collapse-to-top
 * is global (clears all per-node overrides via a remount key) so the
 * action does what it says.
 */

import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { isErrorEntry } from '../lib/event-helpers'

type AnyJson = unknown

// Cap for the toolbar's "expand all" action. Force-expanding the
// entire tree of a 100k-node payload renders that many Preact
// components and locks the tab. 5 levels is enough to see any
// reasonable telemetry payload in full while keeping pathological
// blobs (test-result dumps, large diffs) safe.
const MAX_EXPAND_DEPTH = 5
// Default initial-render depth: anything at depth >= AUTO_COLLAPSE_DEPTH
// starts collapsed so the user lands on a scannable view of the tree's
// shape. Two levels of context (root + first nested layer + their
// inline children) is enough for typical telemetry payloads without
// overwhelming on huge ones.
const AUTO_COLLAPSE_DEPTH = 3

export type ForceMode = 'default' | 'expand' | 'collapseToTop'
type ForceCtx = { mode: ForceMode }
const ForceContext = createContext<ForceCtx>({ mode: 'default' })

/**
 * Standalone toggle button. Hosted by parent components (EventCard,
 * TimelineDrawer, CacheView) so it can sit in the SAME floating
 * tools row as CopyButton — keeping both controls anchored to the
 * top-right of the JSON content area.
 *
 * The button is a no-op for primitives / empty containers; it simply
 * doesn't render in those cases.
 */
export function JsonViewExpandToggle({
  mode,
  setMode,
  value,
}: {
  mode: ForceMode
  setMode: (m: ForceMode) => void
  value: AnyJson
}) {
  if (!hasAnyCollapsible(value)) return null
  const isExpanded = mode === 'expand'
  const toggle = () => setMode(isExpanded ? 'collapseToTop' : 'expand')
  return (
    <button
      type="button"
      class="json-view-tool-btn"
      title={isExpanded ? 'Collapse to root' : 'Expand all'}
      aria-label={isExpanded ? 'Collapse to root' : 'Expand all'}
      onClick={toggle}
    >
      {isExpanded ? (
        // Collapse: four arrows pointing inward — apex of each
        // chevron sits on the inner end of the diagonal.
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="5 10 10 10 10 5" />
          <line x1="3" y1="3" x2="10" y2="10" />
          <polyline points="14 5 14 10 19 10" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <polyline points="5 14 10 14 10 19" />
          <line x1="3" y1="21" x2="10" y2="14" />
          <polyline points="14 19 14 14 19 14" />
          <line x1="21" y1="21" x2="14" y2="14" />
        </svg>
      ) : (
        // Expand: four arrows pointing outward to each corner — apex
        // of each chevron sits at the corner.
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 3 3 3 3 9" />
          <line x1="10" y1="10" x2="3" y2="3" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <polyline points="3 15 3 21 9 21" />
          <line x1="10" y1="14" x2="3" y2="21" />
          <polyline points="15 21 21 21 21 15" />
          <line x1="14" y1="14" x2="21" y2="21" />
        </svg>
      )}
    </button>
  )
}

/**
 * Renders a JSON tree.
 *
 * `highlightErrors` (used by the Payload tab) draws a red wavy
 * underline on any property name whose lowercased key contains 'error'
 * or 'fail' AND whose value is populated.
 *
 * `mode` / `setMode` are optional controlled-mode props. When the
 * parent wants the JsonView's expand/collapse toggle to live in its
 * own toolbar (alongside CopyButton, etc.) it lifts state and passes
 * both. Uncontrolled callers don't need them — JsonView manages an
 * internal mode and renders its own floating toggle.
 */
export function JsonView({
  value,
  highlightErrors,
  mode,
  setMode,
}: {
  value: AnyJson
  highlightErrors?: boolean
  mode?: ForceMode
  setMode?: (m: ForceMode) => void
}) {
  const [internalMode, setInternalMode] = useState<ForceMode>('default')
  const effectiveMode = mode ?? internalMode
  const effectiveSetMode = setMode ?? setInternalMode
  const isControlled = setMode !== undefined
  const showInternalToolbar = !isControlled && hasAnyCollapsible(value)
  const ctx: ForceCtx = { mode: effectiveMode }
  return (
    <div class="json-view">
      {showInternalToolbar && (
        <div class="json-view-toolbar" aria-label="JSON tree controls">
          <JsonViewExpandToggle
            mode={effectiveMode}
            setMode={effectiveSetMode}
            value={value}
          />
        </div>
      )}
      <ForceContext.Provider value={ctx}>
        {/*
          `key` ties the subtree's identity to the current mode.
          Toggling the toolbar bumps to a new mode, Preact unmounts
          the old tree and mounts a fresh one — every node's local
          override resets to null and falls back to the new mode's
          rule. Per-node clicks DON'T change `mode`, so they don't
          trigger this remount and don't disturb their siblings.
        */}
        <JsonNode key={effectiveMode} value={value} depth={0} highlightErrors={!!highlightErrors} />
      </ForceContext.Provider>
    </div>
  )
}

// Quick scan: does the tree contain at least one node that can be
// collapsed (a non-empty object or array)? Bounded so a giant blob
// can't stall render — once we find one, we're done.
function hasAnyCollapsible(value: AnyJson): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.length > 0
  return Object.keys(value as Record<string, unknown>).length > 0
}

function JsonNode({
  value,
  depth,
  highlightErrors,
}: {
  value: AnyJson
  depth: number
  highlightErrors: boolean
}) {
  if (value === null) return <span class="json-null">null</span>
  if (value === undefined) return <span class="json-null">undefined</span>
  if (typeof value === 'string') return <span class="json-string">"{value}"</span>
  if (typeof value === 'number') return <span class="json-number">{value}</span>
  if (typeof value === 'boolean') return <span class="json-boolean">{String(value)}</span>

  const isArray = Array.isArray(value)
  const entries: Array<[string | number, AnyJson]> = isArray
    ? (value as AnyJson[]).map((v, i) => [i, v] as [number, AnyJson])
    : Object.entries(value as Record<string, AnyJson>)
  const open = isArray ? '[' : '{'
  const close = isArray ? ']' : '}'

  if (entries.length === 0) {
    return <span class="json-bracket">{open + close}</span>
  }

  const force = useContext(ForceContext)

  // Resolution priority:
  //   1. localOverride — set by the user clicking THIS caret. Wins
  //      over every other rule for this single node, ensuring per-
  //      node clicks never bleed into siblings.
  //   2. force-mode rule — depth-based, applied to the whole tree.
  //   3. autoCollapse — the depth ≥ 3 default for "no user action".
  //
  // localOverride starts null. The toolbar's mode change remounts the
  // subtree (see JsonView's `key={mode}` trick), so user toggles from
  // one bulk action don't survive into the next.
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)
  const forceCollapsed: boolean | null =
    force.mode === 'expand'
      ? depth >= MAX_EXPAND_DEPTH
      : force.mode === 'collapseToTop'
        ? depth >= 1
        : null
  const autoCollapse = depth >= AUTO_COLLAPSE_DEPTH
  const collapsed =
    localOverride !== null
      ? localOverride
      : forceCollapsed !== null
        ? forceCollapsed
        : autoCollapse

  const toggle = () => {
    // Only flip THIS node's local state. Don't touch the global mode
    // or the local state of any sibling — those stay put.
    setLocalOverride(!collapsed)
  }

  const indent = '  '.repeat(depth + 1)
  const closingIndent = '  '.repeat(depth)

  return (
    <>
      <span class="json-bracket">{open}</span>
      <button
        type="button"
        class="json-toggle"
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
      >
        {collapsed ? '▶' : '▼'}
      </button>
      {collapsed ? (
        <span class="json-collapsed-indicator">
          {' '}
          {entries.length} {isArray ? 'items' : 'keys'}{' '}
        </span>
      ) : (
        <span>
          {'\n'}
          {entries.map(([key, v], i) => {
            const isErrKey =
              !isArray && highlightErrors && isErrorEntry(String(key), v)
            return (
              <span key={String(key)}>
                {indent}
                {!isArray && (
                  <>
                    <span
                      class={'json-key' + (isErrKey ? ' error-key' : '')}
                      title={isErrKey ? 'Error/failure indicator' : undefined}
                    >
                      "{String(key)}"
                    </span>
                    {': '}
                  </>
                )}
                <JsonNode value={v} depth={depth + 1} highlightErrors={highlightErrors} />
                {i < entries.length - 1 ? ',' : ''}
                {'\n'}
              </span>
            )
          })}
          {closingIndent}
        </span>
      )}
      <span class="json-bracket">{close}</span>
    </>
  )
}
