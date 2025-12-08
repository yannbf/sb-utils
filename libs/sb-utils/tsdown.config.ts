import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/bin.ts',
    'src/commands/uninstall.ts',
    'src/commands/component-analyzer.ts',
  ],
  banner: {
    js: '#!/usr/bin/env node',
  },
  // ...config options
})
