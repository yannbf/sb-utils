import { copyFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/bin.ts', 'src/commands/uninstall.ts', 'src/commands/event-logger.ts'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: () => {
    // Copy the dashboard HTML asset into dist/ so the built command can find it
    copyFileSync('src/event-log-dashboard.html', 'dist/event-log-dashboard.html')
  },
})
