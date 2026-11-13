import { ConvexError } from 'convex/values';

/** Size limits for user-provided data stored in Convex. */
export const LIMITS = {
    placeNameLength: 100,
    tasksPerPlace: 500,
    taskTextLength: 2000
} as const;

export const assertValidPlaceName = (placeName: string) => {
    if (placeName.trim().length === 0) {
        throw new ConvexError('Place name is required');
    }
    if (placeName.length > LIMITS.placeNameLength) {
        throw new ConvexError(`Place name must be at most ${LIMITS.placeNameLength} characters`);
    }
};

export const assertValidTasks = (tasks: { text: string; ready: boolean }[]) => {
    if (tasks.length > LIMITS.tasksPerPlace) {
        throw new ConvexError(`A place can have at most ${LIMITS.tasksPerPlace} tasks`);
    }
    if (tasks.some((task) => task.text.length > LIMITS.taskTextLength)) {
        throw new ConvexError(`Tasks must be at most ${LIMITS.taskTextLength} characters`);
    }
};
