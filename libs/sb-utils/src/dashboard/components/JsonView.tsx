/**
 * Recursive JSON tree renderer. Replaces the legacy `renderJson` HTML
 * string + inline `onclick="toggleJson(this)"` pair with proper Preact
 * components — collapse state lives in `useState` per node.
 *
 * Auto-collapses sub-trees deeper than depth 2 with more than 3
 * children, mirroring the original heuristic.
 */

import { useState } from 'preact/hooks'
import { isErrorEntry } from '../lib/event-helpers'

type AnyJson = unknown

/**
 * Renders a JSON tree.
 *
 * `highlightErrors` (used by the Payload tab) draws a red wavy
 * underline on any property name whose lowercased key contains 'error'
 * or 'fail' AND whose value is populated. Same rule as the
 * event-level `hasErrorPayload` heuristic — keeps the per-key
 * highlight in lock-step with the badge outline.
 */
export function JsonView({
  value,
  highlightErrors,
}: {
  value: AnyJson
  highlightErrors?: boolean
}) {
  return (
    <div class="json-view">
      <JsonNode value={value} depth={0} highlightErrors={!!highlightErrors} />
    </div>
  )
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

  // Auto-collapse deeply-nested branches with > 3 children — keeps the
  // initial render scannable instead of dumping a wall of text.
  const autoCollapse = depth >= 2 && entries.length > 3
  const [collapsed, setCollapsed] = useState(autoCollapse)

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
          setCollapsed((c) => !c)
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
