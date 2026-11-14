import { useConvexAuth, useQuery, useMutation } from 'convex/react';
import { TaskType } from '@/types/task';
import { api } from '../../convex/_generated/api';

interface UseConvexReturn {
    tasks: TaskType[];
    updateTasks: (tasks: TaskType[]) => Promise<void>;
    isLoading: boolean;
}

/**
 * Hook to manage tasks with cloud
 *
 * @param placeName - The name of the place to get the tasks from
 * @returns Object with the tasks, the function to update them and the loading state
 *
 * @example
 * ```tsx
 * const { tasks, updateTasks } = useConvexTasks('myplace');
 * updateTasks([{ text: 'Task 1', ready: false }, { text: 'Task 2', ready: true }]);
 */
export const useConvexTasks = (placeName: string): UseConvexReturn => {
    // Query to get tasks (skipped without a session: there is nothing to read)
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const convexTasks = useQuery(api.tasks.getTasks, isAuthenticated ? { placeName } : 'skip');

    const upsertTasks = useMutation(api.tasks.upsertTasks);

    // Errors reach the caller, which shows them to the user
    const updateTasks = async (tasks: TaskType[]) => {
        await upsertTasks({ placeName, tasks });
    };

    return {
        tasks: convexTasks ?? [],
        updateTasks,
        isLoading: isAuthLoading || (isAuthenticated && convexTasks === undefined),
    };
};

