import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

const dashboardRoot = path.resolve(__dirname, 'src/dashboard')

export default defineConfig({
  root: dashboardRoot,
  plugins: [preact(), viteSingleFile()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to a long-running event-logger server during dev.
      '/event-log': 'http://localhost:9009',
      '/sse': { target: 'http://localhost:9009', ws: false },
      '/cache': 'http://localhost:9009',
      '/config': 'http://localhost:9009',
      '/clear': 'http://localhost:9009',
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: false,
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: path.resolve(dashboardRoot, 'event-log-dashboard.html'),
    },
  },
})
