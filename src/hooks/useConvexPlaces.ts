import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface UseConvexReturn {
    places: string[];
    isLoading: boolean;
    deletePlace: (placeName: string) => Promise<void>;
}

/**
 * Hook to manage places with cloud
 *
 * @returns Object with the places names and the function to delete the place
 *
 * @example
 * ```tsx
 * const { places } = useConvexPlaces();
 */
export const useConvexPlaces = (): UseConvexReturn => {
    // Query to get places (skipped without a session: there is nothing to read)
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const convexPlaces = useQuery(api.places.getPlaceNames, isAuthenticated ? {} : 'skip');

    // Mutation to delete a place
    const deletePlace = useMutation(api.places.deletePlace);

    // Errors reach the caller, which shows them to the user
    const handleDeletePlace = async (placeName: string) => {
        await deletePlace({ placeName });
    };

    return {
        places: convexPlaces ?? [],
        isLoading: isAuthLoading || (isAuthenticated && convexPlaces === undefined),
        deletePlace: handleDeletePlace
    };
};
