import { useState, useEffect, useCallback } from 'react';
import { Locale, defaultLocale, getStoredLocale, setStoredLocale } from '@/i18n';
// Import default English messages synchronously to avoid MISSING_MESSAGE errors
import defaultMessages from '../../messages/en.json';

interface UseLanguageReturn {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    messages: Record<string, any>;
}

/**
 * Custom hook to manage application language/locale
 *
 * Handles loading translation messages from JSON files, persisting
 * locale selection to localStorage, and updating the document lang attribute.
 * Loads English messages by default synchronously, then applies user preference.
 *
 * @returns Object with current locale, setter function, and loaded messages
 *
 * @example
 * ```tsx
 * const { locale, setLocale, messages } = useLanguage();
 *
 * <button onClick={() => setLocale('es')}>
 *   Switch to Spanish
 * </button>
 * ```
 */
export const useLanguage = (): UseLanguageReturn => {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);
    // Initialize with default English messages to prevent MISSING_MESSAGE errors
    const [messages, setMessages] = useState<Record<string, any>>(defaultMessages);

    // Load user's preferred locale from localStorage
    useEffect(() => {
        const storedLocale = getStoredLocale();
        if (storedLocale !== defaultLocale) {
            setLocaleState(storedLocale);
            loadMessages(storedLocale);
        }
        // Update document lang attribute
        if (typeof document !== 'undefined') {
            document.documentElement.lang = storedLocale;
        }
    }, []);

    const loadMessages = async (loc: Locale) => {
        try {
            const msgs = await import(`../../messages/${loc}.json`);
            setMessages(msgs.default || defaultMessages);
        } catch (error) {
            console.error(`Failed to load messages for locale: ${loc}`, error);
            // Keep current messages (at least default English) instead of empty object
            setMessages(defaultMessages);
        }
    };

    const setLocale = useCallback((newLocale: Locale) => {
        setStoredLocale(newLocale);
        setLocaleState(newLocale);
        loadMessages(newLocale);

        // Update document lang attribute
        if (typeof document !== 'undefined') {
            document.documentElement.lang = newLocale;
        }
    }, []);

    return {
        locale,
        setLocale,
        messages
    };
};

