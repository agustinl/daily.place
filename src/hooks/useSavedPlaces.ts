import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import useLocalStorage from '@/hooks/useLocalStorage';

/**
 * Every place the user has: the ones saved in this browser first, then the ones that only
 * exist in the cloud (signed-in users). Each name appears once.
 */
export const useSavedPlaces = (): string[] => {
    const [storedPlaces] = useLocalStorage<string>(STORAGE_KEYS.placeNames, '');
    const { places: cloudPlaces } = useConvexPlaces();

    const localPlaces = storedPlaces ? storedPlaces.split(',') : [];
    return Array.from(new Set([...localPlaces, ...cloudPlaces])).filter(Boolean);
};
