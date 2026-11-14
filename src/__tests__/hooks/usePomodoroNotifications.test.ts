import { renderHook } from '@testing-library/react';

import { POMODORO_SETTINGS, getModeMinutes } from '@/constants/PomodoroConstants';

const mockShowNotification = jest.fn();

jest.mock('@mantine/notifications', () => ({
    showNotification: (...args: unknown[]) => mockShowNotification(...args)
}));

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key
}));

// jest.setup.js mocks this hook globally: test the real one here
const { usePomodoroNotifications } = jest.requireActual('@/hooks/usePomodoroNotifications');

describe('usePomodoroNotifications', () => {
    it.each([
        ['pomodoro', 'pomodoro.pomodoro pomodoro.timeIsOver'],
        ['short', 'pomodoro.shortBreak pomodoro.timeIsOver'],
        ['long', 'pomodoro.longBreak pomodoro.timeIsOver']
    ])('shows the end notification of %s', (mode, title) => {
        const { result } = renderHook(() => usePomodoroNotifications());
        result.current.showEndNotification(mode);
        expect(mockShowNotification).toHaveBeenLastCalledWith(expect.objectContaining({ title, message: '' }));
    });
});

describe('getModeMinutes', () => {
    it('reads the duration of each mode from the settings', () => {
        const settings = { ...POMODORO_SETTINGS, pomodoro: 50, shortBreak: 7, longBreak: 20 };
        expect(getModeMinutes('pomodoro', settings)).toBe(50);
        expect(getModeMinutes('short', settings)).toBe(7);
        expect(getModeMinutes('long', settings)).toBe(20);
    });
});
