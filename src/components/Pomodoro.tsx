import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Stack, Flex, Text, Badge, SegmentedControl } from '@mantine/core';
import { IconSettings, IconTrash } from '@tabler/icons-react';

import { POMODORO_MODES } from '@/constants/PomodoroConstants';
import { usePomodoro } from '@/hooks/usePomodoro';
import { PomodoroSetting, PomodoroModeValue } from '@/types/pomodoro';

import Action from './common/Action';
import Title from './common/Title';
import PomodoroTimer from './common/PomodoroTimer';
import PomodoroSettings from './modals/PomodoroSettings';
import Shortcuts from './modals/Shortcuts';

interface PomodoroProps {
    name: string;
    title: string;
}

const Pomodoro = ({ name, title }: PomodoroProps) => {
    const t = useTranslations();
    const {
        mode,
        setMode,
        secondsLeft,
        isActive,
        setIsActive,
        storage,
        restartPomodoro,
        savePomodoroConfiguration,
        restartPomodorosToday
    } = usePomodoro(name, title);

    const [opened, setOpened] = useState(false);

    const handleSaveSettings = useCallback((newValues: PomodoroSetting) => {
        savePomodoroConfiguration(newValues);
        setOpened(false);
    }, [savePomodoroConfiguration]);

    const handleToggleActive = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive, setIsActive]);

    return (
        <>
            <Stack w="100%">
                <Title text={t('pomodoro.title')}>
                    <Flex align="center" gap={10}>
                        <Shortcuts />
                        <Action aria-label={t('pomodoro.settings')} onClick={() => setOpened(true)}>
                            <IconSettings size={18} />
                        </Action>
                    </Flex>
                </Title>
                <SegmentedControl
                    value={mode}
                    data={POMODORO_MODES}
                    onChange={(value) => setMode(value as PomodoroModeValue)}
                />
                <PomodoroTimer
                    secondsLeft={secondsLeft}
                    isActive={isActive}
                    onToggleActive={handleToggleActive}
                    onRestart={restartPomodoro}
                />
                <Flex align="center" justify="space-between">
                    <Text>
                        <Badge
                            radius="sm"
                            size="sm"
                            mr={5}
                            variant="transparent"
                            color={storage?.pomodoroToday === 0 ? 'gray' : 'green'}
                            component="span"
                        >
                            {storage?.pomodoroToday}
                        </Badge>
                        {t('pomodoro.completedToday')}
                    </Text>
                    {storage?.pomodoroToday > 0 && (
                        <Action
                            aria-label={t('pomodoro.restartCount')}
                            onClick={restartPomodorosToday}
                        >
                            <IconTrash size={18} />
                        </Action>
                    )}
                </Flex>
            </Stack>

            <PomodoroSettings
                open={opened}
                onClose={() => setOpened(false)}
                settings={storage}
                onSaveSettings={handleSaveSettings}
            />
        </>
    );
};

export default Pomodoro;
