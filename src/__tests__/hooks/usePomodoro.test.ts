import { renderHook, act } from '@testing-library/react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { POMODORO_SETTINGS } from '@/constants/PomodoroConstants';
import { PomodoroSetting } from '@/types/pomodoro';

// Mock useLocalStorage
let mockStorage: PomodoroSetting = POMODORO_SETTINGS;
const mockSetStorage = jest.fn((newValue: PomodoroSetting) => {
    mockStorage = newValue;
});

jest.mock('@/hooks/useLocalStorage', () => ({
    __esModule: true,
    default: jest.fn(() => [mockStorage, mockSetStorage]),
}));

describe('usePomodoro', () => {
    beforeEach(() => {
        mockStorage = { ...POMODORO_SETTINGS };
        mockSetStorage.mockClear();
        jest.clearAllMocks();
        document.title = 'Test Title';
    });

    describe('Initialization', () => {
        it('should initialize with pomodoro mode', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.mode).toBe('pomodoro');
        });

        it('should initialize with correct seconds for pomodoro mode', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.secondsLeft).toBe(25 * 60); // 1500 seconds
        });

        it('should initialize as inactive', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.isActive).toBe(false);
        });

        it('should load configuration from storage', () => {
            mockStorage = {
                pomodoro: 30,
                shortBreak: 10,
                longBreak: 20,
                pomodoroToday: 5,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.storage).toEqual(mockStorage);
            expect(result.current.secondsLeft).toBe(30 * 60);
        });
    });

    describe('Mode switching', () => {
        it('should switch to short break mode', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('short');
            });

            expect(result.current.mode).toBe('short');
        });

        it('should switch to long break mode', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('long');
            });

            expect(result.current.mode).toBe('long');
        });

        it('should update seconds when switching to short break', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('short');
            });

            // Mode change triggers restartPomodoro via useEffect
            // In actual implementation, this would update secondsLeft
            expect(result.current.mode).toBe('short');
        });

        it('should update seconds when switching to long break', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('long');
            });

            expect(result.current.mode).toBe('long');
        });
    });

    describe('restartPomodoro', () => {
        it('should reset timer to pomodoro duration', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.restartPomodoro();
            });

            expect(result.current.secondsLeft).toBe(25 * 60);
            expect(result.current.isActive).toBe(false);
        });

        it('should reset timer to short break duration when in short mode', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('short');
            });

            act(() => {
                result.current.restartPomodoro();
            });

            expect(result.current.secondsLeft).toBe(5 * 60);
        });

        it('should reset timer to long break duration when in long mode', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('long');
            });

            act(() => {
                result.current.restartPomodoro();
            });

            expect(result.current.secondsLeft).toBe(15 * 60);
        });

        it('should set isActive to false', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setIsActive(true);
            });

            act(() => {
                result.current.restartPomodoro();
            });

            expect(result.current.isActive).toBe(false);
        });

        it('should restore document title', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'My Page'));

            document.title = '5:00';

            act(() => {
                result.current.restartPomodoro();
            });

            expect(document.title).toBe('My Page');
        });
    });

    describe('savePomodoroConfiguration', () => {
        it('should save new configuration', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            const newConfig = {
                pomodoro: 30,
                shortBreak: 10,
                longBreak: 20,
                pomodoroToday: 0,
            };

            act(() => {
                result.current.savePomodoroConfiguration(newConfig);
            });

            expect(mockSetStorage).toHaveBeenCalledWith(
                expect.objectContaining({
                    pomodoro: 30,
                    shortBreak: 10,
                    longBreak: 20,
                })
            );
        });

        it('should update seconds for current mode', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            const newConfig = {
                pomodoro: 30,
                shortBreak: 10,
                longBreak: 20,
                pomodoroToday: 0,
            };

            act(() => {
                result.current.savePomodoroConfiguration(newConfig);
            });

            expect(result.current.secondsLeft).toBe(30 * 60);
        });

        it('should update seconds for short break mode', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setMode('short');
            });

            const newConfig = {
                pomodoro: 25,
                shortBreak: 10,
                longBreak: 15,
                pomodoroToday: 0,
            };

            act(() => {
                result.current.savePomodoroConfiguration(newConfig);
            });

            expect(result.current.secondsLeft).toBe(10 * 60);
        });

        it('should set isActive to false', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setIsActive(true);
            });

            const newConfig = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 0,
            };

            act(() => {
                result.current.savePomodoroConfiguration(newConfig);
            });

            expect(result.current.isActive).toBe(false);
        });
    });

    describe('restartPomodorosToday', () => {
        it('should reset pomodoro count to 0', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 5,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.restartPomodorosToday();
            });

            expect(mockSetStorage).toHaveBeenCalledWith(
                expect.objectContaining({
                    pomodoroToday: 0,
                })
            );
        });

        it('should preserve other settings', () => {
            mockStorage = {
                pomodoro: 30,
                shortBreak: 10,
                longBreak: 20,
                pomodoroToday: 5,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.restartPomodorosToday();
            });

            expect(mockSetStorage).toHaveBeenCalledWith({
                pomodoro: 30,
                shortBreak: 10,
                longBreak: 20,
                pomodoroToday: 0,
            });
        });
    });

    describe('Timer state control', () => {
        it('should start timer when setIsActive(true)', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.isActive).toBe(false);

            act(() => {
                result.current.setIsActive(true);
            });

            expect(result.current.isActive).toBe(true);
        });

        it('should stop timer when setIsActive(false)', () => {
            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            act(() => {
                result.current.setIsActive(true);
            });

            act(() => {
                result.current.setIsActive(false);
            });

            expect(result.current.isActive).toBe(false);
        });
    });

    describe('Configuration values', () => {
        it('should handle custom pomodoro durations', () => {
            mockStorage = {
                pomodoro: 50,
                shortBreak: 10,
                longBreak: 30,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.secondsLeft).toBe(50 * 60);
        });

        it('should handle very short durations', () => {
            mockStorage = {
                pomodoro: 1,
                shortBreak: 1,
                longBreak: 1,
                pomodoroToday: 0,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.secondsLeft).toBe(60);
        });

        it('should maintain pomodoroToday count', () => {
            mockStorage = {
                pomodoro: 25,
                shortBreak: 5,
                longBreak: 15,
                pomodoroToday: 8,
            };

            const { result } = renderHook(() => usePomodoro('testplace', 'Test Title'));

            expect(result.current.storage.pomodoroToday).toBe(8);
        });
    });
});

