/**
 * Characterization tests for <Todo /> wired to the real useTasks + useLocalStorage.
 */
import { fireEvent, screen } from '@testing-library/react';

import Todo from '@/components/Todo';

import { PRODUCTION_TODO_TRABAJO, seedProductionStorage } from '../fixtures/productionStorage';
import { createMockRouter, renderWithProviders } from '../utils/renderWithProviders';

const mockRouter = createMockRouter({ pathname: '/[name]', query: { name: 'trabajo' } });

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

let mockSignedIn = false;

jest.mock('@clerk/nextjs', () => ({
    useUser: () => ({ isSignedIn: mockSignedIn, isLoaded: true })
}));

jest.mock('@/hooks/useConvexTasks', () => ({
    useConvexTasks: () => ({
        tasks: [],
        updateTasks: jest.fn(),
        isLoading: false
    })
}));

describe('<Todo />', () => {
    beforeEach(() => {
        seedProductionStorage();
        mockSignedIn = false;
        jest.clearAllMocks();
    });

    it('shows the stored tasks and progress', async () => {
        renderWithProviders(<Todo name="trabajo" />);
        expect(await screen.findByText('Revisar PRs')).toBeInTheDocument();
        expect(screen.getByText('Escribir informe')).toBeInTheDocument();
        expect(screen.getByText('33%')).toBeInTheDocument();
        expect(screen.getByText('1/3 completed')).toBeInTheDocument();
    });

    it('adds a task through the form and persists it', async () => {
        renderWithProviders(<Todo name="trabajo" />);
        await screen.findByText('Revisar PRs');

        const input = screen.getByPlaceholderText('Add new task...');
        fireEvent.change(input, { target: { value: 'Tarea desde UI' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add task' }));

        expect(await screen.findByText('Tarea desde UI')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('dailyTodo_trabajo')!)).toEqual([
            ...PRODUCTION_TODO_TRABAJO,
            { text: 'Tarea desde UI', ready: false }
        ]);
        expect(input).toHaveValue('');
    });

    it('shows bulk actions only with 2+ tasks', async () => {
        renderWithProviders(<Todo name="trabajo" />);
        await screen.findByText('Revisar PRs');
        expect(screen.getByRole('button', { name: 'Delete all tasks' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Move done tasks down' })).toBeInTheDocument();
    });

    it('hides bulk actions for an empty place', () => {
        renderWithProviders(<Todo name="casa" />);
        expect(screen.queryByRole('button', { name: 'Delete all tasks' })).not.toBeInTheDocument();
        expect(screen.getByText('0/0 completed')).toBeInTheDocument();
    });

    it('hides cloud sync buttons when signed out', async () => {
        renderWithProviders(<Todo name="trabajo" />);
        await screen.findByText('Revisar PRs');
        expect(screen.queryByRole('button', { name: 'Push to cloud' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Pull from cloud' })).not.toBeInTheDocument();
        expect(screen.queryByText('Do not add sensitive data')).not.toBeInTheDocument();
    });

    it('shows cloud sync buttons and disclaimer when signed in', async () => {
        mockSignedIn = true;
        renderWithProviders(<Todo name="trabajo" />);
        expect(await screen.findByRole('button', { name: 'Push to cloud' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Pull from cloud' })).toBeInTheDocument();
        expect(screen.getByText('Do not add sensitive data')).toBeInTheDocument();
    });
});
