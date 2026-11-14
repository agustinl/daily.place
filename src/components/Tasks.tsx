import { memo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TypographyStylesProvider } from '@mantine/core';
import { IconGripVertical, IconTrash, IconCheck, IconPencil } from '@tabler/icons-react';
import Linkify from 'linkify-react';
import { useTranslations } from 'next-intl';

import { TaskType } from '@/types/task';
import Action from './common/Action';
import classes from './Todo.module.css';

interface TasksProps {
    tasks: TaskType[];
    onTaskCheck: (index: number, ready: boolean) => void;
    onTaskDelete: (index: number) => void;
    onTaskMove: (sourceIndex: number, destinationIndex: number) => void;
    onTaskEdit: (index: number, text: string) => void;
}

const options = { defaultProtocol: 'https', target: '_blank', rel: 'noopener noreferrer' } as const;

const Tasks = ({ tasks, onTaskCheck, onTaskDelete, onTaskMove, onTaskEdit }: TasksProps) => {
    const t = useTranslations();
    // Stored tasks have no id (the localStorage format is fixed), so each task object gets an
    // in-memory id. Task updates keep untouched objects, so ids survive reorders and deletes.
    const taskIds = useRef(new WeakMap<TaskType, string>());
    const nextId = useRef(0);

    const getTaskId = (task: TaskType) => {
        let id = taskIds.current.get(task);
        if (!id) {
            id = `task-${nextId.current++}`;
            taskIds.current.set(task, id);
        }
        return id;
    };

    if (!tasks?.length) return null;

    return (
        <DragDropContext
            onDragEnd={({ destination, source }) => {
                if (!destination) return;
                onTaskMove(source.index, destination.index);
            }}
        >
            <Droppable droppableId="droppable-1" type="TASKS">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={classes.list}
                    >
                        {tasks?.map((task: TaskType, index: number) => (
                            <Draggable
                                draggableId={getTaskId(task)}
                                index={index}
                                key={getTaskId(task)}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={classes.task}
                                    >
                                        <button
                                            type="button"
                                            aria-label={
                                                task?.ready
                                                    ? t('todo.markUnready')
                                                    : t('todo.markReady')
                                            }
                                            onClick={() => onTaskCheck(index, !task?.ready)}
                                            className={classes.check}
                                            data-checked={task?.ready || undefined}
                                        >
                                            {task?.ready && <IconCheck size={14} stroke={3} />}
                                        </button>

                                        <TypographyStylesProvider
                                            className={classes.text}
                                            data-done={task?.ready || undefined}
                                        >
                                            {/* Rendered as React text nodes: task text is never parsed as HTML */}
                                            <div>
                                                <Linkify options={options}>{task?.text}</Linkify>
                                            </div>
                                        </TypographyStylesProvider>

                                        <div className={classes.taskActions}>
                                            <Action
                                                aria-label={t('todo.editTask')}
                                                onClick={() => onTaskEdit(index, task?.text)}
                                            >
                                                <IconPencil size={16} />
                                            </Action>
                                            <Action
                                                aria-label={t('todo.deleteTask')}
                                                onClick={() => onTaskDelete(index)}
                                            >
                                                <IconTrash size={16} />
                                            </Action>
                                        </div>

                                        <div
                                            className={classes.handle}
                                            {...provided.dragHandleProps}
                                        >
                                            <IconGripVertical size={16} />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default memo(Tasks);
