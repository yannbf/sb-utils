import fs from 'node:fs'
import path from 'node:path'

const LINT_CONFIG_PATTERNS = [
  /\.oxlintrc\.json$/,
  /eslint\.config\.(js|mjs|cjs|ts|mts|cts)$/,
  /\.eslintrc$/,
  /\.eslintrc\.(json|js|cjs|yml|yaml)$/,
]

const STORYBOOK_CONTENT_PATTERN =
  /eslint-plugin-storybook|plugin:storybook|["']storybook["']|\bstorybook\//

/**
 * Finds eslint/oxlint config files that reference Storybook's lint plugin.
 */
export function findLintConfigsWithStorybook(allPaths: string[]): string[] {
  return allPaths.filter((file) => {
    if (!LINT_CONFIG_PATTERNS.some((p) => p.test(file))) return false
    try {
      const content = fs.readFileSync(file, 'utf-8')
      return STORYBOOK_CONTENT_PATTERN.test(content)
    } catch {
      return false
    }
  })
}

/**
 * Removes Storybook references from a lint config file's content.
 * Dispatches on the filename since oxlint, flat eslint, and legacy eslint
 * configs each need different handling.
 */
export function removeStorybookFromLintConfig(
  filePath: string,
  content: string,
): string {
  const base = path.basename(filePath)

  if (base === '.oxlintrc.json') {
    return removeFromOxlintConfig(content)
  }
  if (/^eslint\.config\.(js|mjs|cjs|ts|mts|cts)$/.test(base)) {
    return removeFromEslintFlatConfig(content)
  }
  if (base === '.eslintrc' || base === '.eslintrc.json') {
    return removeFromEslintLegacyJson(content)
  }
  if (/^\.eslintrc\.(js|cjs|yml|yaml)$/.test(base)) {
    return removeFromEslintLegacyLineLevel(content)
  }

  return content
}

// --- Shared JSON helpers (oxlint + legacy eslint both operate on a rules/overrides shape) ---

function stripStorybookRuleKeys<T extends Record<string, unknown>>(
  rules: T | undefined,
): { rules: T | undefined; changed: boolean } {
  if (!rules) return { rules, changed: false }
  const entries = Object.entries(rules).filter(
    ([key]) => !key.startsWith('storybook/'),
  )
  const changed = entries.length !== Object.keys(rules).length
  return { rules: Object.fromEntries(entries) as T, changed }
}

function stripStorybookFromOverrides(
  overrides: unknown,
): { overrides: unknown; changed: boolean } {
  if (!Array.isArray(overrides)) return { overrides, changed: false }
  let changed = false
  const next = overrides
    .map((entry) => {
      if (entry && typeof entry === 'object' && 'rules' in entry) {
        const { rules, changed: rulesChanged } = stripStorybookRuleKeys(
          (entry as { rules?: Record<string, unknown> }).rules,
        )
        if (rulesChanged) changed = true
        return { ...entry, rules }
      }
      return entry
    })
    .filter((entry) => {
      if (
        entry &&
        typeof entry === 'object' &&
        'rules' in entry &&
        entry.rules &&
        Object.keys(entry.rules as Record<string, unknown>).length === 0
      ) {
        changed = true
        return false
      }
      return true
    })
  return { overrides: next, changed }
}

function formatJson(
  original: string,
  parsed: unknown,
): string {
  const indentMatch = original.match(/^[ \t]*[{[]\n([ \t]+)/m)
  const indent = indentMatch ? indentMatch[1].length : 2
  const hasTrailingNewline = /\n$/.test(original)
  let output = JSON.stringify(parsed, null, indent)
  if (hasTrailingNewline) output += '\n'
  return output
}

// --- Oxlint (.oxlintrc.json) ---

function removeFromOxlintConfig(content: string): string {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(content)
  } catch {
    return content
  }

  let changed = false

  if (Array.isArray(parsed.jsPlugins)) {
    const filtered = (parsed.jsPlugins as unknown[]).filter(
      (p) => p !== 'eslint-plugin-storybook',
    )
    if (filtered.length !== (parsed.jsPlugins as unknown[]).length) {
      changed = true
      if (filtered.length === 0) {
        delete parsed.jsPlugins
      } else {
        parsed.jsPlugins = filtered
      }
    }
  }

  if (parsed.rules) {
    const { rules, changed: rulesChanged } = stripStorybookRuleKeys(
      parsed.rules as Record<string, unknown>,
    )
    if (rulesChanged) changed = true
    parsed.rules = rules
  }

  if (Array.isArray(parsed.overrides)) {
    const { overrides, changed: overridesChanged } = stripStorybookFromOverrides(
      parsed.overrides,
    )
    if (overridesChanged) changed = true
    parsed.overrides = overrides
  }

  if (!changed) return content

  return formatJson(content, parsed)
}

// --- ESLint legacy JSON (.eslintrc / .eslintrc.json) ---

function removeFromEslintLegacyJson(content: string): string {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(content)
  } catch {
    return content
  }

  let changed = false

  if (typeof parsed.extends === 'string') {
    if (/^plugin:storybook\//.test(parsed.extends)) {
      delete parsed.extends
      changed = true
    }
  } else if (Array.isArray(parsed.extends)) {
    const filtered = (parsed.extends as unknown[]).filter(
      (e) => !(typeof e === 'string' && /^plugin:storybook\//.test(e)),
    )
    if (filtered.length !== (parsed.extends as unknown[]).length) {
      changed = true
      if (filtered.length === 0) delete parsed.extends
      else parsed.extends = filtered
    }
  }

  if (Array.isArray(parsed.plugins)) {
    const filtered = (parsed.plugins as unknown[]).filter(
      (p) => p !== 'storybook',
    )
    if (filtered.length !== (parsed.plugins as unknown[]).length) {
      changed = true
      if (filtered.length === 0) delete parsed.plugins
      else parsed.plugins = filtered
    }
  }

  if (parsed.rules) {
    const { rules, changed: rulesChanged } = stripStorybookRuleKeys(
      parsed.rules as Record<string, unknown>,
    )
    if (rulesChanged) changed = true
    parsed.rules = rules
  }

  if (Array.isArray(parsed.overrides)) {
    const { overrides, changed: overridesChanged } = stripStorybookFromOverrides(
      parsed.overrides,
    )
    if (overridesChanged) changed = true
    parsed.overrides = overrides
  }

  if (!changed) return content

  return formatJson(content, parsed)
}

// --- ESLint flat config (eslint.config.*) ---

function removeFromEslintFlatConfig(content: string): string {
  let result = content
  let identifier: string | null = null

  const importRegex =
    /^[ \t]*import\s+(\w+)\s+from\s+['"]eslint-plugin-storybook(?:\/[^'"]*)?['"]\s*;?\s*\n?/m
  const importMatch = result.match(importRegex)
  if (importMatch) {
    identifier = importMatch[1]
    result = result.replace(importRegex, '')
  }

  if (!identifier) {
    const requireRegex =
      /^[ \t]*(?:const|let|var)\s+(\w+)\s*=\s*require\(\s*['"]eslint-plugin-storybook(?:\/[^'"]*)?['"]\s*\)\s*;?\s*\n?/m
    const requireMatch = result.match(requireRegex)
    if (requireMatch) {
      identifier = requireMatch[1]
      result = result.replace(requireRegex, '')
    }
  }

  if (!identifier) {
    return collapseBlankLines(content)
  }

  // Spread entries: ...storybook.configs['flat/recommended'] or ["..."], own line or inline.
  // Only consume trailing whitespace up to one newline, so the next line keeps its indent.
  const spreadRegex = new RegExp(
    `[ \\t]*\\.\\.\\.${identifier}\\.configs\\[(['"])[^'"]*\\1\\][ \\t]*,?[ \\t]*\\n?`,
    'g',
  )
  result = result.replace(spreadRegex, '')

  // Standalone array elements whose only plugin entry is this identifier:
  // { plugins: { storybook } },
  const pluginsOnlyElementRegex = new RegExp(
    `[ \\t]*\\{\\s*plugins:\\s*\\{\\s*${identifier}\\s*\\}\\s*\\}\\s*,?\\s*\\n?`,
    'g',
  )
  result = result.replace(pluginsOnlyElementRegex, '')

  result = cleanDanglingCommas(result)
  result = collapseBlankLines(result)

  return result
}

// Trailing commas before `]` are valid JS and stay untouched — only repair the
// holes an inline removal can leave (`, ,` runs and a leading `[,`).
function cleanDanglingCommas(content: string): string {
  return content.replace(/,(\s*,)+/g, ',').replace(/\[\s*,/g, '[')
}

function collapseBlankLines(content: string): string {
  return content.replace(/\n{3,}/g, '\n\n')
}

// --- ESLint legacy, non-JSON (.eslintrc.js/.cjs/.yml/.yaml) ---
// Structural edits are too risky here; only drop lines that are safe and
// self-contained.

function removeFromEslintLegacyLineLevel(content: string): string {
  const lines = content.split('\n')
  const filtered = lines.filter((line) => {
    if (/plugin:storybook\/recommended/.test(line)) return false
    if (/^\s*['"]?storybook\/[\w-]+['"]?\s*:\s*.+,?\s*$/.test(line)) return false
    if (/^\s*['"]storybook['"],?\s*$/.test(line)) return false
    return true
  })

  if (filtered.length === lines.length) return content

  return collapseBlankLines(filtered.join('\n'))
}
