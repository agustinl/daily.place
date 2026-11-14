import { expect, test } from '@playwright/test';

/**
 * Smoke test of the main flows for a brand-new (anonymous) user.
 */
test('create a place, manage tasks, run pomodoro, switch language', async ({ page }) => {
    const place = `e2e-${Date.now()}`;

    // Create place from home
    await page.goto('/');
    await page.getByPlaceholder('Name of your space').fill(place);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL(new RegExp(`/${place}$`));

    // Add tasks back to back, right after the page loads (before auth settles)
    const input = page.getByPlaceholder('Add new task...');
    await input.fill('Primera tarea');
    await input.press('Enter');
    await input.fill('Segunda tarea');
    await input.press('Enter');
    await expect(page.getByText('Primera tarea')).toBeVisible();
    await expect(page.getByText('Segunda tarea')).toBeVisible();

    // Complete one → progress 50%
    await page.getByRole('button', { name: 'Mark task as ready' }).first().click();
    await expect(page.getByText('1/2 completed')).toBeVisible();

    // Reorder: move done tasks down
    await page.getByRole('button', { name: 'Move done tasks down' }).click();
    const stored = await page.evaluate((key) => localStorage.getItem(key), `dailyTodo_${place}`);
    expect(JSON.parse(stored!)).toEqual([
        { text: 'Segunda tarea', ready: false },
        { text: 'Primera tarea', ready: true }
    ]);

    // Delete one
    await page.getByRole('button', { name: 'Delete task' }).first().click();
    await expect(page.getByText('Segunda tarea')).toHaveCount(0);

    // Pomodoro: play updates the tab title with the countdown, pause stops it
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    await expect(page).toHaveTitle(/^\d+:\d{2}$/, { timeout: 5_000 });
    await page.getByRole('button', { name: 'Pause', exact: true }).click();

    // Reload keeps state
    await page.reload();
    await expect(page.getByText('Primera tarea')).toBeVisible();
    const placeNames = await page.evaluate(() => localStorage.getItem('dailyPlaceNames'));
    expect(placeNames?.split(',')).toContain(place);

    // Switch language from the footer
    await page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'ES' }).click();
    await expect(page.getByRole('heading', { name: 'Tareas' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('dailyPlaceLanguage'))).toBe('es');
});
