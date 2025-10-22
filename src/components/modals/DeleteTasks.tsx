import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Flex, Modal, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import Action from '../common/Action';
import Button from '../common/Button';

const DeleteTasks = ({ onDeleteTasks }: { onDeleteTasks: () => void }) => {
    const [opened, setOpened] = useState(false);
    const t = useTranslations();

    return (
        <>
            <Tooltip label={t('todo.deleteAll')} withArrow>
                <Action
                    color="red"
                    variant="light"
                    aria-label={t('todo.deleteAll')}
                    onClick={() => setOpened(true)}
                >
                    <IconTrash size={18} />
                </Action>
            </Tooltip>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={t('todo.deleteAllTitle')}
                centered
            >
                <Text>
                    {t('todo.deleteAllMessage')}
                </Text>

                <Flex justify="space-between" mt="md">
                    <Button variant="subtle" color="gray" onClick={() => setOpened(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            onDeleteTasks();
                            setOpened(false);
                        }}
                        color="red"
                        variant="filled"
                    >
                        {t('common.delete')}
                    </Button>
                </Flex>
            </Modal>
        </>
    );
};

export default DeleteTasks;
