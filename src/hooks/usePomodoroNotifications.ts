import { createElement, useCallback } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconAlarm } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { MODE_CONFIG } from '@/constants/PomodoroConstants';
import { PomodoroModeValue } from '@/types/pomodoro';

/**
 * Custom hook to display translated Pomodoro notifications
 *
 * Shows a localized notification when a Pomodoro timer phase ends
 * (work session, short break or long break), using the current app locale.
 *
 * @returns Object with the method that shows the end notification of a mode
 *
 * @example
 * ```tsx
 * const { showEndNotification } = usePomodoroNotifications();
 *
 * // When a short break ends
 * showEndNotification('short');
 * ```
 */
export const usePomodoroNotifications = () => {
    const t = useTranslations();

    const showEndNotification = useCallback(
        (mode: PomodoroModeValue) => {
            showNotification({
                title: `${t(MODE_CONFIG[mode].labelKey)} ${t('pomodoro.timeIsOver')}`,
                icon: createElement(IconAlarm, { size: 20 }),
                message: ''
            });
        },
        [t]
    );

    return { showEndNotification };
};
