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
        expect(container.querySelector('[data-rfd-droppable-id]')).toBeNull();
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
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders task text as plain text, not markup', () => {
        const text = '<img src="x" data-test="1"><b>bold</b>';
        const { container } = setup([{ text, ready: false }]);
        expect(container.querySelector('img[data-test]')).toBeNull();
        expect(container.querySelector('b')).toBeNull();
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('still links URLs mixed with markup-like text', () => {
        setup([{ text: '<b>see</b> https://daily.place', ready: false }]);
        expect(screen.getByRole('link', { name: 'https://daily.place' })).toBeInTheDocument();
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

describe('<Tasks /> row identity', () => {
    const noop = {
        onTaskCheck: jest.fn(),
        onTaskDelete: jest.fn(),
        onTaskMove: jest.fn(),
        onTaskEdit: jest.fn()
    };
    const rowOf = (text: string) => screen.getByText(text).closest('[data-rfd-draggable-id]');

    it('keeps each row attached to its task when an earlier task is removed', () => {
        const [first, second, third] = TASKS;
        const { rerender } = renderWithProviders(
            <Tasks tasks={[first, second, third]} {...noop} />
        );
        const secondRow = rowOf('Hecha');

        rerender(<Tasks tasks={[second, third]} {...noop} />);

        expect(rowOf('Hecha')).toBe(secondRow);
    });

    it('keeps each row attached to its task when tasks are reordered', () => {
        const [first, second, third] = TASKS;
        const { rerender } = renderWithProviders(
            <Tasks tasks={[first, second, third]} {...noop} />
        );
        const firstRow = rowOf('Primera');

        rerender(<Tasks tasks={[second, first, third]} {...noop} />);

        expect(rowOf('Primera')).toBe(firstRow);
    });
});
