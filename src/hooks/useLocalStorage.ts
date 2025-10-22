import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

/**
 * Custom hook to manage state synced with localStorage
 *
 * Provides a stateful value that automatically persists to localStorage
 * and synchronizes with router query changes. Works similar to useState
 * but with automatic persistence. Handles JSON serialization automatically.
 * Listens to storage events to sync changes across components and tabs.
 *
 * @template T - Type of the stored value
 * @param key - Key to use in localStorage
 * @param initialValue - Default value if no stored value exists
 * @returns Tuple with current value and setter function, similar to useState
 *
 * @example
 * ```tsx
 * const [tasks, setTasks] = useLocalStorage<Task[]>('myTasks', []);
 *
 * // Use like regular state
 * setTasks([...tasks, newTask]);
 *
 * // Value persists across page reloads
 * // and syncs across components/tabs
 * ```
 */
export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const router = useRouter();

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storage, setStorage] = useState<T>(initialValue);

    useEffect(() => {
        setStorage(localStorageAction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    // Listen to localStorage changes from other components/tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    const parse = typeof initialValue !== 'string';
                    const newValue = parse ? JSON.parse(e.newValue) : e.newValue;
                    setStorage(newValue);
                } catch (error) {
                    console.error('Error parsing storage value:', error);
                }
            }
        };

        // Custom event for same-window updates (StorageEvent only fires on other tabs)
        const handleCustomStorageChange = (e: CustomEvent) => {
            if (e.detail.key === key) {
                setStorage(e.detail.value);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange' as any, handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange' as any, handleCustomStorageChange);
        };
    }, [key, initialValue]);

    const localStorageAction = () => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            let parse = typeof initialValue !== 'string';
            return item ? (parse ? JSON.parse(item) : item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    };

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storage) : value;
            // Save state
            setStorage(valueToStore);
            // Save to local storage
            if (typeof window !== 'undefined') {
                let parse = typeof valueToStore !== 'string';
                window.localStorage.setItem(
                    key,
                    parse ? JSON.stringify(valueToStore) : valueToStore as string
                );

                // Dispatch custom event for same-window synchronization
                const event = new CustomEvent('localStorageChange', {
                    detail: { key, value: valueToStore }
                });
                window.dispatchEvent(event);
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storage, setValue];
}
