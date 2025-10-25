import { useRef } from 'react';
import { useTranslations } from 'next-intl';

import { Stack, Flex, TextInput, ScrollArea, Tooltip } from '@mantine/core';
import { IconSortDescending2, IconPlus } from '@tabler/icons-react';

import { useTasks } from '@/hooks/useTasks';

import Action from './common/Action';
import Title from './common/Title';
import TaskProgress from './common/TaskProgress';
import DeleteTasks from './modals/DeleteTasks';
import EditTask from './modals/EditTask';
import Tasks from './Tasks';

interface TodoProps {
    name: string;
}

const Todo = ({ name }: TodoProps) => {
    const t = useTranslations();
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
        deleteAllTasks
    } = useTasks(name);

    const task = useRef<HTMLInputElement>(null);

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
            </Stack>
            <EditTask
                open={opened}
                onClose={() => setOpened(false)}
                task={editedTask}
                onTaskEdit={editTask}
            />
        </>
    );
};

export default Todo;
