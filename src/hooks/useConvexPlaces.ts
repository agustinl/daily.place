import { useMutation, useQuery } from 'convex/react';
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
    // Query to get places
    const convexPlaces = useQuery(api.places.getPlaceNames);

    // Mutation to delete a place
    const deletePlace = useMutation(api.places.deletePlace);

	const handleDeletePlace = async (placeName: string) => {
		try {
			await deletePlace({ placeName });
		} catch (error) {
			console.error('Error deleting place:', error);
			throw error;
		}
	};

    return {
        places: convexPlaces ?? [],
        isLoading: convexPlaces === undefined,
        deletePlace: handleDeletePlace
    };
};
