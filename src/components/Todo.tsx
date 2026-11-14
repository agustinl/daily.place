import { useRef, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

import { ActionIcon, TextInput, ScrollArea, Tooltip } from '@mantine/core';
import {
    IconSortDescending2,
    IconPlus,
    IconCloudUpload,
    IconCloudDownload
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useTasks } from '@/hooks/useTasks';

import Action from './common/Action';
import TaskProgress from './common/TaskProgress';
import DeleteTasks from './modals/DeleteTasks';
import EditTask from './modals/EditTask';
import PullTasks from './modals/PullTasks';
import shared from './PlaceCard.module.css';
import Tasks from './Tasks';
import classes from './Todo.module.css';

interface TodoProps {
    name: string;
}

const Todo = ({ name }: TodoProps) => {
    const t = useTranslations();
    const { isSignedIn } = useUser();
    const {
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
    } = useTasks(name);

    const task = useRef<HTMLInputElement>(null);
    const [pullModalOpened, setPullModalOpened] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Avoid hydration problems with SSR
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!task.current || task?.current?.value?.trim() === '') return;

        addNewTask(task.current.value);
        task.current.value = '';
    };

    return (
        <>
            <section aria-labelledby="todo-title" className={`${shared.card} ${shared.half}`}>
                <div className={shared.header}>
                    <h2 id="todo-title" className={shared.title}>
                        {t('todo.title')}
                    </h2>
                    <div className={shared.actions}>
                        {mounted && isSignedIn && (
                            <>
                                {hasUnsyncedChanges && (
                                    <span className={classes.badge}>
                                        {t('sync.unsyncedChanges')}
                                    </span>
                                )}
                                <Tooltip label={t('sync.pull')} withArrow>
                                    <Action
                                        aria-label={t('sync.pull')}
                                        onClick={() => setPullModalOpened(true)}
                                        disabled={isPulling}
                                        size={40}
                                    >
                                        <IconCloudDownload size={18} />
                                    </Action>
                                </Tooltip>
                                <Tooltip label={t('sync.sync')} withArrow>
                                    <Action
                                        aria-label={t('sync.sync')}
                                        onClick={syncWithConvex}
                                        disabled={isSyncing}
                                        size={40}
                                    >
                                        <IconCloudUpload size={18} />
                                    </Action>
                                </Tooltip>
                            </>
                        )}
                        {tasks?.length >= 2 && (
                            <>
                                <Tooltip label={t('todo.moveDone')} withArrow>
                                    <Action
                                        aria-label={t('todo.moveDone')}
                                        onClick={moveDoneTasksDown}
                                        size={40}
                                    >
                                        <IconSortDescending2 size={18} />
                                    </Action>
                                </Tooltip>
                                <DeleteTasks onDeleteTasks={deleteAllTasks} />
                            </>
                        )}
                    </div>
                </div>

                <TaskProgress
                    progress={progress.progress}
                    percentage={progress.percentage}
                    total={progress.total}
                />

                <form onSubmit={handleSubmit} className={classes.addForm}>
                    <TextInput
                        placeholder={t('todo.addTask')}
                        aria-label={t('todo.taskLabel')}
                        ref={task}
                        required
                        size="md"
                        radius={12}
                        className={classes.addInput}
                        styles={{ input: { height: 48 } }}
                    />
                    <ActionIcon
                        aria-label={t('todo.addButton')}
                        type="submit"
                        size={48}
                        radius={12}
                        vars={() => ({
                            root: {
                                '--ai-bg': 'var(--dp-inverse)',
                                '--ai-hover': 'var(--dp-inverse)',
                                '--ai-color': 'var(--dp-inverse-text)'
                            }
                        })}
                    >
                        <IconPlus size={20} />
                    </ActionIcon>
                </form>

                <ScrollArea mah={{ base: '100%', sm: '25vw' }} type="auto" offsetScrollbars>
                    <Tasks
                        tasks={tasks}
                        onTaskCheck={markTaskAsReady}
                        onTaskDelete={deleteTask}
                        onTaskMove={moveTaskOrder}
                        onTaskEdit={handleEditTaskClick}
                    />
                </ScrollArea>

                {isSignedIn && <p className={classes.disclaimer}>{t('todo.disclaimer')}</p>}
            </section>
            <EditTask
                open={opened}
                onClose={() => setOpened(false)}
                task={editedTask}
                onTaskEdit={editTask}
            />
            <PullTasks
                opened={pullModalOpened}
                onClose={() => setPullModalOpened(false)}
                onConfirm={pullFromConvex}
            />
        </>
    );
};

export default Todo;
