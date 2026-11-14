import { syncError } from './errors';

/** Size limits for user-provided data stored in Convex. */
export const LIMITS = {
    placeNameLength: 100,
    tasksPerPlace: 500,
    taskTextLength: 2000
} as const;

export const assertValidPlaceName = (placeName: string) => {
    if (placeName.trim().length === 0) {
        throw syncError('placeNameRequired');
    }
    if (placeName.length > LIMITS.placeNameLength) {
        throw syncError('placeNameTooLong', LIMITS.placeNameLength);
    }
};

export const assertValidTasks = (tasks: { text: string; ready: boolean }[]) => {
    if (tasks.length > LIMITS.tasksPerPlace) {
        throw syncError('tooManyTasks', LIMITS.tasksPerPlace);
    }
    if (tasks.some((task) => task.text.length > LIMITS.taskTextLength)) {
        throw syncError('taskTextTooLong', LIMITS.taskTextLength);
    }
};
