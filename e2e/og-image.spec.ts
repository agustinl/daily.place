import { expect, test } from '@playwright/test';

test('OG image endpoint returns a PNG', async ({ request }) => {
    const response = await request.get('/api/og?title=' + encodeURIComponent("e2e's place | daily.place"));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect((await response.body()).byteLength).toBeGreaterThan(1000);
});

test('place page points og:image to an encoded URL', async ({ page }) => {
    await page.goto('/mi%20place');
    const content = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(content).toBe(
        'https://daily.place/api/og?title=' + encodeURIComponent("mi place's place | daily.place")
    );
});
