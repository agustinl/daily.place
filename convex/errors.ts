import { ConvexError } from 'convex/values';

/**
 * Error codes sent to the client in `ConvexError.data`.
 * The client maps each code to a translated message (see src/lib/syncError.ts).
 */
export const SYNC_ERROR_CODES = [
    'unauthenticated',
    'placeNameRequired',
    'placeNameTooLong',
    'tooManyTasks',
    'taskTextTooLong'
] as const;

export type SyncErrorCode = (typeof SYNC_ERROR_CODES)[number];

export type SyncErrorData = {
    code: SyncErrorCode;
    /** Limit that was exceeded, for the size errors. */
    max?: number;
};

export const syncError = (code: SyncErrorCode, max?: number) =>
    new ConvexError<SyncErrorData>(max === undefined ? { code } : { code, max });
