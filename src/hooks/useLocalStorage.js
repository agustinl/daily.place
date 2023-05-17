import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function useLocalStorage(key, initialValue, parse = true) {
    const router = useRouter();

	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storage, setStorage] = useState(null);

    useEffect(() => {
        setStorage(localStorageAction);        
    }, [router.query]);

    const localStorageAction = () => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? (parse ? JSON.parse(item) : item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    };

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = value => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storage) : value;
			// Save state
			setStorage(valueToStore);
			// Save to local storage
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, parse ? JSON.stringify(valueToStore) : valueToStore);
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};

	return [storage, setValue];
}
