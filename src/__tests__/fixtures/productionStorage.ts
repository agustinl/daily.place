/**
 * Snapshot of localStorage as it exists for real users in production.
 *
 * These keys AND their serialization formats are a frozen contract:
 * changing them would lose data for existing users (and break rollbacks).
 */

/** Exact keys (or key prefixes) the app is allowed to write. */
export const STORAGE_KEYS_CONTRACT = {
    placeNames: 'dailyPlaceNames',
    todoPrefix: 'dailyTodo_',
    pomodoroPrefix: 'dailyPomodoro_',
    confetti: 'confettiEnabled',
    language: 'dailyPlaceLanguage'
} as const;

export const PRODUCTION_PLACES = ['trabajo', 'casa', 'mi place'];

export const PRODUCTION_TODO_TRABAJO = [
    { text: 'Revisar PRs', ready: true },
    { text: 'Leer https://daily.place/changelog', ready: false },
    { text: 'Escribir informe', ready: false }
];

export const PRODUCTION_POMODORO_TRABAJO = {
    pomodoro: 50,
    shortBreak: 10,
    longBreak: 20,
    pomodoroToday: 3
};

/** Older saved settings created before `pomodoroToday` existed. */
export const PRODUCTION_POMODORO_CASA_LEGACY = {
    pomodoro: 30,
    shortBreak: 5,
    longBreak: 15
};

/** Raw values exactly as stored by the current production build. */
export const PRODUCTION_STORAGE: Record<string, string> = {
    dailyPlaceNames: PRODUCTION_PLACES.join(','),
    dailyTodo_trabajo: JSON.stringify(PRODUCTION_TODO_TRABAJO),
    dailyTodo_casa: JSON.stringify([]),
    dailyPomodoro_trabajo: JSON.stringify(PRODUCTION_POMODORO_TRABAJO),
    dailyPomodoro_casa: JSON.stringify(PRODUCTION_POMODORO_CASA_LEGACY),
    confettiEnabled: 'false',
    dailyPlaceLanguage: 'es'
};

export const seedProductionStorage = () => {
    localStorage.clear();
    Object.entries(PRODUCTION_STORAGE).forEach(([key, value]) => localStorage.setItem(key, value));
};

/** All keys currently present in localStorage. */
export const getStorageKeys = (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) keys.push(key);
    }
    return keys;
};

/** True if the key matches one of the contract keys/prefixes. */
export const isContractKey = (key: string): boolean =>
    key === STORAGE_KEYS_CONTRACT.placeNames ||
    key === STORAGE_KEYS_CONTRACT.confetti ||
    key === STORAGE_KEYS_CONTRACT.language ||
    key.startsWith(STORAGE_KEYS_CONTRACT.todoPrefix) ||
    key.startsWith(STORAGE_KEYS_CONTRACT.pomodoroPrefix);
