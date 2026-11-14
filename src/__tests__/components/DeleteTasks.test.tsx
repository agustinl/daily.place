import { fireEvent, screen, waitFor } from '@testing-library/react';

import DeleteTasks from '@/components/modals/DeleteTasks';

import { renderWithProviders } from '../utils/renderWithProviders';

describe('<DeleteTasks />', () => {
    const open = () => {
        const onDeleteTasks = jest.fn();
        renderWithProviders(<DeleteTasks onDeleteTasks={onDeleteTasks} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete all tasks' }));
        return onDeleteTasks;
    };

    it('asks for confirmation and deletes on confirm', async () => {
        const onDeleteTasks = open();
        expect(
            await screen.findByText('Are you sure you want to delete all tasks?')
        ).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => expect(onDeleteTasks).toHaveBeenCalledTimes(1));
    });

    it('does nothing on cancel', async () => {
        const onDeleteTasks = open();
        fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
        expect(onDeleteTasks).not.toHaveBeenCalled();
    });
});
