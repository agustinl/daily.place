import { memo } from 'react';
import { Progress } from '@mantine/core';
import { useTranslations } from 'next-intl';

import classes from '../Todo.module.css';

interface TaskProgressProps {
    progress: number;
    percentage: number;
    total: number;
}

const TaskProgress = ({ progress, percentage, total }: TaskProgressProps) => {
    const t = useTranslations();
    return (
        <div className={classes.progress}>
            <div className={classes.progressHeader}>
                <span>
                    {t('todo.progress')}
                    <span className={classes.percentage}>{percentage}%</span>
                </span>
                <span>
                    {progress}/{total} {t('todo.completed')}
                </span>
            </div>
            <Progress
                value={percentage}
                h={8}
                radius="xl"
                color="var(--dp-accent)"
                bg="var(--dp-surface-muted)"
                aria-label="Progress"
            />
        </div>
    );
};

export default memo(TaskProgress);
