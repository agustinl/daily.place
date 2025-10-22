export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    pt: 'Português'
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
    pt: '🇵🇹'
};

// Helper to get locale from localStorage (client-side only)
export const getStoredLocale = (): Locale => {
    if (typeof window === 'undefined') return defaultLocale;

    const stored = localStorage.getItem('dailyPlaceLanguage');
    if (stored && locales.includes(stored as Locale)) {
        return stored as Locale;
    }
    return defaultLocale;
};

// Helper to set locale in localStorage
export const setStoredLocale = (locale: Locale): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('dailyPlaceLanguage', locale);
    }
};

