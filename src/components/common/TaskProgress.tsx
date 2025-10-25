import { memo } from 'react';
import { Stack, Flex, Text, Progress } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface TaskProgressProps {
    progress: number;
    percentage: number;
    total: number;
}

const TaskProgress = ({ progress, percentage, total }: TaskProgressProps) => {
	const t = useTranslations();
    return (
        <Stack gap={5}>
            <Flex justify="space-between" align="center">
                <Text fz={12} c="dimmed">
                    {t('todo.progress')}
                </Text>
                <Text c="dimmed">{percentage}%</Text>
            </Flex>
            <Progress value={percentage} color="green" aria-label="Progress" />
            <Text fz={12} c="dimmed" ta="right">
                {progress}/{total} {t('todo.completed')}
            </Text>
        </Stack>
    );
};

export default memo(TaskProgress);

