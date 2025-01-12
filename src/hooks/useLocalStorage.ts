import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const router = useRouter();

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storage, setStorage] = useState<T>(initialValue);

    useEffect(() => {
        setStorage(localStorageAction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

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
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storage, setValue];
}
