import { useEffect, useCallback } from 'react';

import { STORAGE_KEYS, pomodoroKey, todoKey } from '@/constants/storageKeys';
import { canStorePlaceName } from '@/helpers/placeName';
import { writeStorageValue } from '@/hooks/useLocalStorage';
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
/**
 * Appends a place to the comma-separated `dailyPlaceNames` list (if it isn't there yet)
 * and notifies the components reading it.
 */
const addPlaceName = (name: string) => {
    // Names with commas (only reachable through a typed URL) would split the list
    if (!canStorePlaceName(name)) return;

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.placeNames);

        if (!stored) {
            writeStorageValue(STORAGE_KEYS.placeNames, name);
        } else if (!stored.split(',').includes(name)) {
            writeStorageValue(STORAGE_KEYS.placeNames, `${stored},${name}`);
        }
    } catch (error) {
        console.error('Error saving place name:', error);
    }
};

export const usePlaceNames = (currentName?: string): UsePlaceNamesReturn => {
    // Register the current place
    useEffect(() => {
        if (currentName) addPlaceName(currentName);
    }, [currentName]);

    const savePlaceName = useCallback((name: string) => addPlaceName(name), []);

    const placeExists = useCallback((name: string): boolean => {
        try {
            const storage = localStorage.getItem(STORAGE_KEYS.placeNames);

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

    const forkPlaceConfiguration = useCallback(
        (
            from: string,
            to: string,
            defaultValue: TaskType[] | PomodoroSetting,
            type: 'todo' | 'pomodoro'
        ) => {
            try {
                const fromPlace = type === 'todo' ? todoKey(from) : pomodoroKey(from);
                const toPlace = type === 'todo' ? todoKey(to) : pomodoroKey(to);

                const value = localStorage.getItem(fromPlace) ?? JSON.stringify(defaultValue);

                if (value) {
                    localStorage.setItem(toPlace, value);
                }
            } catch (error) {
                console.error('Error forking place configuration:', error);
            }
        },
        []
    );

    return {
        savePlaceName,
        placeExists,
        forkPlaceConfiguration
    };
};
