import { Modal, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

import Button from '../common/Button';
import ModalActions from './ModalActions';

interface ConfirmModalProps {
    opened: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    /** Use danger for actions that delete data. */
    confirmTone?: 'primary' | 'danger';
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
    confirmTone = 'primary',
    onClose,
    onConfirm
}: ConfirmModalProps) => {
    const t = useTranslations();

    return (
        <Modal opened={opened} onClose={onClose} title={title}>
            <Text fz={15} c="var(--dp-text-secondary)">
                {message}
            </Text>

            <ModalActions>
                <Button tone="secondary" onClick={onClose}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={async () => {
                        await onConfirm();
                        onClose();
                    }}
                    tone={confirmTone}
                >
                    {confirmLabel}
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default ConfirmModal;
