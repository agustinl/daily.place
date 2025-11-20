import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useConfetti } from '@/hooks/useConfetti';
import { useConvexTasks } from '@/hooks/useConvexTasks';
import useLocalStorage from '@/hooks/useLocalStorage';
import { TaskType, EditedTaskType } from '@/types/task';

interface TaskProgress {
    progress: number;
    percentage: number;
    total: number;
}

interface UseTasksReturn {
    tasks: TaskType[];
    progress: TaskProgress;
    opened: boolean;
    setOpened: (opened: boolean) => void;
    editedTask: EditedTaskType;
    addNewTask: (text: string) => void;
    markTaskAsReady: (taskIndex: number, readyBoolean: boolean) => void;
    deleteTask: (taskIndex: number) => void;
    moveTaskOrder: (fromIndex: number, toIndex: number) => void;
    moveDoneTasksDown: () => void;
    handleEditTaskClick: (taskIndex: number) => void;
    editTask: (newValue: string) => void;
    deleteAllTasks: () => void;
    syncWithConvex: () => Promise<void>;
    pullFromConvex: () => Promise<void>;
    hasUnsyncedChanges: boolean;
    isSyncing: boolean;
    isPulling: boolean;
}

/**
 * Custom hook to manage todo list tasks
 *
 * Provides CRUD operations for tasks, progress calculation,
 * reordering functionality, and Google Analytics tracking.
 * All changes are persisted to localStorage.
 * When the user is authenticated, tasks are synced with cloud
 *
 * @param name - Place name used as localStorage key prefix
 * @returns Object with tasks array, progress metrics, and task management methods
 *
 * @example
 * ```tsx
 * const {
 *   tasks,
 *   progress,
 *   addNewTask,
 *   markTaskAsReady,
 *   deleteTask
 * } = useTasks('myplace');
 * ```
 */
export const useTasks = (name: string): UseTasksReturn => {
    const { isSignedIn, isLoaded } = useUser();
    const t = useTranslations();

    // LocalStorage hooks (always available for offline)
    const [storage, setStorage] = useLocalStorage<TaskType[]>(`dailyTodo_${name}`, []);

    const { tasks: convexTasks, updateTasks: convexUpdate, isLoading } = useConvexTasks(name);

    // Local state
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [opened, setOpened] = useState(false);
    const [editedTask, setEditedTask] = useState<EditedTaskType>({} as EditedTaskType);
    const [hasSynced, setHasSynced] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

    const { trackEvent } = useAnalytics();
    const { celebrate } = useConfetti();
    const [confettiEnabled] = useLocalStorage<boolean>('confettiEnabled', true);

    // Auto-pull from cloud when user logs in (if needed)
    useEffect(() => {
        if (isLoaded && isSignedIn && !hasSynced && !isLoading) {
            const localTasks = storage;

            // localStorage empty but cloud has data → Auto-pull
            if (localTasks.length === 0 && convexTasks.length > 0) {
                setStorage(convexTasks);
                notifications.show({
                    title: t('sync.pullSuccess'),
                    message: t('sync.pulledTasks', { count: convexTasks.length }),
                    color: 'blue',
                    autoClose: 2500,
                });

                trackEvent({
                    action: 'tasks_auto_pulled',
                    category: 'todo',
                    label: 'Auto-pull on login'
                });
            }
            setHasSynced(true);
        }
    }, [isLoaded, isSignedIn, hasSynced, isLoading, storage, convexTasks, setStorage, t, trackEvent]);

    // Always use localStorage as the single source of truth
    useEffect(() => {
        if (!isLoaded) return;

        // ALWAYS display localStorage (even when authenticated)
        setTasks(storage);

        // Detect unsynced changes only when authenticated
        if (isSignedIn && !isLoading && hasSynced) {
            const tasksAreDifferent = JSON.stringify(storage) !== JSON.stringify(convexTasks);
            setHasUnsyncedChanges(tasksAreDifferent);
        } else {
            setHasUnsyncedChanges(false);
        }
    }, [isLoaded, isSignedIn, isLoading, storage, convexTasks, hasSynced]);

    // Calculate progress in an optimized way
    const progress = useMemo<TaskProgress>(() => {
        const completedCount = tasks?.filter((task: TaskType) => task.ready === true)?.length ?? 0;
        const total = tasks?.length ?? 0;
        const percentage = Math.round((completedCount * 100) / total) || 0;

        return {
            progress: completedCount,
            percentage,
            total
        };
    }, [tasks]);

    // Manual sync function - syncs localStorage to cloud
    const syncWithConvex = useCallback(async () => {
        if (!isSignedIn || !isLoaded) {
            notifications.show({
                title: t('sync.syncError'),
                message: t('auth.signIn'),
                color: 'red',
                autoClose: 3000,
            });
            return;
        }

        setIsSyncing(true);

        try {
            const localTasks = storage;
            await convexUpdate(localTasks);

            notifications.show({
                title: t('sync.syncSuccess'),
                message: t('sync.syncedTasks', { count: localTasks.length }),
                color: 'green',
                autoClose: 2500,
            });

            setHasUnsyncedChanges(false);

            trackEvent({
                action: 'tasks_synced',
                category: 'todo',
                label: 'Manual sync completed'
            });
        } catch (error) {
            notifications.show({
                title: t('sync.syncError'),
                message: String(error),
                color: 'red',
                autoClose: 4000,
            });
        } finally {
            setIsSyncing(false);
        }
    }, [isSignedIn, isLoaded, storage, convexUpdate, t, trackEvent]);

    // Manual pull function - downloads from cloud to localStorage
    const pullFromConvex = useCallback(async () => {
        if (!isSignedIn || !isLoaded) {
            notifications.show({
                title: t('sync.pullError'),
                message: t('auth.signIn'),
                color: 'red',
                autoClose: 3000,
            });
            return;
        }

        setIsPulling(true);

        try {
            // Download from cloud and overwrite localStorage
            setStorage(convexTasks);

            notifications.show({
                title: t('sync.pullSuccess'),
                message: t('sync.pulledTasks', { count: convexTasks.length }),
                color: 'blue',
                autoClose: 2500,
            });

            setHasUnsyncedChanges(false);

            trackEvent({
                action: 'tasks_pulled',
                category: 'todo',
                label: 'Manual pull completed'
            });
        } catch (error) {
            notifications.show({
                title: t('sync.pullError'),
                message: String(error),
                color: 'red',
                autoClose: 4000,
            });
        } finally {
            setIsPulling(false);
        }
    }, [isSignedIn, isLoaded, convexTasks, setStorage, t, trackEvent]);

    const addNewTask = useCallback((text: string) => {
        if (!text || text.trim() === '') return;

        const new_tasks = [
            ...tasks,
            {
                text: text.trim(),
                ready: false
            }
        ];

        trackEvent({
            action: 'task_added',
            category: 'todo',
            label: 'New task created'
        });

        // Always update localStorage (sync manually with cloud)
        setStorage(new_tasks);
    }, [tasks, setStorage, trackEvent]);

    const markTaskAsReady = useCallback((taskIndex: number, readyBoolean: boolean) => {
        const temporal_tasks = [...tasks];
        temporal_tasks[taskIndex].ready = readyBoolean;

        trackEvent({
            action: readyBoolean ? 'task_completed' : 'task_uncompleted',
            category: 'todo',
            label: readyBoolean ? 'Task marked as complete' : 'Task marked as incomplete'
        });

        // Always update localStorage (sync manually with cloud)
        setStorage(temporal_tasks);

        // Celebrate when all tasks are completed (if enabled)
        if (readyBoolean && temporal_tasks.length > 0 && confettiEnabled) {
            const allCompleted = temporal_tasks.every(task => task.ready);
            if (allCompleted) {
                celebrate();
                trackEvent({
                    action: 'all_tasks_completed',
                    category: 'todo',
                    label: 'All tasks completed - confetti triggered'
                });
            }
        }
    }, [tasks, setStorage, trackEvent, celebrate, confettiEnabled]);

    const deleteTask = useCallback((taskIndex: number) => {
        const temporal_tasks = [...tasks];
        temporal_tasks.splice(taskIndex, 1);

        trackEvent({
            action: 'task_deleted',
            category: 'todo',
            label: 'Task deleted'
        });

        // Always update localStorage (sync manually with cloud)
        setStorage(temporal_tasks);
    }, [tasks, setStorage, trackEvent]);

    const moveTaskOrder = useCallback((fromIndex: number, toIndex: number) => {
        const temporal_tasks = [...tasks];
        const task = temporal_tasks[fromIndex];

        temporal_tasks?.splice(fromIndex, 1);
        temporal_tasks.splice(toIndex, 0, task);

        // Always update localStorage (sync manually with Convex)
        setStorage(temporal_tasks);
    }, [tasks, setStorage]);

    const moveDoneTasksDown = useCallback(() => {
        const temporal_tasks = [...tasks];
        temporal_tasks?.sort((a, b) => (a.ready ? 1 : 0) - (b.ready ? 1 : 0));

        // Always update localStorage (sync manually with cloud)
        setStorage(temporal_tasks);
    }, [tasks, setStorage]);

    const handleEditTaskClick = useCallback((taskIndex: number) => {
        const temporal_edited_task = tasks[taskIndex];
        setEditedTask({ ...temporal_edited_task, i: taskIndex });
        setOpened(true);
    }, [tasks]);

    const editTask = useCallback((newValue: string) => {
        const temporal_tasks = [...tasks];
        temporal_tasks[editedTask?.i].text = newValue;

        trackEvent({
            action: 'task_edited',
            category: 'todo',
            label: 'Task edited'
        });

        // Always update localStorage (sync manually with Convex)
        setStorage(temporal_tasks);
        setOpened(false);
    }, [tasks, editedTask, setStorage, trackEvent]);

    const deleteAllTasks = useCallback(() => {
        trackEvent({
            action: 'all_tasks_deleted',
            category: 'todo',
            label: 'All tasks deleted'
        });

        // Always update localStorage (sync manually with Convex)
        setStorage([]);
    }, [setStorage, trackEvent]);

    return {
        tasks,
        progress,
        opened,
        setOpened,
        editedTask,
        addNewTask,
        markTaskAsReady,
        deleteTask,
        moveTaskOrder,
        moveDoneTasksDown,
        handleEditTaskClick,
        editTask,
        deleteAllTasks,
        syncWithConvex,
        pullFromConvex,
        hasUnsyncedChanges,
        isSyncing,
        isPulling
    };
};

