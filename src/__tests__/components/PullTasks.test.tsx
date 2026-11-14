import { fireEvent, screen, waitFor } from '@testing-library/react';

import PullTasks from '@/components/modals/PullTasks';

import { renderWithProviders } from '../utils/renderWithProviders';

describe('<PullTasks />', () => {
    const setup = (opened = true) => {
        const onClose = jest.fn();
        const onConfirm = jest.fn();
        renderWithProviders(<PullTasks opened={opened} onClose={onClose} onConfirm={onConfirm} />);
        return { onClose, onConfirm };
    };

    it('renders nothing when closed', () => {
        setup(false);
        expect(screen.queryByText('Download tasks from cloud?')).not.toBeInTheDocument();
    });

    it('cancel closes without confirming', () => {
        const { onClose, onConfirm } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onClose).toHaveBeenCalled();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('download confirms and closes once the pull finished', async () => {
        const { onClose, onConfirm } = setup();
        let finishPull = () => {};
        onConfirm.mockReturnValue(new Promise<void>((resolve) => (finishPull = resolve)));

        fireEvent.click(screen.getByRole('button', { name: 'Download' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onClose).not.toHaveBeenCalled();

        finishPull();
        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });
});
