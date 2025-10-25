import { getStoredLocale, setStoredLocale, defaultLocale, locales } from '@/i18n';

describe('i18n helpers', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('getStoredLocale', () => {
        it('should return defaultLocale when localStorage is empty', () => {
            expect(getStoredLocale()).toBe(defaultLocale);
        });

        it('should return stored locale when valid locale exists', () => {
            localStorage.setItem('dailyPlaceLanguage', 'es');
            expect(getStoredLocale()).toBe('es');
        });

        it('should return stored locale for all valid locales', () => {
            locales.forEach(locale => {
                localStorage.setItem('dailyPlaceLanguage', locale);
                expect(getStoredLocale()).toBe(locale);
            });
        });

        it('should return defaultLocale when stored value is invalid', () => {
            localStorage.setItem('dailyPlaceLanguage', 'invalid');
            expect(getStoredLocale()).toBe(defaultLocale);
        });

        it('should return defaultLocale when stored value is empty string', () => {
            localStorage.setItem('dailyPlaceLanguage', '');
            expect(getStoredLocale()).toBe(defaultLocale);
        });

        it('should handle case sensitivity correctly', () => {
            localStorage.setItem('dailyPlaceLanguage', 'ES'); // uppercase
            expect(getStoredLocale()).toBe(defaultLocale); // should not match
        });
    });

    describe('setStoredLocale', () => {
        it('should store locale in localStorage', () => {
            setStoredLocale('es');
            expect(localStorage.getItem('dailyPlaceLanguage')).toBe('es');
        });

        it('should store all valid locales', () => {
            locales.forEach(locale => {
                setStoredLocale(locale);
                expect(localStorage.getItem('dailyPlaceLanguage')).toBe(locale);
            });
        });

        it('should overwrite existing locale', () => {
            setStoredLocale('en');
            expect(localStorage.getItem('dailyPlaceLanguage')).toBe('en');

            setStoredLocale('es');
            expect(localStorage.getItem('dailyPlaceLanguage')).toBe('es');
        });

        it('should use correct localStorage key', () => {
            setStoredLocale('pt');
            expect(localStorage.setItem).toHaveBeenCalledWith('dailyPlaceLanguage', 'pt');
        });
    });

    describe('SSR safety', () => {
        it('getStoredLocale should handle SSR environment (no window)', () => {
            // This test verifies the code has typeof window checks
            // In actual SSR, window would be undefined
            // In jsdom, window exists, so we just verify it doesn't crash
            expect(() => getStoredLocale()).not.toThrow();
        });

        it('setStoredLocale should handle SSR environment (no window)', () => {
            // Similar to above - verify it doesn't crash
            expect(() => setStoredLocale('en')).not.toThrow();
        });
    });

    describe('Integration scenarios', () => {
        it('should correctly round-trip locale storage', () => {
            setStoredLocale('es');
            expect(getStoredLocale()).toBe('es');

            setStoredLocale('pt');
            expect(getStoredLocale()).toBe('pt');

            setStoredLocale('en');
            expect(getStoredLocale()).toBe('en');
        });

        it('should maintain locale between page reloads (simulated)', () => {
            setStoredLocale('es');

            // Simulate page reload by clearing memory but keeping localStorage
            const storedValue = localStorage.getItem('dailyPlaceLanguage');
            expect(storedValue).toBe('es');

            // Get locale as if on fresh page load
            expect(getStoredLocale()).toBe('es');
        });
    });
});

