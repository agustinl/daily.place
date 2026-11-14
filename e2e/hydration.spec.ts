import { expect, test } from '@playwright/test';

// Production React reports hydration mismatches as minified errors #418, #419, #422, #423 and #425
const HYDRATION_ERROR = /Hydration|did not match|Minified React error #4(18|19|22|23|25)/i;

const PAGES = ['/', '/e2e-hydration', '/contact', '/changelog'];

test.describe('pages hydrate without mismatches for a returning user', () => {
    test.beforeEach(async ({ page }) => {
        // Settings that only exist in the browser, so the server can't render them
        await page.addInitScript(() => {
            localStorage.setItem('mantine-color-scheme-value', 'dark');
            localStorage.setItem('dailyPlaceLanguage', 'es');
            localStorage.setItem('dailyPlaceNames', 'e2e-hydration');
        });
    });

    for (const path of PAGES) {
        test(path, async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (message) => {
                if (message.type() === 'error' && HYDRATION_ERROR.test(message.text())) {
                    errors.push(message.text());
                }
            });
            page.on('pageerror', (error) => {
                if (HYDRATION_ERROR.test(error.message)) errors.push(error.message);
            });

            await page.goto(path);
            await expect(page.getByRole('contentinfo')).toBeVisible();
            // Hydration runs after load; give React time to report a mismatch
            await page.waitForTimeout(1000);

            expect(errors).toEqual([]);
        });
    }
});
