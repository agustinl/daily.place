import { useState, useEffect, useCallback } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { cleanNotifications } from '@mantine/notifications';

import { POMODORO_SETTINGS, POMODORO_MODES } from '@/constants/PomodoroConstants';
import { formatTime } from '@/helpers/formatTime';
import useLocalStorage from '@/hooks/useLocalStorage';
import { usePomodoroNotifications } from './usePomodoroNotifications';
import { PomodoroSetting, PomodoroModeValue } from '@/types/pomodoro';

import pomodoroSound from '../../public/sounds/pomodoro-timer.mp3';

interface UsePomodoroReturn {
    mode: PomodoroModeValue;
    setMode: (mode: PomodoroModeValue) => void;
    secondsLeft: number;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    storage: PomodoroSetting;
    restartPomodoro: () => void;
    savePomodoroConfiguration: (newValues: PomodoroSetting) => void;
    restartPomodorosToday: () => void;
}

/**
 * Custom hook to manage Pomodoro timer functionality
 *
 * Handles timer state, modes (pomodoro, short break, long break),
 * notifications, keyboard shortcuts, and persistence to localStorage.
 * Accounts for CPU time vs Wall time to ensure accurate countdown
 * even when the browser tab is in the background.
 *
 * @param name - Place name used as localStorage key prefix
 * @param title - Page title to restore when timer is inactive
 * @returns Object with timer state, controls, and configuration methods
 *
 * @example
 * ```tsx
 * const {
 *   mode,
 *   secondsLeft,
 *   isActive,
 *   setIsActive,
 *   restartPomodoro
 * } = usePomodoro('myplace', 'Daily Place');
 * ```
 */
export const usePomodoro = (name: string, title: string): UsePomodoroReturn => {
    const [storage, setStorage] = useLocalStorage<PomodoroSetting>(
        `dailyPomodoro_${name}`,
        POMODORO_SETTINGS
    );
    const {
        showPomodoroEndNotification,
        showShortBreakEndNotification,
        showLongBreakEndNotification
    } = usePomodoroNotifications();

    const [mode, setMode] = useState<PomodoroModeValue>(POMODORO_MODES[0].value);
    const [secondsLeft, setSecondsLeft] = useState(storage?.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [sound, setSound] = useState<HTMLAudioElement | null>(null);
    const [previousTimestamp, setPreviousTimestamp] = useState<number | null>(null);

    // Initialize sound
    useEffect(() => {
        const audio = new Audio(pomodoroSound);
        setSound(audio);
    }, []);

    // Hotkeys
    useHotkeys([
        ['mod+P', () => setIsActive(!isActive)],
        ['mod+alt+1', () => setMode('pomodoro' as PomodoroModeValue)],
        ['mod+alt+2', () => setMode('short' as PomodoroModeValue)],
        ['mod+alt+3', () => setMode('long' as PomodoroModeValue)]
    ]);

    // Restart timer when mode or configuration changes
    useEffect(() => {
        restartPomodoro();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage, mode]);

    const restartPomodoro = useCallback(() => {
        setIsActive(false);
        setPreviousTimestamp(null);
        document.title = title;

        switch (mode) {
            case 'short':
                setSecondsLeft(storage?.shortBreak * 60);
                break;
            case 'long':
                setSecondsLeft(storage?.longBreak * 60);
                break;
            default:
                setSecondsLeft(storage?.pomodoro * 60);
        }
    }, [mode, storage, title]);

    const savePomodoroConfiguration = useCallback((newValues: PomodoroSetting) => {
        switch (mode) {
            case 'short':
                setSecondsLeft(newValues?.shortBreak * 60);
                break;
            case 'long':
                setSecondsLeft(newValues?.longBreak * 60);
                break;
            default:
                setSecondsLeft(newValues?.pomodoro * 60);
        }
        setStorage({
            ...storage,
            pomodoro: newValues?.pomodoro,
            shortBreak: newValues?.shortBreak,
            longBreak: newValues?.longBreak
        });
        setIsActive(false);
    }, [mode, storage, setStorage]);

    const restartPomodorosToday = useCallback(() => {
        setStorage({
            ...storage,
            pomodoroToday: 0
        });
    }, [storage, setStorage]);

    // Timer principal
    useEffect(() => {
        if (isActive) {
            cleanNotifications();

            const interval = setInterval(() => {
                /*
                    On first run and after resets, `previousTimestamp` will
                    be null and we have to artificially subtract one second
                    to trigger a change in delta.
                */
                const refTimestamp =
                    previousTimestamp === null ? Date.now() - 1000 : previousTimestamp;

                /*
                    CPU time vs Wall time
                    When a browser tab or window is off-screen
                    or in a tab that isn't focused, the scheduler
                    doesn't execute the JS engine every
                    tick/second. Instead, the process is scheduled
                    to run in less frequent intervals. This means
                    that one can't assume that the interval timer
                    will execute once every wall time second, but
                    rather once every "JS engine active" second.
                    Since the countdown should count wall time,
                    we need to calculate a delta for when the
                    function last ran.
                */
                const delta = Math.round((Date.now() - refTimestamp) / 1000);

                /*
                    We then subtract the delta time i.e. the
                    time that has passed since last function
                    execution.
                */
                setSecondsLeft((secondsLeft) => secondsLeft - delta);
                document.title = formatTime(secondsLeft - delta);

                // Update timestamp for last execution
                setPreviousTimestamp(Date.now());
            }, 1000);

            /*
                secondsLeft can be less than 0 if the
                browser tab/window is running in the background
            */
            if (secondsLeft <= 0) {
                sound?.play();
                clearInterval(interval);
                restartPomodoro();

                // Show translated notification based on mode
                if (mode === 'pomodoro') {
                    showPomodoroEndNotification();
                } else if (mode === 'short') {
                    showShortBreakEndNotification();
                } else {
                    showLongBreakEndNotification();
                }
            }

            if (secondsLeft <= 0 && mode === 'pomodoro') {
                setStorage({
                    ...storage,
                    pomodoroToday: storage?.pomodoroToday + 1
                });

                // Track pomodoro completion
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'pomodoro_completed', {
                        event_category: 'pomodoro',
                        event_label: 'Pomodoro session completed'
                    });
                }
            }

            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, secondsLeft]);

    return {
        mode,
        setMode,
        secondsLeft,
        isActive,
        setIsActive,
        storage,
        restartPomodoro,
        savePomodoroConfiguration,
        restartPomodorosToday
    };
};

