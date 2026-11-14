import { memo } from 'react';
import { Button } from '@mantine/core';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconRotate } from '@tabler/icons-react';

import { formatTime } from '@/helpers/formatTime';
import classes from '../Pomodoro.module.css';
import Action from './Action';

interface PomodoroTimerProps {
    secondsLeft: number;
    isActive: boolean;
    /** Elapsed share of the current mode, from 0 to 100. */
    progress: number;
    /** Visible state of the timer, e.g. "Paused". */
    status: string;
    /** Visible text of the play / pause button. */
    toggleLabel: string;
    onToggleActive: () => void;
    onRestart: () => void;
}

const PomodoroTimer = ({
    secondsLeft,
    isActive,
    progress,
    status,
    toggleLabel,
    onToggleActive,
    onRestart
}: PomodoroTimerProps) => {
    return (
        <>
            <div className={classes.ring} style={{ '--progress': progress } as React.CSSProperties}>
                <div className={classes.ringInner}>
                    <span className={classes.time} role="timer">
                        {formatTime(secondsLeft || 0)}
                    </span>
                    <span className={classes.status}>{status}</span>
                </div>
            </div>

            <div className={classes.controls}>
                <Action
                    aria-label="Restart pomodoro"
                    onClick={onRestart}
                    variant="default"
                    size={52}
                    radius="xl"
                >
                    <IconRotate size={20} />
                </Action>
                <Button
                    aria-label={isActive ? 'Pause pomodoro' : 'Play pomodoro'}
                    onClick={onToggleActive}
                    h={60}
                    miw={168}
                    px={28}
                    fz={17}
                    fw={600}
                    radius="xl"
                    leftSection={
                        isActive ? (
                            <IconPlayerPauseFilled size={18} />
                        ) : (
                            <IconPlayerPlayFilled size={18} />
                        )
                    }
                    vars={() => ({
                        root: {
                            '--button-bg': 'var(--dp-accent)',
                            '--button-hover': 'var(--dp-accent-hover)',
                            '--button-color': 'var(--dp-accent-contrast)'
                        }
                    })}
                >
                    {toggleLabel}
                </Button>
                <span className={classes.spacer} />
            </div>
        </>
    );
};

export default memo(PomodoroTimer);
