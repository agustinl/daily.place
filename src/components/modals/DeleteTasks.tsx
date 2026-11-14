import { useState } from 'react';
import { Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import Action from '../common/Action';
import ConfirmModal from './ConfirmModal';

const DeleteTasks = ({ onDeleteTasks }: { onDeleteTasks: () => void }) => {
    const [opened, setOpened] = useState(false);
    const t = useTranslations();

    return (
        <>
            <Tooltip label={t('todo.deleteAll')} withArrow>
                <Action
                    color="red"
                    size={40}
                    aria-label={t('todo.deleteAll')}
                    onClick={() => setOpened(true)}
                >
                    <IconTrash size={18} />
                </Action>
            </Tooltip>

            <ConfirmModal
                opened={opened}
                title={t('todo.deleteAllTitle')}
                message={t('todo.deleteAllMessage')}
                confirmLabel={t('common.delete')}
                confirmColor="red"
                onClose={() => setOpened(false)}
                onConfirm={onDeleteTasks}
            />
        </>
    );
};

export default DeleteTasks;
