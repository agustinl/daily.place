import { Flex, Modal, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import Button from '../common/Button';

interface ConfirmModalProps {
    opened: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmColor: string;
    onClose: () => void;
    /** Can be async: the modal closes once it has finished. */
    onConfirm: () => void | Promise<void>;
}

/** Modal with a message and Cancel / Confirm buttons. */
const ConfirmModal = ({
    opened,
    title,
    message,
    confirmLabel,
    confirmColor,
    onClose,
    onConfirm
}: ConfirmModalProps) => {
    const t = useTranslations();

    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
            <Text>{message}</Text>

            <Flex justify="space-between" mt="md">
                <Button variant="subtle" color="gray" onClick={onClose}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await onConfirm();
                        onClose();
                    }}
                    color={confirmColor}
                    variant="filled"
                >
                    {confirmLabel}
                </Button>
            </Flex>
        </Modal>
    );
};

export default ConfirmModal;
