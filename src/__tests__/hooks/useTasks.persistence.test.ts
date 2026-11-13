/**
 * useTasks wired to the REAL useLocalStorage: persistence and immutability.
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import { useTasks } from '@/hooks/useTasks';

import { PRODUCTION_TODO_TRABAJO, seedProductionStorage } from '../fixtures/productionStorage';
import { createMockRouter } from '../utils/renderWithProviders';

const mockRouter = createMockRouter({ pathname: '/[name]', query: { name: 'trabajo' } });

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

let mockAuth = { isSignedIn: false, isLoaded: true };

jest.mock('@clerk/nextjs', () => ({
    useUser: () => mockAuth
}));

jest.mock('@/hooks/useConvexTasks', () => ({
    useConvexTasks: () => ({
        tasks: [],
        updateTasks: jest.fn(),
        clearTasks: jest.fn(),
        isLoading: false
    })
}));

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}));

const storedTasks = (name: string) => JSON.parse(localStorage.getItem(`dailyTodo_${name}`) ?? 'null');

describe('useTasks persistence', () => {
    beforeEach(() => {
        seedProductionStorage();
        mockAuth = { isSignedIn: false, isLoaded: true };
        jest.clearAllMocks();
    });

    describe('while auth is still loading', () => {
        beforeEach(() => {
            mockAuth = { isSignedIn: false, isLoaded: false };
        });

        it('shows stored tasks without waiting for auth', async () => {
            const { result } = renderHook(() => useTasks('trabajo'));
            await waitFor(() => expect(result.current.tasks).toEqual(PRODUCTION_TODO_TRABAJO));
        });

        it('keeps every task added in a row', () => {
            const { result } = renderHook(() => useTasks('nuevo'));
            act(() => result.current.addNewTask('one'));
            act(() => result.current.addNewTask('two'));
            act(() => result.current.addNewTask('three'));
            expect(storedTasks('nuevo')).toEqual([
                { text: 'one', ready: false },
                { text: 'two', ready: false },
                { text: 'three', ready: false }
            ]);
        });

        it('applies consecutive operations on top of each other', () => {
            const { result } = renderHook(() => useTasks('trabajo'));
            act(() => result.current.addNewTask('new'));
            act(() => result.current.markTaskAsReady(1, true));
            act(() => result.current.deleteTask(0));
            expect(storedTasks('trabajo')).toEqual([
                { ...PRODUCTION_TODO_TRABAJO[1], ready: true },
                PRODUCTION_TODO_TRABAJO[2],
                { text: 'new', ready: false }
            ]);
        });
    });

    describe('immutability', () => {
        it('markTaskAsReady does not mutate the previous task objects', async () => {
            const { result } = renderHook(() => useTasks('trabajo'));
            await waitFor(() => expect(result.current.tasks).toHaveLength(3));
            const before = result.current.tasks;
            const beforeTask = before[1];

            act(() => result.current.markTaskAsReady(1, true));

            expect(beforeTask.ready).toBe(false);
            expect(result.current.tasks).not.toBe(before);
            expect(result.current.tasks[1]).not.toBe(beforeTask);
            expect(result.current.tasks[1].ready).toBe(true);
            // untouched tasks keep their identity
            expect(result.current.tasks[0]).toBe(before[0]);
        });

        it('editTask does not mutate the previous task objects', async () => {
            const { result } = renderHook(() => useTasks('trabajo'));
            await waitFor(() => expect(result.current.tasks).toHaveLength(3));
            const beforeTask = result.current.tasks[2];

            act(() => result.current.handleEditTaskClick(2));
            act(() => result.current.editTask('Edited'));

            expect(beforeTask.text).toBe(PRODUCTION_TODO_TRABAJO[2].text);
            expect(result.current.tasks[2].text).toBe('Edited');
        });
    });
});
