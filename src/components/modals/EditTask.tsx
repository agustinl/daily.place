import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Modal, TextInput } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import Button from '../common/Button';
import ModalActions from './ModalActions';
import { EditedTaskType } from '@/types/task';

const EditTask = ({
    open,
    onClose,
    task,
    onTaskEdit
}: {
    open: boolean;
    onClose: (value: boolean) => void;
    task: EditedTaskType;
    onTaskEdit: (value: string) => void;
}) => {
    const t = useTranslations();

    const form = useForm({
        initialValues: {
            taskInput: task?.text
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: {
            taskInput: isNotEmpty(t('todo.taskEmpty'))
        }
    });

    useEffect(() => {
        form?.setValues({ taskInput: task?.text });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task]);

    return (
        <Modal opened={open} onClose={() => onClose(false)} title={t('todo.editTaskTitle')}>
            <form onSubmit={form.onSubmit(() => onTaskEdit(form?.values?.taskInput))}>
                <TextInput
                    placeholder={t('todo.taskPlaceholder')}
                    label={t('todo.taskLabel')}
                    data-autofocus
                    {...form.getInputProps('taskInput')}
                />

                <ModalActions>
                    <Button tone="secondary" onClick={() => onClose(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={!form.isValid()}>
                        {t('common.save')}
                    </Button>
                </ModalActions>
            </form>
        </Modal>
    );
};

export default EditTask;
