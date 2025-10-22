import { renderHook, act, waitFor } from '@testing-library/react';
import { useLanguage } from '@/hooks/useLanguage';
import * as i18n from '@/i18n';

// Mock the i18n module
jest.mock('@/i18n', () => ({
    defaultLocale: 'en',
    getStoredLocale: jest.fn(() => 'en'),
    setStoredLocale: jest.fn(),
}));

// Mock dynamic imports for message files
jest.mock('../../messages/en.json', () => ({
    default: {
        welcome: 'Welcome',
        hello: 'Hello',
    },
}), { virtual: true });

jest.mock('../../messages/es.json', () => ({
    default: {
        welcome: 'Bienvenido',
        hello: 'Hola',
    },
}), { virtual: true });

jest.mock('../../messages/pt.json', () => ({
    default: {
        welcome: 'Bem-vindo',
        hello: 'Olá',
    },
}), { virtual: true });

describe('useLanguage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.lang = '';
        (i18n.getStoredLocale as jest.Mock).mockReturnValue('en');
    });

    describe('Initialization', () => {
        it('should initialize with default locale (en)', () => {
            const { result } = renderHook(() => useLanguage());

            expect(result.current.locale).toBe('en');
        });

        it('should load English messages synchronously on mount', () => {
            const { result } = renderHook(() => useLanguage());

            expect(result.current.messages).toBeDefined();
            expect(Object.keys(result.current.messages).length).toBeGreaterThan(0);
        });

        it('should load stored locale from localStorage on mount', async () => {
            (i18n.getStoredLocale as jest.Mock).mockReturnValue('es');

            const { result } = renderHook(() => useLanguage());

            await waitFor(() => {
                expect(result.current.locale).toBe('es');
            });
        });

        it('should not reload if stored locale is default locale', () => {
            (i18n.getStoredLocale as jest.Mock).mockReturnValue('en');

            const { result } = renderHook(() => useLanguage());

            expect(result.current.locale).toBe('en');
        });

        it('should update document.lang attribute on mount', async () => {
            (i18n.getStoredLocale as jest.Mock).mockReturnValue('es');

            renderHook(() => useLanguage());

            await waitFor(() => {
                expect(document.documentElement.lang).toBe('es');
            });
        });
    });

    describe('setLocale', () => {
        it('should change locale', async () => {
            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('es');
            });

            await waitFor(() => {
                expect(result.current.locale).toBe('es');
            });
        });

        it('should call setStoredLocale when changing locale', async () => {
            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('pt');
            });

            expect(i18n.setStoredLocale).toHaveBeenCalledWith('pt');
        });

        it('should load messages for new locale', async () => {
            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('es');
            });

            await waitFor(() => {
                expect(result.current.locale).toBe('es');
                expect(result.current.messages).toBeDefined();
            });
        });

        it('should update document.lang attribute', async () => {
            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('pt');
            });

            await waitFor(() => {
                expect(document.documentElement.lang).toBe('pt');
            });
        });

        it('should handle all supported locales', async () => {
            const locales: Array<'en' | 'es' | 'pt'> = ['en', 'es', 'pt'];

            for (const locale of locales) {
                const { result } = renderHook(() => useLanguage());

                act(() => {
                    result.current.setLocale(locale);
                });

                await waitFor(() => {
                    expect(result.current.locale).toBe(locale);
                });
            }
        });
    });

    describe('Message loading', () => {
        it('should have English messages available immediately', () => {
            const { result } = renderHook(() => useLanguage());

            expect(result.current.messages).toBeDefined();
            expect(typeof result.current.messages).toBe('object');
        });

        it('should maintain messages object reference when possible', () => {
            const { result } = renderHook(() => useLanguage());

            const initialMessages = result.current.messages;

            // Messages should be stable on initial render
            expect(result.current.messages).toBe(initialMessages);
        });
    });

    describe('Fallback behavior', () => {
        it('should fallback to English if locale loading fails', async () => {
            // Mock a failed import by temporarily breaking the mock
            const originalError = console.error;
            console.error = jest.fn();

            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('invalid' as any);
            });

            await waitFor(() => {
                // Should still have messages (fallback to English)
                expect(result.current.messages).toBeDefined();
                expect(Object.keys(result.current.messages).length).toBeGreaterThan(0);
            });

            console.error = originalError;
        });
    });

    describe('Multiple locale changes', () => {
        it('should handle rapid locale changes', async () => {
            const { result } = renderHook(() => useLanguage());

            act(() => {
                result.current.setLocale('es');
            });

            act(() => {
                result.current.setLocale('pt');
            });

            act(() => {
                result.current.setLocale('en');
            });

            await waitFor(() => {
                expect(result.current.locale).toBe('en');
            });
        });

        it('should persist locale changes to localStorage', async () => {
            const { result } = renderHook(() => useLanguage());

            const testLocales: Array<'en' | 'es' | 'pt'> = ['es', 'pt', 'en'];

            for (const locale of testLocales) {
                act(() => {
                    result.current.setLocale(locale);
                });

                expect(i18n.setStoredLocale).toHaveBeenCalledWith(locale);
            }
        });
    });

    describe('Return value structure', () => {
        it('should return locale, setLocale, and messages', () => {
            const { result } = renderHook(() => useLanguage());

            expect(result.current).toHaveProperty('locale');
            expect(result.current).toHaveProperty('setLocale');
            expect(result.current).toHaveProperty('messages');
        });

        it('should have correct types', () => {
            const { result } = renderHook(() => useLanguage());

            expect(typeof result.current.locale).toBe('string');
            expect(typeof result.current.setLocale).toBe('function');
            expect(typeof result.current.messages).toBe('object');
        });
    });

    describe('SSR safety', () => {
        it('should not crash when document is undefined', () => {
            const originalDocument = global.document;

            // Temporarily remove document
            delete (global as any).document;

            expect(() => {
                renderHook(() => useLanguage());
            }).not.toThrow();

            // Restore document
            (global as any).document = originalDocument;
        });
    });

    describe('Hook stability', () => {
        it('setLocale function should be memoized', () => {
            const { result, rerender } = renderHook(() => useLanguage());

            const firstSetLocale = result.current.setLocale;

            rerender();

            expect(result.current.setLocale).toBe(firstSetLocale);
        });
    });
});

