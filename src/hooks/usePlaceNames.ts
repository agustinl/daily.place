import { useEffect, useCallback } from 'react';
import { PomodoroSetting } from '@/types/pomodoro';
import { TaskType } from '@/types/task';

interface UsePlaceNamesReturn {
    savePlaceName: (name: string) => void;
    placeExists: (name: string) => boolean;
    forkPlaceConfiguration: (
        from: string,
        to: string,
        defaultValue: TaskType[] | PomodoroSetting,
        type: 'todo' | 'pomodoro'
    ) => void;
}

/**
 * Custom hook to manage place names and configurations
 *
 * Automatically saves the current place name to localStorage when provided.
 * Provides utilities to check place existence and fork/duplicate place
 * configurations including tasks and pomodoro settings.
 *
 * @param currentName - Optional place name to automatically save on mount
 * @returns Object with place management utilities
 *
 * @example
 * ```tsx
 * const { placeExists, forkPlaceConfiguration } = usePlaceNames('myplace');
 *
 * if (placeExists('newplace')) {
 *   // Handle existing place
 * }
 *
 * forkPlaceConfiguration('oldplace', 'newplace', [], 'todo');
 * ```
 */
export const usePlaceNames = (currentName?: string): UsePlaceNamesReturn => {
    // Save current place name to localStorage
    useEffect(() => {
        if (!currentName) return;

        const storage = localStorage.getItem('dailyPlaceNames');

        if (storage) {
            const found = storage?.split(',').find((element) => element === currentName);

            if (!found) {
                localStorage.setItem('dailyPlaceNames', storage?.concat(',', currentName?.toString()));
            }
        } else {
            localStorage.setItem('dailyPlaceNames', currentName?.toString());
        }
    }, [currentName]);

    const savePlaceName = useCallback((name: string) => {
        if (!name) return;

        try {
            const storage = localStorage.getItem('dailyPlaceNames');

            if (storage) {
                const found = storage?.split(',').find((element) => element === name);

                if (!found) {
                    localStorage.setItem('dailyPlaceNames', storage?.concat(',', name?.toString()));
                }
            } else {
                localStorage.setItem('dailyPlaceNames', name?.toString());
            }
        } catch (error) {
            console.error('Error saving place name:', error);
        }
    }, []);

    const placeExists = useCallback((name: string): boolean => {
        try {
            const storage = localStorage.getItem('dailyPlaceNames');

            if (storage) {
                const found = storage?.split(',')?.find((element) => element === name);
                return !!found;
            }

            return false;
        } catch (error) {
            console.error('Error checking if place exists:', error);
            return false;
        }
    }, []);

    const forkPlaceConfiguration = useCallback((
        from: string,
        to: string,
        defaultValue: TaskType[] | PomodoroSetting,
        type: 'todo' | 'pomodoro'
    ) => {
        try {
            const fromPlace = type === 'todo' ? `dailyTodo_${from}` : `dailyPomodoro_${from}`;
            const toPlace = type === 'todo' ? `dailyTodo_${to}` : `dailyPomodoro_${to}`;

            const value = localStorage.getItem(fromPlace) ?? JSON.stringify(defaultValue);

            if (value) {
                localStorage.setItem(toPlace, value);
            }
        } catch (error) {
            console.error('Error forking place configuration:', error);
        }
    }, []);

    return {
        savePlaceName,
        placeExists,
        forkPlaceConfiguration
    };
};

