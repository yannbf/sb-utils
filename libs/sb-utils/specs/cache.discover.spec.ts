import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs, { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveCacheLocation, pickActiveVersion } from '../src/cache/discover'
import { findProjectStorybookVersion } from '../src/cache/storybook-version'

function makeProject(opts: {
  versions: string[]
  storybookDep?: string | null
  withGit?: boolean
  // mtime (ms) per version dir. Stamped post-creation so tests can
  // express "this version was updated more recently than that one"
  // independently of insertion order. Versions not listed retain
  // their natural creation mtime (oldest in `versions`-list order).
  mtimes?: Record<string, number>
}): string {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-utils-discover-'))
  const cacheRoot = path.join(root, 'node_modules', '.cache', 'storybook')
  for (const v of opts.versions) {
    mkdirSync(path.join(cacheRoot, v, 'default', 'dev-server'), {
      recursive: true,
    })
  }
  if (opts.mtimes) {
    for (const [v, ts] of Object.entries(opts.mtimes)) {
      // Walk and stamp every dir under the version root so the
      // recursive max-mtime sees the same value everywhere — without
      // this, intermediate dirs like `<v>/default` retain their
      // creation mtime (≈ Date.now()) and shadow the value we set.
      const seconds = ts / 1000
      const stampTree = (dir: string): void => {
        utimesSync(dir, seconds, seconds)
        for (const child of (() => {
          try { return fs.readdirSync(dir) } catch { return [] }
        })()) {
          const childPath = path.join(dir, child)
          try {
            if (fs.statSync(childPath).isDirectory()) stampTree(childPath)
            else utimesSync(childPath, seconds, seconds)
          } catch {
            /* noop */
          }
        }
      }
      stampTree(path.join(cacheRoot, v))
    }
  }
  const pkg: any = { name: 'fake', version: '0.0.0' }
  if (opts.storybookDep) pkg.devDependencies = { storybook: opts.storybookDep }
  writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  if (opts.withGit !== false) mkdirSync(path.join(root, '.git'))
  return root
}

describe('pickActiveVersion', () => {
  it('explicit pin wins over mtime', () => {
    expect(
      pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], '9.0.5', {
        '8.6.0': 100,
        '9.0.5': 200,
        '10.1.0': 300,
      }),
    ).toBe('9.0.5')
  })
  it('falls back to most-recently-updated when no pin', () => {
    expect(
      pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], null, {
        '8.6.0': 300,
        '9.0.5': 100,
        '10.1.0': 200,
      }),
    ).toBe('8.6.0')
  })
  it('falls back to lexicographic descending when no mtimes available', () => {
    // No mtime data — deterministic-but-naive lex desc. Note '9' >
    // '1' as a string, so '9.0.5' beats '10.1.0'. Real cache dirs
    // always have an mtime, so this fallback is mostly a safety net.
    expect(pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], null)).toBe('9.0.5')
    expect(pickActiveVersion(['8.6.0', '9.0.5'], null, {})).toBe('9.0.5')
  })
  it('ignores a pin that does not match any available version', () => {
    expect(
      pickActiveVersion(['8.6.0', '9.0.5', '10.1.0'], '7.0.0', {
        '8.6.0': 100,
        '9.0.5': 300,
        '10.1.0': 200,
      }),
    ).toBe('9.0.5')
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

  it('auto-picks the version declared in package.json when its dir exists', () => {
    const root = makeProject({
      versions: ['8.6.0', '9.0.5', '10.1.0'],
      storybookDep: '^9.0.5',
      mtimes: {
        '8.6.0': 3_000_000_000_000,
        '9.0.5': 1_000_000_000_000,
        '10.1.0': 2_000_000_000_000,
      },
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('9.0.5')
    expect(loc.projectStorybookVersion).toBe('9.0.5')
    expect(loc.versionMtimes['8.6.0']).toBe(3_000_000_000_000)
  })

  it('falls back to most-recently-updated when no storybook is installed', () => {
    const root = makeProject({
      versions: ['8.6.0', '9.0.5', '10.1.0'],
      mtimes: {
        '8.6.0': 3_000_000_000_000,
        '9.0.5': 1_000_000_000_000,
        '10.1.0': 2_000_000_000_000,
      },
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('8.6.0')
    expect(loc.projectStorybookVersion).toBeNull()
  })

  it('falls back to most-recently-updated when declared version has no dir', () => {
    const root = makeProject({
      versions: ['8.6.0', '10.1.0'],
      storybookDep: '~9.0.0',
      mtimes: {
        '8.6.0': 3_000_000_000_000,
        '10.1.0': 1_000_000_000_000,
      },
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('8.6.0')
    expect(loc.projectStorybookVersion).toBe('9.0.0')
  })

  it('honours `installedVersion` override and skips the package.json walk', () => {
    const root = makeProject({
      versions: ['8.6.0', '9.0.5', '10.1.0'],
      storybookDep: '^9.0.5',
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({
      projectRoot: root,
      installedVersion: '10.1.0',
    })
    expect(loc.version).toBe('10.1.0')
    expect(loc.projectStorybookVersion).toBe('10.1.0')
  })

  it('exposes versionMtimes for every dir', () => {
    const root = makeProject({
      versions: ['8.6.0', '10.1.0'],
      mtimes: { '8.6.0': 1_700_000_000_000, '10.1.0': 1_800_000_000_000 },
    })
    tmpDirs.push(root)
    const loc = resolveCacheLocation({ projectRoot: root })
    expect(loc.version).toBe('10.1.0')
    expect(loc.versionMtimes).toEqual({
      '8.6.0': 1_700_000_000_000,
      '10.1.0': 1_800_000_000_000,
    })
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
