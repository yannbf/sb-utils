/**
 * Recursive JSON tree renderer. Replaces the legacy `renderJson` HTML
 * string + inline `onclick="toggleJson(this)"` pair with proper Preact
 * components — collapse state lives in `useState` per node.
 *
 * Auto-collapses sub-trees deeper than depth 2 with more than 3
 * children, mirroring the original heuristic.
 */

import { useState } from 'preact/hooks'

type AnyJson = unknown

export function JsonView({ value }: { value: AnyJson }) {
  return (
    <div class="json-view">
      <JsonNode value={value} depth={0} />
    </div>
  )
}

function JsonNode({ value, depth }: { value: AnyJson; depth: number }) {
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
      {collapsed && (
        <span class="json-collapsed-indicator">
          {' '}
          {entries.length} {isArray ? 'items' : 'keys'}{' '}
        </span>
      )}
      <span class={collapsed ? 'json-hidden' : undefined}>
        {'\n'}
        {entries.map(([key, v], i) => (
          <span key={String(key)}>
            {indent}
            {!isArray && (
              <>
                <span class="json-key">"{String(key)}"</span>
                {': '}
              </>
            )}
            <JsonNode value={v} depth={depth + 1} />
            {i < entries.length - 1 ? ',' : ''}
            {'\n'}
          </span>
        ))}
        {closingIndent}
      </span>
      <span class="json-bracket">{close}</span>
    </>
  )
}
