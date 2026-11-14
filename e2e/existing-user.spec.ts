import { expect, test } from '@playwright/test';

import {
    PRODUCTION_STORAGE,
    STORAGE_KEYS_CONTRACT
} from '../src/__tests__/fixtures/productionStorage';
import es from '../messages/es.json';

// The stored language is Spanish, so accessible names come from es.json
const MY_PLACES = es.places.myPlaces;
const MARK_READY = es.todo.markReady;

/**
 * A returning production user: localStorage already contains data written by
 * the current production build. The UI must show it as-is, and interacting
 * must keep the same keys/formats.
 */
test.beforeEach(async ({ page }) => {
    // Seed only once per tab (sessionStorage flag) so reloads keep the app's own writes.
    await page.addInitScript((storage) => {
        if (sessionStorage.getItem('__e2eSeeded')) return;
        localStorage.clear();
        Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
        sessionStorage.setItem('__e2eSeeded', '1');
    }, PRODUCTION_STORAGE);
});

const getAppStorage = (page: import('@playwright/test').Page) =>
    page.evaluate(() => {
        const out: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            // Ignore third-party keys (Clerk, analytics, ...)
            if (key.startsWith('daily') || key === 'confettiEnabled')
                out[key] = localStorage.getItem(key)!;
        }
        return out;
    });

const isContractKey = (key: string) =>
    key === STORAGE_KEYS_CONTRACT.placeNames ||
    key === STORAGE_KEYS_CONTRACT.confetti ||
    key === STORAGE_KEYS_CONTRACT.language ||
    key.startsWith(STORAGE_KEYS_CONTRACT.todoPrefix) ||
    key.startsWith(STORAGE_KEYS_CONTRACT.pomodoroPrefix);

test('shows existing tasks, settings, places and language', async ({ page }) => {
    await page.goto('/trabajo');

    // Language from dailyPlaceLanguage=es
    await expect(page.getByRole('heading', { name: 'Tareas' })).toBeVisible();

    // Tasks from dailyTodo_trabajo
    await expect(page.getByText('Revisar PRs')).toBeVisible();
    await expect(page.getByText('Escribir informe')).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://daily.place/changelog' })).toBeVisible();

    // Custom pomodoro (50 min) and completed count (3)
    await expect(page.getByText('50:00')).toBeVisible();
    await expect(page.getByText('3', { exact: true })).toBeVisible();

    // Places menu from dailyPlaceNames
    await page.getByRole('button', { name: MY_PLACES }).hover();
    await expect(page.getByRole('menuitem', { name: 'casa' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'mi place' })).toBeVisible();
});

test('legacy pomodoro settings without pomodoroToday still load', async ({ page }) => {
    await page.goto('/casa');
    await expect(page.getByText('30:00')).toBeVisible();
});

test('interacting keeps the same keys and formats', async ({ page }) => {
    await page.goto('/trabajo');
    await expect(page.getByText('Escribir informe')).toBeVisible();

    await page.getByRole('button', { name: MARK_READY }).first().click();
    await page.reload();
    await expect(page.getByText('Escribir informe')).toBeVisible();

    const storage = await getAppStorage(page);

    // No new app keys outside the contract
    expect(Object.keys(storage).filter((key) => !isContractKey(key))).toEqual([]);

    // Only the touched task changed; everything else is byte-identical
    expect(JSON.parse(storage.dailyTodo_trabajo)).toEqual([
        { text: 'Revisar PRs', ready: true },
        { text: 'Leer https://daily.place/changelog', ready: true },
        { text: 'Escribir informe', ready: false }
    ]);
    for (const key of [
        'dailyPlaceNames',
        'dailyTodo_casa',
        'dailyPomodoro_trabajo',
        'dailyPomodoro_casa',
        'confettiEnabled',
        'dailyPlaceLanguage'
    ]) {
        expect(storage[key], key).toBe(PRODUCTION_STORAGE[key]);
    }
});

test('switching places from the menu loads the other place', async ({ page }) => {
    await page.goto('/trabajo');
    await expect(page.getByText('Revisar PRs')).toBeVisible();
    await expect(page.getByText('50:00')).toBeVisible();

    await page.getByRole('button', { name: MY_PLACES }).hover();
    await page.getByRole('menuitem', { name: 'casa' }).click();

    await expect(page).toHaveURL(/\/casa$/);
    // casa has no tasks and a 30 min pomodoro
    await expect(page.getByText('30:00')).toBeVisible();
    await expect(page.getByText('Revisar PRs')).toHaveCount(0);
});
