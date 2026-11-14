import { expect, test } from '@playwright/test';

test('pages are served with security headers', async ({ request }) => {
    for (const path of ['/', '/some-place']) {
        const response = await request.get(path);
        const headers = response.headers();

        expect(headers['x-frame-options']).toBe('DENY');
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
        expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    }
});
