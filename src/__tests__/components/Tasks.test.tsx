/**
 * Characterization tests for <Tasks />: lock current behavior before refactors.
 */
import { fireEvent, screen } from '@testing-library/react';

import Tasks from '@/components/Tasks';
import { TaskType } from '@/types/task';

import { renderWithProviders } from '../utils/renderWithProviders';

const TASKS: TaskType[] = [
    { text: 'Primera', ready: false },
    { text: 'Hecha', ready: true },
    { text: 'Ver https://daily.place/changelog', ready: false }
];

const setup = (tasks: TaskType[] = TASKS) => {
    const handlers = {
        onTaskCheck: jest.fn(),
        onTaskDelete: jest.fn(),
        onTaskMove: jest.fn(),
        onTaskEdit: jest.fn()
    };
    const utils = renderWithProviders(<Tasks tasks={tasks} {...handlers} />);
    return { ...utils, ...handlers };
};

describe('<Tasks />', () => {
    it('renders nothing when there are no tasks', () => {
        const { container } = setup([]);
        expect(container.querySelector('[data-rbd-droppable-id]')).toBeNull();
    });

    it('renders every task text in order', () => {
        setup();
        expect(screen.getByText('Primera')).toBeInTheDocument();
        expect(screen.getByText('Hecha')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Delete task' })).toHaveLength(3);
    });

    it('turns URLs into links that open in a new tab', () => {
        setup();
        const link = screen.getByRole('link', { name: 'https://daily.place/changelog' });
        expect(link).toHaveAttribute('href', 'https://daily.place/changelog');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('check button toggles the ready state of that index', () => {
        const { onTaskCheck } = setup();
        fireEvent.click(screen.getAllByRole('button', { name: 'Mark task as ready' })[0]);
        expect(onTaskCheck).toHaveBeenCalledWith(0, true);

        fireEvent.click(screen.getByRole('button', { name: 'Mark task as unready' }));
        expect(onTaskCheck).toHaveBeenCalledWith(1, false);
    });

    it('edit and delete buttons pass the index', () => {
        const { onTaskEdit, onTaskDelete } = setup();
        fireEvent.click(screen.getAllByRole('button', { name: 'Edit task' })[2]);
        expect(onTaskEdit).toHaveBeenCalledWith(2, TASKS[2].text);

        fireEvent.click(screen.getAllByRole('button', { name: 'Delete task' })[1]);
        expect(onTaskDelete).toHaveBeenCalledWith(1);
    });
});
