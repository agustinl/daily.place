import type { useTranslations } from 'next-intl';

import { LIMITS } from '../../convex/validation';

type Translate = ReturnType<typeof useTranslations>;

/**
 * Characters that can't be part of a place name: `,` separates names in
 * `dailyPlaceNames`, and the rest would break the `/<name>` URL.
 */
const INVALID_CHARACTERS = /[,/\\?#%]/;

type PlaceNameError = 'required' | 'invalidCharacters' | 'tooLong';

/** Validates a place name typed by the user. Returns null when it is valid. */
export const validatePlaceName = (rawName: string): PlaceNameError | null => {
    const name = rawName.trim();

    if (!name) return 'required';
    if (INVALID_CHARACTERS.test(name)) return 'invalidCharacters';
    if (name.length > LIMITS.placeNameLength) return 'tooLong';

    return null;
};

/** Mantine form validator that returns a translated error message. */
export const placeNameValidator = (t: Translate) => (value: string) => {
    const error = validatePlaceName(value);
    return error ? t(`places.nameErrors.${error}`, { max: LIMITS.placeNameLength }) : null;
};

/** Whether a name can be stored in the comma-separated `dailyPlaceNames` list. */
export const canStorePlaceName = (name: string) => Boolean(name) && !name.includes(',');
