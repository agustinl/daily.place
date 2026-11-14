import { fireEvent, screen } from '@testing-library/react';

import PomodoroTimer from '@/components/common/PomodoroTimer';
import { renderWithProviders } from '../utils/renderWithProviders';

const baseProps = {
    secondsLeft: 1500,
    isActive: false,
    progress: 0,
    status: 'Ready to start',
    toggleLabel: 'Start',
    onToggleActive: jest.fn(),
    onRestart: jest.fn()
};

describe('<PomodoroTimer />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the time left, the status and the start button', () => {
        renderWithProviders(<PomodoroTimer {...baseProps} />);

        expect(screen.getByRole('timer')).toHaveTextContent('25:00');
        expect(screen.getByText('Ready to start')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Play pomodoro' })).toHaveTextContent('Start');
    });

    it('offers to pause while the timer is running', () => {
        renderWithProviders(
            <PomodoroTimer
                {...baseProps}
                isActive
                secondsLeft={932}
                status="Focused"
                toggleLabel="Pause"
            />
        );

        expect(screen.getByRole('timer')).toHaveTextContent('15:32');
        fireEvent.click(screen.getByRole('button', { name: 'Pause pomodoro' }));

        expect(baseProps.onToggleActive).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('button', { name: 'Play pomodoro' })).not.toBeInTheDocument();
    });

    it('restarts from the restart button', () => {
        renderWithProviders(<PomodoroTimer {...baseProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'Restart pomodoro' }));

        expect(baseProps.onRestart).toHaveBeenCalledTimes(1);
    });
});
