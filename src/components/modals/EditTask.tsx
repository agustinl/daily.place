import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Flex, Modal, TextInput } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import Button from '../common/Button';
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
        <Modal opened={open} onClose={() => onClose(false)} title={t('todo.editTaskTitle')} centered>
            <form onSubmit={form.onSubmit(() => onTaskEdit(form?.values?.taskInput))}>
                <TextInput
                    placeholder={t('todo.taskPlaceholder')}
                    label={t('todo.taskLabel')}
                    mb={20}
                    {...form.getInputProps('taskInput')}
                />

                <Flex justify="space-between" mt={50}>
                    <Button variant="subtle" color="gray" onClick={() => onClose(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="filled" color="green" disabled={!form.isValid()}>
                        {t('common.edit')}
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default EditTask;
