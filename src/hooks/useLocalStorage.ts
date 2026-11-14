import { useState, useEffect, useRef } from 'react';

const SAME_WINDOW_EVENT = 'localStorageChange';

type StorageChangeDetail = { key: string; value: unknown };

/**
 * Writes a value to localStorage and notifies every `useLocalStorage` reading that key
 * in this window (the native `storage` event only reaches other tabs).
 * Strings are stored as-is, anything else as JSON.
 */
export const writeStorageValue = (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    window.dispatchEvent(
        new CustomEvent<StorageChangeDetail>(SAME_WINDOW_EVENT, { detail: { key, value } })
    );
};

/**
 * Custom hook to manage state synced with localStorage
 *
 * Provides a stateful value that automatically persists to localStorage.
 * Works similar to useState but with automatic persistence, and handles JSON
 * serialization (string defaults are stored as plain strings).
 * The value is read again whenever the key changes, and kept in sync with writes
 * made through this hook or `writeStorageValue` (same window) and from other tabs.
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
    const [storage, setStorage] = useState<T>(initialValue);

    // Callers often pass a new literal ([] or {}) on every render: keep it in a ref so the
    // effects below only depend on the key
    const initialValueRef = useRef(initialValue);
    initialValueRef.current = initialValue;

    // Read the stored value on mount and whenever the key changes (e.g. another place)
    useEffect(() => {
        const fallback = initialValueRef.current;
        try {
            const item = window.localStorage.getItem(key);
            const parse = typeof fallback !== 'string';
            setStorage(item ? (parse ? JSON.parse(item) : item) : fallback);
        } catch (error) {
            console.log(error);
            setStorage(fallback);
        }
    }, [key]);

    // Listen to localStorage changes from other components/tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    const parse = typeof initialValueRef.current !== 'string';
                    const newValue = parse ? JSON.parse(e.newValue) : e.newValue;
                    setStorage(newValue);
                } catch (error) {
                    console.error('Error parsing storage value:', error);
                }
            }
        };

        const handleSameWindowChange = (e: Event) => {
            const { detail } = e as CustomEvent<StorageChangeDetail>;
            if (detail.key === key) {
                setStorage(detail.value as T);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(SAME_WINDOW_EVENT, handleSameWindowChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(SAME_WINDOW_EVENT, handleSameWindowChange);
        };
    }, [key]);

    // Wrapped version of useState's setter that also persists the new value
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storage) : value;
            setStorage(valueToStore);
            writeStorageValue(key, valueToStore);
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storage, setValue];
}
