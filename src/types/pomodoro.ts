export type PomodoroSetting = {
	pomodoro: number;
	shortBreak: number;
	longBreak: number;
	pomodoroToday: number;
};

export type PomodoroModeValue = 'pomodoro' | 'short' | 'long';

export type PomodoroMode = {
	label: string;
	value: PomodoroModeValue;
};
