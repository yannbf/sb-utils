import { copyFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/bin.ts', 'src/commands/uninstall.ts', 'src/commands/event-logger.ts'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: () => {
    // Copy the dashboard HTML + CSS assets into dist/ so the built command
    // can find them. (The HTML loads the CSS via <link>; exportHtmlSnapshot
    // inlines the CSS on the fly for self-contained snapshots.)
    copyFileSync('src/event-log-dashboard.html', 'dist/event-log-dashboard.html')
    copyFileSync('src/event-log-dashboard.css', 'dist/event-log-dashboard.css')
  },
})
