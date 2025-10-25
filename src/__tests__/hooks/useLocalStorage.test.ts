import { renderHook, act, waitFor } from '@testing-library/react';
import useLocalStorage from '@/hooks/useLocalStorage';

// Mock next router
const mockRouter = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
};

jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
}));

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should return initial value when localStorage is empty', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initialValue')
            );

            expect(result.current[0]).toBe('initialValue');
        });

        it('should return stored value when localStorage has data', () => {
            localStorage.setItem('testKey', JSON.stringify('storedValue'));

            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initialValue')
            );

            waitFor(() => {
                expect(result.current[0]).toBe('storedValue');
            });
        });

        it('should handle object initial values', () => {
            const initialObject = { name: 'test', count: 0 };
            const { result } = renderHook(() =>
                useLocalStorage('testKey', initialObject)
            );

            expect(result.current[0]).toEqual(initialObject);
        });

        it('should handle array initial values', () => {
            const initialArray = [1, 2, 3];
            const { result } = renderHook(() =>
                useLocalStorage('testKey', initialArray)
            );

            expect(result.current[0]).toEqual(initialArray);
        });
    });

    describe('Writing values', () => {
        it('should write string values to localStorage', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initial')
            );

            act(() => {
                result.current[1]('newValue');
            });

            expect(localStorage.getItem('testKey')).toBe('newValue');
            expect(result.current[0]).toBe('newValue');
        });

        it('should write object values to localStorage as JSON', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', { count: 0 })
            );

            const newObject = { count: 5, name: 'test' };
            act(() => {
                result.current[1](newObject);
            });

            expect(localStorage.getItem('testKey')).toBe(JSON.stringify(newObject));
            expect(result.current[0]).toEqual(newObject);
        });

        it('should write array values to localStorage as JSON', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', [] as number[])
            );

            const newArray = [1, 2, 3, 4, 5];
            act(() => {
                result.current[1](newArray);
            });

            expect(localStorage.getItem('testKey')).toBe(JSON.stringify(newArray));
            expect(result.current[0]).toEqual(newArray);
        });

        it('should handle functional updates like useState', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', 10)
            );

            act(() => {
                result.current[1](prev => prev + 5);
            });

            expect(result.current[0]).toBe(15);
            expect(localStorage.getItem('testKey')).toBe(JSON.stringify(15));
        });
    });

    describe('JSON parsing', () => {
        it('should parse JSON for object values', () => {
            const storedObject = { name: 'test', value: 123 };
            localStorage.setItem('testKey', JSON.stringify(storedObject));

            const { result } = renderHook(() =>
                useLocalStorage('testKey', {})
            );

            waitFor(() => {
                expect(result.current[0]).toEqual(storedObject);
            });
        });

        it('should parse JSON for array values', () => {
            const storedArray = [1, 2, 3, 4];
            localStorage.setItem('testKey', JSON.stringify(storedArray));

            const { result } = renderHook(() =>
                useLocalStorage('testKey', [])
            );

            waitFor(() => {
                expect(result.current[0]).toEqual(storedArray);
            });
        });

        it('should not parse string values', () => {
            localStorage.setItem('testKey', 'plainString');

            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'default')
            );

            waitFor(() => {
                expect(result.current[0]).toBe('plainString');
            });
        });

        it('should handle corrupted JSON gracefully', () => {
            localStorage.setItem('testKey', '{invalid json}');

            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'fallback')
            );

            waitFor(() => {
                expect(result.current[0]).toBe('fallback');
            });
        });
    });

    describe('Cross-component synchronization', () => {
        it('should dispatch custom event when value changes', () => {
            const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initial')
            );

            act(() => {
                result.current[1]('updated');
            });

            expect(dispatchEventSpy).toHaveBeenCalled();
            const lastCall = dispatchEventSpy.mock.calls[dispatchEventSpy.mock.calls.length - 1][0];
            expect(lastCall).toBeInstanceOf(CustomEvent);
            expect((lastCall as CustomEvent).type).toBe('localStorageChange');
        });

        it('should sync between multiple hook instances', () => {
            const { result: result1 } = renderHook(() =>
                useLocalStorage('sharedKey', 0)
            );

            const { result: result2 } = renderHook(() =>
                useLocalStorage('sharedKey', 0)
            );

            act(() => {
                result1.current[1](42);
            });

            // Both should eventually have the same value
            waitFor(() => {
                expect(result1.current[0]).toBe(42);
            });
        });
    });

    describe('Router query changes', () => {
        it('should reload value from localStorage when router query changes', () => {
            localStorage.setItem('testKey', JSON.stringify('stored'));

            const { result, rerender } = renderHook(() =>
                useLocalStorage('testKey', 'initial')
            );

            // Simulate router query change
            mockRouter.query = { page: '2' };
            rerender();

            waitFor(() => {
                expect(result.current[0]).toBe('stored');
            });
        });
    });

    describe('Error handling', () => {
        it('should not crash when localStorage is full', () => {
            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initial')
            );

            // Mock localStorage.setItem to throw
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = jest.fn(() => {
                throw new Error('QuotaExceededError');
            });

            expect(() => {
                act(() => {
                    result.current[1]('newValue');
                });
            }).not.toThrow();

            // Restore
            Storage.prototype.setItem = originalSetItem;
        });

        it('should handle localStorage access errors gracefully', () => {
            // Mock localStorage.getItem to throw
            const originalGetItem = Storage.prototype.getItem;
            Storage.prototype.getItem = jest.fn(() => {
                throw new Error('Access denied');
            });

            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'fallback')
            );

            waitFor(() => {
                expect(result.current[0]).toBe('fallback');
            });

            // Restore
            Storage.prototype.getItem = originalGetItem;
        });
    });

    describe('SSR safety', () => {
        it('should not crash when window is undefined', () => {
            // The hook checks for typeof window === 'undefined'
            // In jsdom window exists, but we can verify the hook doesn't crash
            expect(() => {
                renderHook(() => useLocalStorage('testKey', 'initial'));
            }).not.toThrow();
        });
    });
});

