import { useState, useEffect } from 'react';

/**
 * Custom hook to manage current date and time
 *
 * Provides a Date object that updates every minute,
 * useful for displaying clocks or time-based information.
 *
 * @returns Current Date object, updated every 60 seconds
 *
 * @example
 * ```tsx
 * const currentDate = useDateTime();
 * const formattedTime = format(currentDate, 'HH:mm');
 * ```
 */
export const useDateTime = (): Date => {
    const [dateState, setDateState] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateState(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return dateState;
};

