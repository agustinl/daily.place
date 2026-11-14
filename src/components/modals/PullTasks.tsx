import { useTranslations } from 'next-intl';

import ConfirmModal from './ConfirmModal';

interface PullTasksProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
}

const PullTasks = ({ opened, onClose, onConfirm }: PullTasksProps) => {
    const t = useTranslations();

    return (
        <ConfirmModal
            opened={opened}
            title={t('sync.pullConfirmTitle')}
            message={t('sync.pullConfirmMessage')}
            confirmLabel={t('sync.pullConfirmButton')}
            confirmColor="blue"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

export default PullTasks;
