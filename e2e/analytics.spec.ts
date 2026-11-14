import { expect, test } from '@playwright/test';

// E2E builds run with an empty tracking ID (playwright.config.ts), so test traffic never
// reaches Google Analytics even when .env.local defines one
const ANALYTICS = /googletagmanager\.com|google-analytics\.com/;

test('e2e runs send nothing to Google Analytics', async ({ page }) => {
    const requests: string[] = [];
    // Record and abort: if this ever fails, the run still sends nothing
    await page.route(ANALYTICS, (route) => {
        requests.push(route.request().url());
        return route.abort();
    });

    await page.goto('/');
    await page.getByPlaceholder('Name of your space').fill('e2e-analytics');
    await page.getByRole('button', { name: 'Create place' }).click();
    await expect(page.getByRole('timer')).toBeVisible();
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    await page.waitForTimeout(1000);

    expect(requests).toEqual([]);
});
