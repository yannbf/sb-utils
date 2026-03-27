import fs from 'node:fs'

const VITEST_CONFIG_PATTERNS = [
  /vitest\.config\.\w+$/,
  /vite\.config\.\w+$/,
  /vitest\.workspace\.\w+$/,
]

/**
 * Finds vitest/vite config files that contain the Storybook vitest addon plugin.
 */
export function findVitestConfigsWithStorybook(allPaths: string[]): string[] {
  return allPaths.filter((file) => {
    if (!VITEST_CONFIG_PATTERNS.some((p) => p.test(file))) return false
    try {
      const content = fs.readFileSync(file, 'utf-8')
      return (
        /@storybook\/addon-vitest/.test(content) ||
        /storybookTest\s*\(/.test(content)
      )
    } catch {
      return false
    }
  })
}

/**
 * Removes the Storybook vitest plugin from a vitest/vite config file content.
 * Handles removal of:
 * - The storybook project entry from workspace/projects arrays
 * - The storybookTest import
 * - The dirname variable declaration
 * - The storybook docs comment
 * - Unused imports (path, fileURLToPath, defineConfig from vitest/config)
 */
export function removeStorybookVitestPlugin(content: string): string {
  // Step 1: Remove the storybook project entry from workspace/projects array
  content = removeStorybookProjectEntry(content)

  // Step 2: Remove storybook-specific lines
  let lines = content.split('\n')

  lines = lines.filter((l) => !/@storybook\/addon-vitest/.test(l))
  lines = lines.filter(
    (l) => !/\/\/.*storybook\.js\.org\/docs.*vitest-addon/.test(l)
  )
  lines = lines.filter(
    (l) => !/const\s+dirname\s*=\s*typeof\s+__dirname/.test(l)
  )

  content = lines.join('\n')

  // Step 3: Remove imports that are no longer used
  content = removeUnusedImport(
    content,
    /^[ \t]*import\s+path\s+from\s+['"]node:path['"]\s*;?\s*$/m,
    /\bpath\b/
  )
  content = removeUnusedImport(
    content,
    /^[ \t]*import\s*\{\s*fileURLToPath\s*\}\s*from\s+['"]node:url['"]\s*;?\s*$/m,
    /\bfileURLToPath\b/
  )
  content = removeUnusedImport(
    content,
    /^[ \t]*import\s*\{\s*defineConfig\s*\}\s*from\s+['"]vitest\/config['"]\s*;?\s*$/m,
    /\bdefineConfig\b/
  )

  // Step 4: Clean up consecutive blank lines (max 1 blank line)
  content = content.replace(/\n{3,}/g, '\n\n')

  return content
}

/**
 * Removes an import line if the imported identifier is no longer used in the rest of the content.
 */
function removeUnusedImport(
  content: string,
  importPattern: RegExp,
  usagePattern: RegExp
): string {
  const match = content.match(importPattern)
  if (!match || match.index === undefined) return content

  const before = content.slice(0, match.index)
  const after = content.slice(match.index + match[0].length)
  const withoutImport = before + after

  if (!usagePattern.test(withoutImport)) {
    return withoutImport
  }

  return content
}

/**
 * Finds and removes the storybook project entry ({...} containing storybookTest)
 * from a workspace/projects array using brace-matching.
 */
function removeStorybookProjectEntry(content: string): string {
  const storybookTestMatch = content.match(/storybookTest\s*\(/)
  if (!storybookTestMatch || storybookTestMatch.index === undefined)
    return content

  const idx = storybookTestMatch.index

  // Find the opening { of the enclosing project entry by walking backwards
  let depth = 0
  let openIdx = -1
  for (let i = idx - 1; i >= 0; i--) {
    if (content[i] === '}') depth++
    if (content[i] === '{') {
      if (depth === 0) {
        openIdx = i
        break
      }
      depth--
    }
  }
  if (openIdx === -1) return content

  // Find the closing } of the project entry by walking forwards
  depth = 0
  let closeIdx = -1
  for (let i = openIdx; i < content.length; i++) {
    if (content[i] === '{') depth++
    if (content[i] === '}') {
      depth--
      if (depth === 0) {
        closeIdx = i
        break
      }
    }
  }
  if (closeIdx === -1) return content

  let removeStart = openIdx
  let removeEnd = closeIdx + 1

  // Check for a leading comma (this entry is not the first in the array)
  let b = openIdx - 1
  while (b >= 0 && /\s/.test(content[b])) b--
  if (b >= 0 && content[b] === ',') {
    removeStart = b
  } else {
    // No leading comma — check for a trailing comma (this entry is the first)
    let a = closeIdx + 1
    while (a < content.length && /[ \t]/.test(content[a])) a++
    if (a < content.length && content[a] === ',') {
      removeEnd = a + 1
    }
  }

  return content.slice(0, removeStart) + content.slice(removeEnd)
}
