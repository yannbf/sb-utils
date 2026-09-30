import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('release from a clean checkout has valid executable metadata', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'sb-utils-release-'))
  try {
    // Preserve the real lifecycle hooks. A minimal build isolates npm's
    // manifest validation order without needing a compiler or registry writes.
    writeFileSync(path.join(directory, 'package.json'), JSON.stringify({
      name: '@hipster/sb-utils',
      version: '0.0.0-release-test',
      bin: manifest.bin,
      files: manifest.files,
      scripts: {
        ...manifest.scripts,
        build: 'node build.cjs',
        release: 'npm publish --dry-run --tag canary --access public',
      },
    }))
    writeFileSync(path.join(directory, 'build.cjs'), `
      const fs = require('node:fs');
      fs.mkdirSync('dist', { recursive: true });
      fs.writeFileSync('dist/bin.mjs', '#!/usr/bin/env node\\n');
    `)

    const { stdout, stderr } = await exec('pnpm', ['run', 'release'], {
      cwd: directory,
      timeout: 30_000,
    })
    assert.doesNotMatch(
      stdout + stderr,
      /No bin file found|npm auto-corrected/,
      'Build before npm publish validates the manifest and use normalized executable metadata',
    )
    assert.match(stdout + stderr, /dist\/bin\.mjs/)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
