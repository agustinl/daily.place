import { useRef, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

import { Stack, Flex, TextInput, ScrollArea, Tooltip, Indicator, Text } from '@mantine/core';
import { IconSortDescending2, IconPlus, IconCloudUpload, IconCloudDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useTasks } from '@/hooks/useTasks';

import Action from './common/Action';
import TaskProgress from './common/TaskProgress';
import Title from './common/Title';
import DeleteTasks from './modals/DeleteTasks';
import EditTask from './modals/EditTask';
import PullTasks from './modals/PullTasks';
import Tasks from './Tasks';

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
            <Stack w="100%">
                <Title text={t('todo.title')}>
                    <Flex align="center" gap={10}>
                        {mounted && isSignedIn && (
                            <>
                                <Tooltip label={t('sync.pull')} withArrow>
                                    <Action
                                        aria-label={t('sync.pull')}
                                        onClick={() => setPullModalOpened(true)}
                                        disabled={isPulling}
                                        color="blue"
                                        variant="light"
                                    >
                                        <IconCloudDownload size={18} />
                                    </Action>
                                </Tooltip>
                                <Tooltip
                                    label={hasUnsyncedChanges ? t('sync.unsyncedChanges') : t('sync.sync')}
                                    withArrow
                                >
                                    <Indicator
                                        color="red"
                                        size={8}
                                        disabled={!hasUnsyncedChanges}
                                        processing={hasUnsyncedChanges}
                                    >
                                        <Action
                                            aria-label={t('sync.sync')}
                                            onClick={syncWithConvex}
                                            disabled={isSyncing}
                                        >
                                            <IconCloudUpload size={18} />
                                        </Action>
                                    </Indicator>
                                </Tooltip>
                            </>
                        )}
                        {tasks?.length >= 2 && (
                            <>
                                <DeleteTasks onDeleteTasks={deleteAllTasks} />
                                <Tooltip label={t('todo.moveDone')} withArrow>
                                    <Action
                                        aria-label={t('todo.moveDone')}
                                        onClick={moveDoneTasksDown}
                                    >
                                        <IconSortDescending2 size={18} />
                                    </Action>
                                </Tooltip>
                            </>
                        )}
                    </Flex>
                </Title>
                <TaskProgress
                    progress={progress.progress}
                    percentage={progress.percentage}
                    total={progress.total}
                />
                <Stack mt={20}>
                    <ScrollArea mah={{ base: '100%', sm: '25vw' }} type="auto" offsetScrollbars>
                        <Tasks
                            tasks={tasks}
                            onTaskCheck={markTaskAsReady}
                            onTaskDelete={deleteTask}
                            onTaskMove={moveTaskOrder}
                            onTaskEdit={handleEditTaskClick}
                        />
                    </ScrollArea>
                </Stack>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        placeholder={t('todo.addTask')}
                        ref={task}
                        variant="unstyled"
                        required
                        rightSection={
                            <Action aria-label={t('todo.addButton')} component="button" type="submit">
                                <IconPlus size={16} />
                            </Action>
                        }
                    />
                </form>
				{isSignedIn && <Text c="dimmed" fz={10}>{t('todo.disclaimer')}</Text>}
            </Stack>
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
