import { useState, useEffect, useCallback, useMemo } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConfetti } from '@/hooks/useConfetti';
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
}

/**
 * Custom hook to manage todo list tasks
 *
 * Provides CRUD operations for tasks, progress calculation,
 * reordering functionality, and Google Analytics tracking.
 * All changes are persisted to localStorage.
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
    const [storage, setStorage] = useLocalStorage<TaskType[]>(`dailyTodo_${name}`, []);
    const [tasks, setTasks] = useState<TaskType[]>(storage);
    const [opened, setOpened] = useState(false);
    const [editedTask, setEditedTask] = useState<EditedTaskType>({} as EditedTaskType);
    const { trackEvent } = useAnalytics();
    const { celebrate } = useConfetti();
    const [confettiEnabled] = useLocalStorage<boolean>('confettiEnabled', true);

    // Synchronize tasks with storage
    useEffect(() => {
        setTasks(storage);
    }, [storage]);

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

        setStorage(temporal_tasks);
    }, [tasks, setStorage, trackEvent]);

    const moveTaskOrder = useCallback((fromIndex: number, toIndex: number) => {
        const temporal_tasks = [...tasks];
        const task = temporal_tasks[fromIndex];

        temporal_tasks?.splice(fromIndex, 1);
        temporal_tasks.splice(toIndex, 0, task);

        setStorage(temporal_tasks);
    }, [tasks, setStorage]);

    const moveDoneTasksDown = useCallback(() => {
        const temporal_tasks = [...tasks];
        temporal_tasks?.sort((a, b) => (a.ready ? 1 : 0) - (b.ready ? 1 : 0));

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

        setStorage(temporal_tasks);
        setOpened(false);
    }, [tasks, editedTask, setStorage, trackEvent]);

    const deleteAllTasks = useCallback(() => {
        trackEvent({
            action: 'all_tasks_deleted',
            category: 'todo',
            label: 'All tasks deleted'
        });

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
        deleteAllTasks
    };
};

