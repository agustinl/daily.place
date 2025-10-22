import { memo } from 'react';
import { Flex, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconRotate2 } from '@tabler/icons-react';

import { formatTime } from '@/helpers/formatTime';
import Action from './Action';

interface PomodoroTimerProps {
    secondsLeft: number;
    isActive: boolean;
    onToggleActive: () => void;
    onRestart: () => void;
}

const PomodoroTimer = ({ secondsLeft, isActive, onToggleActive, onRestart }: PomodoroTimerProps) => {
    return (
        <Flex align="center" justify="space-between" my="lg">
            <Text fz={48} fw={500} ff="monospace" lh={0}>
                {formatTime(secondsLeft || 0)}
            </Text>
            <Flex gap="xs">
                {isActive ? (
                    <Action
                        color="red"
                        variant="light"
                        onClick={onToggleActive}
                        aria-label="Pause pomodoro"
                    >
                        <IconPlayerPause size={18} />
                    </Action>
                ) : (
                    <Action
                        color="green"
                        variant="light"
                        onClick={onToggleActive}
                        aria-label="Play pomodoro"
                    >
                        <IconPlayerPlay size={18} />
                    </Action>
                )}

                <Action aria-label="Restart pomodoro" onClick={onRestart}>
                    <IconRotate2 size={18} />
                </Action>
            </Flex>
        </Flex>
    );
};

export default memo(PomodoroTimer);

