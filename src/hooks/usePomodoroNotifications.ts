import { useTranslations } from 'next-intl';
import { showNotification } from '@mantine/notifications';
import { createElement } from 'react';
import { IconAlarm } from '@tabler/icons-react';

/**
 * Custom hook to display translated Pomodoro notifications
 *
 * Provides methods to show localized notifications when different
 * Pomodoro timer phases end (work session, short break, long break).
 * All notifications use the current app locale via next-intl.
 *
 * @returns Object with notification display methods for each Pomodoro mode
 *
 * @example
 * ```tsx
 * const {
 *   showPomodoroEndNotification,
 *   showShortBreakEndNotification
 * } = usePomodoroNotifications();
 *
 * // When pomodoro ends
 * showPomodoroEndNotification();
 * ```
 */
export const usePomodoroNotifications = () => {
    const t = useTranslations();

    const showPomodoroEndNotification = () => {
        showNotification({
            title: `${t('pomodoro.pomodoro')} ${t('pomodoro.timeIsOver')}`,
            icon: createElement(IconAlarm, { size: 20 }),
            message: ''
        });
    };

    const showShortBreakEndNotification = () => {
        showNotification({
            title: `${t('pomodoro.shortBreak')} ${t('pomodoro.timeIsOver')}`,
            icon: createElement(IconAlarm, { size: 20 }),
            message: ''
        });
    };

    const showLongBreakEndNotification = () => {
        showNotification({
            title: `${t('pomodoro.longBreak')} ${t('pomodoro.timeIsOver')}`,
            icon: createElement(IconAlarm, { size: 20 }),
            message: ''
        });
    };

    return {
        showPomodoroEndNotification,
        showShortBreakEndNotification,
        showLongBreakEndNotification
    };
};

