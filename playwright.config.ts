import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: process.platform === 'win32'
      ? '.\\node_modules\\.bin\\vite.cmd --host 127.0.0.1'
      : 'pnpm dev --host 127.0.0.1',
    url: 'http://127.0.0.1:3000/login',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_API_URL: process.env.VITE_API_URL ?? '',
      API_PROXY_TARGET: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8085'
    }
  }
});
