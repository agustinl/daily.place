/**
 * localStorage keys. These strings are a contract with data already stored in
 * users' browsers: never rename them (guarded by src/__tests__/contract).
 */
export const STORAGE_KEYS = {
    /** Plain comma-separated string of place names (not JSON). */
    placeNames: 'dailyPlaceNames',
    /** JSON boolean. */
    confetti: 'confettiEnabled',
    /** Plain locale string: en / es / pt. */
    language: 'dailyPlaceLanguage'
} as const;

/** JSON `[{ text, ready }]` with the tasks of a place. */
export const todoKey = (placeName: string) => `dailyTodo_${placeName}`;

/** JSON `{ pomodoro, shortBreak, longBreak, pomodoroToday }` with the pomodoro settings of a place. */
export const pomodoroKey = (placeName: string) => `dailyPomodoro_${placeName}`;
