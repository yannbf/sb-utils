import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/bin.ts', 'src/commands/uninstall.ts', 'src/commands/event-logger.ts'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  // The dashboard is built separately by Vite (see vite.config.ts) and emitted
  // directly to dist/event-log-dashboard.html as a single self-contained
  // file with all CSS + JS inlined. The Hono server reads it at startup.
})
