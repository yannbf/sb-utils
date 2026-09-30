import fs from 'node:fs'
import path from 'node:path'
import * as find from 'empathic/find'
import * as walk from 'empathic/walk'

/**
 * Strip semver range operators (`^`, `~`, `>=`, …) and surrounding
 * whitespace from a declared dependency version string. Leaves
 * pre-release / build metadata intact since storybook's cache dirs
 * include them verbatim.
 */
function cleanVersion(raw: string): string | null {
  const trimmed = raw.replace(/^[\s^~>=<v]+/, '').trim()
  // Filter out tag specifiers ("latest", "next") and url-like ranges
  // ("github:foo", "file:..", "workspace:*") — we can't translate
  // those into a cache directory name.
  if (!trimmed || /^[a-zA-Z]/.test(trimmed) || trimmed.includes(':')) return null
  return trimmed
}

function readStorybookVersionFromPackageJson(file: string): string | null {
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf-8')
  } catch {
    return null
  }
  let pkg: any
  try {
    pkg = JSON.parse(raw)
  } catch {
    return null
  }
  const declared =
    pkg?.devDependencies?.storybook ?? pkg?.dependencies?.storybook
  if (typeof declared !== 'string') return null
  return cleanVersion(declared)
}

/**
 * Walk up from `projectRoot` (inclusive) looking for the first
 * `package.json` that declares `storybook` in `dependencies` or
 * `devDependencies`. Stops at the git root if we find one — this
 * keeps monorepo lookups bounded to the user's repository so we
 * don't accidentally pick up a stray `~/package.json`.
 *
 * Returns the declared version with semver prefix stripped (e.g.
 * `"^9.0.5"` → `"9.0.5"`), or null if no usable declaration is
 * found between `projectRoot` and the git root.
 */
export function findProjectStorybookVersion(projectRoot: string): string | null {
  const gitMatch = find.up('.git', { cwd: projectRoot })
  // .git is normally a directory but git worktrees use a regular file
  // pointing at the real gitdir — either way, dirname is the repo root.
  const last = gitMatch ? path.dirname(gitMatch) : undefined

  const dirs = walk.up('.', { cwd: projectRoot, last })
  for (const dir of dirs) {
    const pkg = path.join(dir, 'package.json')
    if (!fs.existsSync(pkg)) continue
    const version = readStorybookVersionFromPackageJson(pkg)
    if (version) return version
  }
  return null
}

/**
 * Pick the cache version directory that best matches the project's
 * declared storybook version. Exact match wins; otherwise null so
 * callers fall back to their own default (e.g. highest sorted).
 */
export function pickMatchingVersion(
  available: string[],
  declared: string | null,
): string | null {
  if (!declared || available.length === 0) return null
  if (available.includes(declared)) return declared
  return null
}
