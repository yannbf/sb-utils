import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  entry: ['src/bin.ts', 'src/commands/uninstall.ts'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  // ...config options
})
