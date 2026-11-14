import { renderHook } from '@testing-library/react';

import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import { useConvexTasks } from '@/hooks/useConvexTasks';

let mockAuth = { isAuthenticated: false, isLoading: false };
let mockQueryResult: unknown = undefined;
const mockUseQuery = jest.fn((_query: unknown, _args: unknown) => mockQueryResult);

jest.mock('convex/react', () => ({
    useConvexAuth: () => mockAuth,
    useQuery: (query: unknown, args: unknown) => mockUseQuery(query, args),
    useMutation: () => jest.fn()
}));

describe.each([
    ['useConvexTasks', () => useConvexTasks('work').isLoading, { placeName: 'work' }],
    ['useConvexPlaces', () => useConvexPlaces().isLoading, {}]
])('%s', (_name, useIsLoading, expectedArgs) => {
    beforeEach(() => {
        mockUseQuery.mockClear();
        mockQueryResult = undefined;
    });

    it('skips the query without a session and is not loading', () => {
        mockAuth = { isAuthenticated: false, isLoading: false };
        const { result } = renderHook(useIsLoading);
        expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), 'skip');
        expect(result.current).toBe(false);
    });

    it('is loading while the session is being checked', () => {
        mockAuth = { isAuthenticated: false, isLoading: true };
        const { result } = renderHook(useIsLoading);
        expect(result.current).toBe(true);
    });

    it('runs the query with a session and loads until it resolves', () => {
        mockAuth = { isAuthenticated: true, isLoading: false };
        const { result, rerender } = renderHook(useIsLoading);
        expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), expectedArgs);
        expect(result.current).toBe(true);

        mockQueryResult = [];
        rerender();
        expect(result.current).toBe(false);
    });
});
