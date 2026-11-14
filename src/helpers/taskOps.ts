import { TaskType } from '@/types/task';

/*
 * Pure task list operations. They never mutate the given list or its tasks:
 * untouched tasks keep their identity (task rows rely on it for stable keys).
 */

export const addTask = (tasks: TaskType[], text: string): TaskType[] => [
    ...tasks,
    { text: text.trim(), ready: false }
];

export const setTaskReady = (tasks: TaskType[], index: number, ready: boolean): TaskType[] =>
    tasks.map((task, i) => (i === index ? { ...task, ready } : task));

export const setTaskText = (tasks: TaskType[], index: number, text: string): TaskType[] =>
    tasks.map((task, i) => (i === index ? { ...task, text } : task));

export const removeTask = (tasks: TaskType[], index: number): TaskType[] =>
    tasks.filter((_, i) => i !== index);

export const moveTask = (tasks: TaskType[], fromIndex: number, toIndex: number): TaskType[] => {
    const result = [...tasks];
    const [task] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, task);
    return result;
};

/** Done tasks go to the bottom, keeping the relative order inside each group. */
export const sortDoneLast = (tasks: TaskType[]): TaskType[] =>
    [...tasks].sort((a, b) => (a.ready ? 1 : 0) - (b.ready ? 1 : 0));

export const allTasksDone = (tasks: TaskType[]) =>
    tasks.length > 0 && tasks.every((task) => task.ready);
