/**
 * localStorage CONTRACT tests.
 *
 * Production users already have data saved under these exact keys and formats.
 * Any refactor / upgrade that changes a key name or the serialized shape of a
 * value must fail here. Unlike the unit tests in `hooks/`, these use the REAL
 * `useLocalStorage` hook and the (jsdom) localStorage.
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import { POMODORO_SETTINGS } from '@/constants/PomodoroConstants';
import { STORAGE_KEYS, pomodoroKey, todoKey } from '@/constants/storageKeys';
import useLocalStorage from '@/hooks/useLocalStorage';
import { usePlaceNames } from '@/hooks/usePlaceNames';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTasks } from '@/hooks/useTasks';
import { getStoredLocale, setStoredLocale } from '@/i18n';

import {
    PRODUCTION_POMODORO_CASA_LEGACY,
    PRODUCTION_POMODORO_TRABAJO,
    PRODUCTION_STORAGE,
    PRODUCTION_TODO_TRABAJO,
    getStorageKeys,
    isContractKey,
    seedProductionStorage
} from '../fixtures/productionStorage';
import { createMockRouter } from '../utils/renderWithProviders';

const mockRouter = createMockRouter({ pathname: '/[name]', query: { name: 'trabajo' } });

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

jest.mock('@clerk/nextjs', () => ({
    useUser: () => ({ isSignedIn: false, isLoaded: true })
}));

jest.mock('@/hooks/useConvexTasks', () => ({
    useConvexTasks: () => ({
        tasks: [],
        updateTasks: jest.fn(),
        isLoading: false
    })
}));

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}));

const raw = (key: string) => localStorage.getItem(key);

const renderTasks = async (name = 'trabajo') => {
    const hook = renderHook(() => useTasks(name));
    await waitFor(() => expect(hook.result.current.tasks.length).toBeGreaterThan(0));
    return hook;
};

describe('localStorage contract (production compatibility)', () => {
    beforeEach(() => {
        seedProductionStorage();
        jest.clearAllMocks();
    });

    afterEach(() => {
        // The app must never write keys outside the frozen contract.
        const unexpected = getStorageKeys().filter((key) => !isContractKey(key));
        expect(unexpected).toEqual([]);
    });

    it('the key constants are exactly the production keys', () => {
        // Literal strings on purpose: this must not follow a rename of the constants
        expect(STORAGE_KEYS).toEqual({
            placeNames: 'dailyPlaceNames',
            confetti: 'confettiEnabled',
            language: 'dailyPlaceLanguage'
        });
        expect(todoKey('mi place')).toBe('dailyTodo_mi place');
        expect(pomodoroKey('mi place')).toBe('dailyPomodoro_mi place');
    });

    describe('dailyTodo_<name> — JSON [{ text, ready }]', () => {
        it('reads existing production tasks', async () => {
            const { result } = await renderTasks();
            expect(result.current.tasks).toEqual(PRODUCTION_TODO_TRABAJO);
            expect(result.current.progress).toEqual({ progress: 1, percentage: 33, total: 3 });
        });

        it('addNewTask appends with the same shape', async () => {
            const { result } = await renderTasks();
            act(() => result.current.addNewTask('  Nueva tarea  '));
            expect(raw('dailyTodo_trabajo')).toBe(
                JSON.stringify([...PRODUCTION_TODO_TRABAJO, { text: 'Nueva tarea', ready: false }])
            );
        });

        it('markTaskAsReady only flips `ready`', async () => {
            const { result } = await renderTasks();
            act(() => result.current.markTaskAsReady(1, true));
            const expected = PRODUCTION_TODO_TRABAJO.map((t, i) => (i === 1 ? { ...t, ready: true } : t));
            expect(raw('dailyTodo_trabajo')).toBe(JSON.stringify(expected));
        });

        it('editTask only changes `text`', async () => {
            const { result } = await renderTasks();
            act(() => result.current.handleEditTaskClick(2));
            act(() => result.current.editTask('Editado'));
            const expected = PRODUCTION_TODO_TRABAJO.map((t, i) => (i === 2 ? { ...t, text: 'Editado' } : t));
            expect(raw('dailyTodo_trabajo')).toBe(JSON.stringify(expected));
        });

        it('deleteTask removes by index', async () => {
            const { result } = await renderTasks();
            act(() => result.current.deleteTask(0));
            expect(raw('dailyTodo_trabajo')).toBe(JSON.stringify(PRODUCTION_TODO_TRABAJO.slice(1)));
        });

        it('moveTaskOrder reorders', async () => {
            const { result } = await renderTasks();
            act(() => result.current.moveTaskOrder(0, 2));
            const [a, b, c] = PRODUCTION_TODO_TRABAJO;
            expect(raw('dailyTodo_trabajo')).toBe(JSON.stringify([b, c, a]));
        });

        it('moveDoneTasksDown puts done tasks last', async () => {
            const { result } = await renderTasks();
            act(() => result.current.moveDoneTasksDown());
            const [a, b, c] = PRODUCTION_TODO_TRABAJO;
            expect(raw('dailyTodo_trabajo')).toBe(JSON.stringify([b, c, a]));
        });

        it('deleteAllTasks stores an empty JSON array', async () => {
            const { result } = await renderTasks();
            act(() => result.current.deleteAllTasks());
            expect(raw('dailyTodo_trabajo')).toBe('[]');
        });

        it('does not touch other places', async () => {
            const { result } = await renderTasks();
            act(() => result.current.deleteAllTasks());
            expect(raw('dailyTodo_casa')).toBe(PRODUCTION_STORAGE.dailyTodo_casa);
            expect(raw('dailyPlaceNames')).toBe(PRODUCTION_STORAGE.dailyPlaceNames);
        });
    });

    describe('dailyPomodoro_<name> — JSON { pomodoro, shortBreak, longBreak, pomodoroToday }', () => {
        it('reads custom production settings', async () => {
            const { result } = renderHook(() => usePomodoro('trabajo', 'title'));
            await waitFor(() => expect(result.current.storage).toEqual(PRODUCTION_POMODORO_TRABAJO));
            await waitFor(() => expect(result.current.secondsLeft).toBe(50 * 60));
        });

        it('reads legacy settings without pomodoroToday', async () => {
            const { result } = renderHook(() => usePomodoro('casa', 'title'));
            await waitFor(() => expect(result.current.storage).toEqual(PRODUCTION_POMODORO_CASA_LEGACY));
            await waitFor(() => expect(result.current.secondsLeft).toBe(30 * 60));
        });

        it('uses defaults (and writes nothing) for a new place', () => {
            const { result } = renderHook(() => usePomodoro('nuevo', 'title'));
            expect(result.current.storage).toEqual(POMODORO_SETTINGS);
            expect(raw('dailyPomodoro_nuevo')).toBeNull();
        });

        it('savePomodoroConfiguration keeps pomodoroToday and key order', async () => {
            const { result } = renderHook(() => usePomodoro('trabajo', 'title'));
            await waitFor(() => expect(result.current.storage).toEqual(PRODUCTION_POMODORO_TRABAJO));
            act(() =>
                result.current.savePomodoroConfiguration({
                    pomodoro: 25,
                    shortBreak: 5,
                    longBreak: 10,
                    pomodoroToday: 99
                })
            );
            expect(raw('dailyPomodoro_trabajo')).toBe(
                '{"pomodoro":25,"shortBreak":5,"longBreak":10,"pomodoroToday":3}'
            );
        });

        it('restartPomodorosToday adds pomodoroToday:0 to legacy settings', async () => {
            const { result } = renderHook(() => usePomodoro('casa', 'title'));
            await waitFor(() => expect(result.current.storage).toEqual(PRODUCTION_POMODORO_CASA_LEGACY));
            act(() => result.current.restartPomodorosToday());
            expect(raw('dailyPomodoro_casa')).toBe(
                '{"pomodoro":30,"shortBreak":5,"longBreak":15,"pomodoroToday":0}'
            );
        });
    });

    describe('dailyPlaceNames — comma separated string (NOT JSON)', () => {
        it('recognizes existing places, including names with spaces', () => {
            const { result } = renderHook(() => usePlaceNames());
            expect(result.current.placeExists('trabajo')).toBe(true);
            expect(result.current.placeExists('mi place')).toBe(true);
            expect(result.current.placeExists('otro')).toBe(false);
        });

        it('savePlaceName appends with a comma', () => {
            const { result } = renderHook(() => usePlaceNames());
            act(() => result.current.savePlaceName('nuevo'));
            expect(raw('dailyPlaceNames')).toBe('trabajo,casa,mi place,nuevo');
        });

        it('savePlaceName does not duplicate', () => {
            const { result } = renderHook(() => usePlaceNames());
            act(() => result.current.savePlaceName('casa'));
            expect(raw('dailyPlaceNames')).toBe(PRODUCTION_STORAGE.dailyPlaceNames);
        });

        it('visiting a place registers it', () => {
            renderHook(() => usePlaceNames('visitado'));
            expect(raw('dailyPlaceNames')).toBe('trabajo,casa,mi place,visitado');
        });

        it('a name with a comma is never added (it would split the list)', () => {
            renderHook(() => usePlaceNames('a,b'));
            const { result } = renderHook(() => usePlaceNames());
            act(() => result.current.savePlaceName('c,d'));
            expect(raw('dailyPlaceNames')).toBe('trabajo,casa,mi place');
        });

        it('first place ever is stored without comma', () => {
            localStorage.clear();
            renderHook(() => usePlaceNames('primero'));
            expect(raw('dailyPlaceNames')).toBe('primero');
        });

        it('useLocalStorage<string> reads it raw', async () => {
            const { result } = renderHook(() => useLocalStorage<string>('dailyPlaceNames', ''));
            await waitFor(() => expect(result.current[0]).toBe('trabajo,casa,mi place'));
        });
    });

    describe('fork copies values verbatim', () => {
        it('copies todo and pomodoro raw strings to the new keys', () => {
            const { result } = renderHook(() => usePlaceNames());
            act(() => {
                result.current.forkPlaceConfiguration('trabajo', 'copia', [], 'todo');
                result.current.forkPlaceConfiguration('trabajo', 'copia', POMODORO_SETTINGS, 'pomodoro');
            });
            expect(raw('dailyTodo_copia')).toBe(PRODUCTION_STORAGE.dailyTodo_trabajo);
            expect(raw('dailyPomodoro_copia')).toBe(PRODUCTION_STORAGE.dailyPomodoro_trabajo);
        });

        it('falls back to serialized defaults when the source has no data', () => {
            const { result } = renderHook(() => usePlaceNames());
            act(() => {
                result.current.forkPlaceConfiguration('vacio', 'copia', [], 'todo');
                result.current.forkPlaceConfiguration('vacio', 'copia', POMODORO_SETTINGS, 'pomodoro');
            });
            expect(raw('dailyTodo_copia')).toBe('[]');
            expect(raw('dailyPomodoro_copia')).toBe(JSON.stringify(POMODORO_SETTINGS));
        });
    });

    describe('confettiEnabled — JSON boolean', () => {
        it('reads false and writes "true"/"false"', async () => {
            const { result } = renderHook(() => useLocalStorage<boolean>('confettiEnabled', true));
            await waitFor(() => expect(result.current[0]).toBe(false));
            act(() => result.current[1](true));
            expect(raw('confettiEnabled')).toBe('true');
            act(() => result.current[1](false));
            expect(raw('confettiEnabled')).toBe('false');
        });
    });

    describe('dailyPlaceLanguage — plain locale string', () => {
        it('reads the stored locale', () => {
            expect(getStoredLocale()).toBe('es');
        });

        it('writes the locale as a plain string', () => {
            setStoredLocale('pt');
            expect(raw('dailyPlaceLanguage')).toBe('pt');
        });

        it('ignores unknown stored values', () => {
            localStorage.setItem('dailyPlaceLanguage', 'fr');
            expect(getStoredLocale()).toBe('en');
        });
    });
});
