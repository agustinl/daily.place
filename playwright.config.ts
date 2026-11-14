import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/**
 * E2E tests run against a production build (`next build && next start`).
 * Locally env vars come from .env.local; in CI from GitHub secrets.
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'retain-on-failure'
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        // `npm run build` would also run `convex codegen` (needs a deploy key).
        command: `npx next build && npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        timeout: 300_000,
        reuseExistingServer: !process.env.CI
    }
});
