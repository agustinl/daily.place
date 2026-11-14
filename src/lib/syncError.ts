import { ConvexError } from 'convex/values';
import type { useTranslations } from 'next-intl';

import { SYNC_ERROR_CODES, type SyncErrorData } from '../../convex/errors';

type Translate = ReturnType<typeof useTranslations>;

const isSyncErrorData = (data: unknown): data is SyncErrorData =>
    typeof data === 'object' &&
    data !== null &&
    SYNC_ERROR_CODES.includes((data as SyncErrorData).code);

/**
 * Turns an error thrown by a Convex call into a translated, user-facing message.
 * Unknown errors get a generic message, so internal details never reach the UI.
 */
export const getSyncErrorMessage = (error: unknown, t: Translate): string => {
    if (error instanceof ConvexError && isSyncErrorData(error.data)) {
        return t(`sync.errors.${error.data.code}`, { max: error.data.max ?? 0 });
    }
    return t('sync.errors.unknown');
};
