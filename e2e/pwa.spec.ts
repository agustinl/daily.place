import { expect, test } from '@playwright/test';

test('service worker is served without caching', async ({ request }) => {
    const response = await request.get('/sw.js');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('javascript');
    expect(response.headers()['cache-control']).toContain('no-cache');
});

test('a place opens offline after the first visit', async ({ page, context }) => {
    await page.goto('/offline-check');
    await expect(page.getByRole('timer')).toBeVisible();

    // Wait until the service worker controls the page, then reload once so the
    // page and its assets go through it and get cached
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) {
            await new Promise((resolve) =>
                navigator.serviceWorker.addEventListener('controllerchange', resolve, {
                    once: true
                })
            );
        }
    });
    await page.reload();
    await expect(page.getByRole('timer')).toBeVisible();

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('timer')).toBeVisible();
    await context.setOffline(false);
});

test('old caches are removed when the new worker activates', async ({ page }) => {
    await page.goto('/');
    // Simulate a cache left behind by the previous worker before the new one activates
    await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.unregister();
        await caches.open('workbox-precache-v2-http://localhost/');
        await caches.open('start-url');
    });

    await page.reload();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect
        .poll(() => page.evaluate(() => caches.keys()))
        .toEqual(
            expect.not.arrayContaining(['start-url', 'workbox-precache-v2-http://localhost/'])
        );
});
