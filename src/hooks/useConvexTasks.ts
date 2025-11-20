import { useQuery, useMutation } from 'convex/react';
import { TaskType } from '@/types/task';
import { api } from '../../convex/_generated/api';

interface UseConvexReturn {
    tasks: TaskType[];
    updateTasks: (tasks: TaskType[]) => Promise<void>;
    clearTasks: () => Promise<void>;
    isLoading: boolean;
}

/**
 * Hook to manage tasks with cloud
 *
 * @param placeName - The name of the place to get the tasks from
 * @returns Object with the tasks and the functions to update and delete them
 *
 * @example
 * ```tsx
 * const { tasks, updateTasks, clearTasks } = useConvexTasks('myplace');
 * updateTasks([{ text: 'Task 1', ready: false }, { text: 'Task 2', ready: true }]);
 */
export const useConvexTasks = (placeName: string): UseConvexReturn => {
    // Query to get tasks
    const convexTasks = useQuery(api.tasks.getTasks, { placeName });

    // Mutation to update tasks
    const upsertTasks = useMutation(api.tasks.upsertTasks);

    // Mutation to delete all tasks
    const deleteTasks = useMutation(api.tasks.deleteTasks);

    const updateTasks = async (tasks: TaskType[]) => {
        try {
			await upsertTasks({ placeName, tasks });
        } catch (error) {
            throw error;
        }
    };

    const clearTasks = async () => {
        try {
            await deleteTasks({ placeName });
        } catch (error) {
            console.error('Error deleting tasks:', error);
            throw error;
        }
    };

    return {
        tasks: convexTasks ?? [],
        updateTasks,
        clearTasks,
        isLoading: convexTasks === undefined,
    };
};

