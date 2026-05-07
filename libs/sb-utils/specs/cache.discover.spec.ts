import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveCacheLocation, pickActiveVersion } from '../src/cache/discover'
import { findProjectStorybookVersion } from '../src/cache/storybook-version'

function makeProject(opts: {
  versions: string[]
  storybookDep?: string | null
  withGit?: boolean
}): string {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-utils-discover-'))
  const cacheRoot = path.join(root, 'node_modules', '.cache', 'storybook')
  for (const v of opts.versions) {
    mkdirSync(path.join(cacheRoot, v, 'default', 'dev-server'), {
      recursive: true,
    })
  }
  const pkg: any = { name: 'fake', version: '0.0.0' }
  if (opts.storybookDep) pkg.devDependencies = { storybook: opts.storybookDep }
  writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  if (opts.withGit !== false) mkdirSync(path.join(root, '.git'))
  return root
}

describe('pickActiveVersion', () => {
  it('exact match wins over highest-sorted', () => {
    expect(pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], '9.0.5')).toBe('9.0.5')
  })
  it('falls back to highest-sorted when preferred is missing', () => {
    expect(pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], '7.0.0')).toBe('10.1.0')
    expect(pickActiveVersion(['8.6.0', '9.0.5'], null)).toBe('9.0.5')
  })
})

describe('resolveCacheLocation versions', () => {
  const tmpDirs: string[] = []
  afterEach(() => {
    while (tmpDirs.length) {
      try {
        rmSync(tmpDirs.pop()!, { recursive: true, force: true })
      } catch {
        /* noop */
      }
    }
  })

  it('lists every version dir under cacheRoot', () => {
    const root = makeProject({ versions: ['8.6.0', '9.0.5', '10.1.0'] })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.status).toBe('found')
    expect(loc.versions).toEqual(['10.1.0', '8.6.0', '9.0.5'])
  })

  it('auto-picks the version declared in package.json', () => {
    const root = makeProject({
      versions: ['8.6.0', '9.0.5', '10.1.0'],
      storybookDep: '^9.0.5',
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('9.0.5')
    expect(loc.projectStorybookVersion).toBe('9.0.5')
    expect(loc.otherVersions).toEqual(['10.1.0', '8.6.0'])
  })

  it('falls back to highest-sorted when the declared version has no dir', () => {
    const root = makeProject({
      versions: ['8.6.0', '10.1.0'],
      storybookDep: '~9.0.0',
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('10.1.0')
    expect(loc.projectStorybookVersion).toBe('9.0.0')
  })

  it('honours an explicit version override', () => {
    const root = makeProject({
      versions: ['8.6.0', '9.0.5', '10.1.0'],
      storybookDep: '^10.1.0',
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root, version: '8.6.0' })
    expect(loc.version).toBe('8.6.0')
    expect(loc.versions).toContain('10.1.0')
  })

  it('marks status not-found when an explicit version does not exist', () => {
    const root = makeProject({
      versions: ['10.1.0'],
      storybookDep: '^10.1.0',
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root, version: '7.0.0' })
    expect(loc.status).toBe('not-found')
    expect(loc.version).toBeNull()
    expect(loc.versions).toEqual(['10.1.0'])
  })
})

describe('findProjectStorybookVersion', () => {
  const tmpDirs: string[] = []
  afterEach(() => {
    while (tmpDirs.length) {
      try {
        rmSync(tmpDirs.pop()!, { recursive: true, force: true })
      } catch {
        /* noop */
      }
    }
  })

  it('reads devDependencies.storybook and strips the semver prefix', () => {
    const root = makeProject({
      versions: ['10.1.0'],
      storybookDep: '^10.1.0',
    })
    tmpDirs.push(root)
    expect(findProjectStorybookVersion(root)).toBe('10.1.0')
  })

  it('walks up to a parent package.json, stopping at the git root', () => {
    const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'sb-utils-monorepo-'))
    tmpDirs.push(repoRoot)
    mkdirSync(path.join(repoRoot, '.git'))
    writeFileSync(
      path.join(repoRoot, 'package.json'),
      JSON.stringify({
        name: 'monorepo',
        devDependencies: { storybook: '~9.0.5' },
      }),
    )
    const appDir = path.join(repoRoot, 'apps', 'web')
    mkdirSync(appDir, { recursive: true })
    // Leaf package.json declares no storybook — walk up should find
    // the root one.
    writeFileSync(
      path.join(appDir, 'package.json'),
      JSON.stringify({ name: 'web', dependencies: {} }),
    )
    expect(findProjectStorybookVersion(appDir)).toBe('9.0.5')
  })

  it('returns null for tag specifiers like "latest"', () => {
    const root = makeProject({ versions: [], storybookDep: 'latest' })
    tmpDirs.push(root)
    expect(findProjectStorybookVersion(root)).toBeNull()
  })
})
