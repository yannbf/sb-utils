import { execSync } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'

export function walk(
  dir: string,
  ignoredDirs: string[] = [
    'node_modules',
    'storybook-static',
    'dist',
    'build',
    '.git',
    '.gitignore',
    '.yarn',
  ]
): string[] {
  let results: string[] = []

  try {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        if (ignoredDirs.includes(path.basename(fullPath))) continue
        results = results.concat(walk(fullPath, ignoredDirs))
      } else {
        try {
          if (fs.existsSync(fullPath)) {
            results.push(fullPath)
          }
        } catch {
          // broken symlink or inaccessible
        }
      }
    }
  } catch {
    // unreadable dir
  }

  return results
}
export function getProjectRoot(): string {
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
    }).trim()
  } catch {
    console.warn(
      '⚠️  Not inside a Git repository. Falling back to current working directory.'
    )
    return process.cwd()
  }
}
export function getRelativePath(absolutePath: string): string {
  const root = getProjectRoot()
  return path.relative(root, absolutePath)
}
export function deleteDir(targetPath: string): void {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true })
  }
}
export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
export function cleanPackageJson(pkgPath: string): string[] {
  const content = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  let changed = false
  const removed: string[] = []
  ;(['dependencies', 'devDependencies'] as const).forEach((section) => {
    if (content[section]) {
      for (const key of Object.keys(content[section])) {
        if (key.includes('storybook')) {
          delete content[section][key]
          removed.push(key)
          changed = true
        }
      }
    }
  })

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(content, null, 2))
  }

  return removed
}
