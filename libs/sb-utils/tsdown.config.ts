import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // ...config options
})
