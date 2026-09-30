import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = mkdtempSync(path.join(tmpdir(), 'sb-utils-package-'))
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
let server

try {
  // Exercise the same prepack build that runs during npm publish.
  execFileSync(npm, ['pack', '--pack-destination', temporary], {
    cwd: root,
    stdio: 'inherit',
  })
  const tarball = path.join(temporary, `hipster-sb-utils-${manifest.version}.tgz`)
  writeFileSync(path.join(temporary, 'package.json'), '{"private":true,"type":"module"}\n')
  execFileSync(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', tarball], {
    cwd: temporary,
    stdio: 'inherit',
  })

  const installed = path.join(temporary, 'node_modules/@hipster/sb-utils')
  const cli = path.join(temporary, 'node_modules/.bin/sb-utils')
  const version = execFileSync(cli, ['--version'], { cwd: temporary, encoding: 'utf8' }).trim()
  assert.equal(version, manifest.version, 'The packaged CLI must report the published version')
  const help = execFileSync(cli, ['--help'], { cwd: temporary, encoding: 'utf8' })
  assert.match(help, /uninstall/)
  assert.match(help, /event-logger/)

  // Resolve the public entrypoints using only installed production dependencies.
  execFileSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { uninstall } from '@hipster/sb-utils/uninstall';
    import { eventLogger } from '@hipster/sb-utils/event-logger';
    assert.equal(typeof uninstall, 'function');
    assert.equal(typeof eventLogger, 'function');
  `], { cwd: temporary, stdio: 'inherit' })

  for (const entry of [manifest.main, manifest.types, ...Object.values(manifest.exports).flatMap(
    (value) => typeof value === 'string' ? [value] : Object.values(value),
  )]) {
    assert.ok(readFileSync(path.join(installed, entry)).length, `Missing package entrypoint: ${entry}`)
  }

  const port = await new Promise((resolve, reject) => {
    const probe = net.createServer()
    probe.once('error', reject)
    probe.listen(0, () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })
  server = spawn(cli, ['event-logger', '--port', String(port), '--json', '--no-cache-watch'], {
    cwd: temporary,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.resume()
  let stderr = ''
  const ready = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Packaged server did not start: ${stderr}`)), 15_000)
    const finish = (error, value) => {
      clearTimeout(timeout)
      if (error) reject(error)
      else resolve(value)
    }
    server.once('error', (error) => finish(error))
    server.once('exit', (code) => finish(new Error(`Packaged server exited (${code}): ${stderr}`)))
    server.stderr.on('data', (chunk) => {
      stderr += chunk
      for (const line of stderr.split('\n')) {
        try {
          const message = JSON.parse(line)
          if (message.status === 'ready') finish(null, message)
        } catch {
          // Ignore incomplete lines and non-JSON diagnostic output.
        }
      }
    })
  })
  const response = await fetch(ready.dashboard, { signal: AbortSignal.timeout(5_000) })
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.match(html, /<script\b/)
  assert.match(html, /<style\b/)
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i, 'Dashboard scripts must be inlined')
  console.log(`Verified @hipster/sb-utils@${manifest.version}: executable, exports, types, and dashboard.`)
} finally {
  if (server?.pid && server.exitCode === null && server.signalCode === null) {
    const exited = new Promise((resolve) => server.once('exit', resolve))
    server.kill('SIGTERM')
    await exited
  }
  rmSync(temporary, { recursive: true, force: true })
}
