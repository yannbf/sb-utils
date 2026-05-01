import { defineConfig, devices } from '@playwright/test'

/**
 * E2E tests for the event-logger dashboard. Each test spawns a fresh
 * event-logger CLI on its own port via the `eventLogger` fixture in
 * `e2e/fixtures.ts` — no shared global server, no cross-test interference.
 *
 * Tests run against the production-built dashboard at
 * `dist/event-log-dashboard.html`. Run `pnpm build` first.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  use: {
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
