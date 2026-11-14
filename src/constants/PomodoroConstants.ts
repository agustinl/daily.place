import { PomodoroSetting, PomodoroMode, PomodoroModeValue } from '@/types/pomodoro';

export const POMODORO_SETTINGS: PomodoroSetting = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
    pomodoroToday: 0
};

// Note: Labels are now translated in components using t('pomodoro.pomodoro'), etc.
export const POMODORO_MODES: PomodoroMode[] = [
    { label: 'Pomodoro', value: 'pomodoro' },
    { label: 'Short break', value: 'short' },
    { label: 'Long break', value: 'long' }
];

/** Translation key of each mode's name and the setting that holds its duration. */
export const MODE_CONFIG = {
    pomodoro: { labelKey: 'pomodoro.pomodoro', durationKey: 'pomodoro' },
    short: { labelKey: 'pomodoro.shortBreak', durationKey: 'shortBreak' },
    long: { labelKey: 'pomodoro.longBreak', durationKey: 'longBreak' }
} as const satisfies Record<
    PomodoroModeValue,
    { labelKey: string; durationKey: keyof PomodoroSetting }
>;

/** Duration in minutes of a mode, from the place settings. */
export const getModeMinutes = (mode: PomodoroModeValue, settings: PomodoroSetting) =>
    settings?.[MODE_CONFIG[mode].durationKey];
