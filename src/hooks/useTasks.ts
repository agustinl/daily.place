import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';

import { STORAGE_KEYS, todoKey } from '@/constants/storageKeys';
import {
    addTask,
    allTasksDone,
    moveTask,
    removeTask,
    setTaskReady,
    setTaskText,
    sortDoneLast
} from '@/helpers/taskOps';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConfetti } from '@/hooks/useConfetti';
import { useConvexTasks } from '@/hooks/useConvexTasks';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getSyncErrorMessage } from '@/lib/syncError';
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
    const [storage, setStorage] = useLocalStorage<TaskType[]>(todoKey(name), []);

    const { tasks: convexTasks, updateTasks: convexUpdate, isLoading } = useConvexTasks(name);

    // localStorage is the single source of truth for the displayed tasks (always available offline)
    const tasks = storage;

    // Local state
    const [opened, setOpened] = useState(false);
    const [editedTask, setEditedTask] = useState<EditedTaskType>({} as EditedTaskType);
    const [hasSynced, setHasSynced] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

    const { trackEvent } = useAnalytics();
    const { celebrate } = useConfetti();
    const [confettiEnabled] = useLocalStorage<boolean>(STORAGE_KEYS.confetti, true);

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
                    autoClose: 2500
                });

                trackEvent({
                    action: 'tasks_auto_pulled',
                    category: 'todo',
                    label: 'Auto-pull on login'
                });
            }
            setHasSynced(true);
        }
    }, [
        isLoaded,
        isSignedIn,
        hasSynced,
        isLoading,
        storage,
        convexTasks,
        setStorage,
        t,
        trackEvent
    ]);

    useEffect(() => {
        // Detect unsynced changes only when authenticated
        if (isLoaded && isSignedIn && !isLoading && hasSynced) {
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
                autoClose: 3000
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
                autoClose: 2500
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
                message: getSyncErrorMessage(error, t),
                color: 'red',
                autoClose: 4000
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
                autoClose: 3000
            });
            return;
        }

        // Cloud tasks not loaded yet: pulling now would replace local tasks with an empty list
        if (isLoading) {
            notifications.show({
                title: t('sync.pullError'),
                message: t('sync.errors.notLoaded'),
                color: 'red',
                autoClose: 3000
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
                autoClose: 2500
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
                message: getSyncErrorMessage(error, t),
                color: 'red',
                autoClose: 4000
            });
        } finally {
            setIsPulling(false);
        }
    }, [isSignedIn, isLoaded, isLoading, convexTasks, setStorage, t, trackEvent]);

    const addNewTask = useCallback(
        (text: string) => {
            if (!text || text.trim() === '') return;

            const new_tasks = addTask(storage, text);

            trackEvent({
                action: 'task_added',
                category: 'todo',
                label: 'New task created'
            });

            // Always update localStorage (sync manually with cloud)
            setStorage(new_tasks);
        },
        [storage, setStorage, trackEvent]
    );

    const markTaskAsReady = useCallback(
        (taskIndex: number, readyBoolean: boolean) => {
            const temporal_tasks = setTaskReady(storage, taskIndex, readyBoolean);

            trackEvent({
                action: readyBoolean ? 'task_completed' : 'task_uncompleted',
                category: 'todo',
                label: readyBoolean ? 'Task marked as complete' : 'Task marked as incomplete'
            });

            // Always update localStorage (sync manually with cloud)
            setStorage(temporal_tasks);

            // Celebrate when all tasks are completed (if enabled)
            if (readyBoolean && confettiEnabled && allTasksDone(temporal_tasks)) {
                celebrate();
                trackEvent({
                    action: 'all_tasks_completed',
                    category: 'todo',
                    label: 'All tasks completed - confetti triggered'
                });
            }
        },
        [storage, setStorage, trackEvent, celebrate, confettiEnabled]
    );

    const deleteTask = useCallback(
        (taskIndex: number) => {
            const temporal_tasks = removeTask(storage, taskIndex);

            trackEvent({
                action: 'task_deleted',
                category: 'todo',
                label: 'Task deleted'
            });

            // Always update localStorage (sync manually with cloud)
            setStorage(temporal_tasks);
        },
        [storage, setStorage, trackEvent]
    );

    const moveTaskOrder = useCallback(
        (fromIndex: number, toIndex: number) => {
            // Always update localStorage (sync manually with Convex)
            setStorage(moveTask(storage, fromIndex, toIndex));
        },
        [storage, setStorage]
    );

    const moveDoneTasksDown = useCallback(() => {
        // Always update localStorage (sync manually with cloud)
        setStorage(sortDoneLast(storage));
    }, [storage, setStorage]);

    const handleEditTaskClick = useCallback(
        (taskIndex: number) => {
            const temporal_edited_task = storage[taskIndex];
            setEditedTask({ ...temporal_edited_task, i: taskIndex });
            setOpened(true);
        },
        [storage]
    );

    const editTask = useCallback(
        (newValue: string) => {
            const temporal_tasks = setTaskText(storage, editedTask?.i, newValue);

            trackEvent({
                action: 'task_edited',
                category: 'todo',
                label: 'Task edited'
            });

            // Always update localStorage (sync manually with Convex)
            setStorage(temporal_tasks);
            setOpened(false);
        },
        [storage, editedTask, setStorage, trackEvent]
    );

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
