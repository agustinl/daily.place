import { Flex, Modal, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import Button from '../common/Button';

interface PullTasksProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const PullTasks = ({ opened, onClose, onConfirm }: PullTasksProps) => {
    const t = useTranslations();

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('sync.pullConfirmTitle')}
            centered
        >
            <Text>
                {t('sync.pullConfirmMessage')}
            </Text>

            <Flex justify="space-between" mt="md">
                <Button variant="subtle" color="gray" onClick={onClose}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    color="blue"
                    variant="filled"
                >
                    {t('sync.pullConfirmButton')}
                </Button>
            </Flex>
        </Modal>
    );
};

export default PullTasks;

