import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@mantine/core';
import { IconSettings, IconTrash } from '@tabler/icons-react';

import { MODE_CONFIG, POMODORO_MODES, getModeMinutes } from '@/constants/PomodoroConstants';
import { usePomodoro } from '@/hooks/usePomodoro';
import { PomodoroSetting, PomodoroModeValue } from '@/types/pomodoro';

import Action from './common/Action';
import PomodoroTimer from './common/PomodoroTimer';
import PomodoroSettings from './modals/PomodoroSettings';
import Shortcuts from './modals/Shortcuts';
import shared from './PlaceCard.module.css';
import classes from './Pomodoro.module.css';

// Pomodoros before a long break, shown as dots next to the completed count
const CYCLE_LENGTH = 4;

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

    const handleSaveSettings = useCallback(
        (newValues: PomodoroSetting) => {
            savePomodoroConfiguration(newValues);
            setOpened(false);
        },
        [savePomodoroConfiguration]
    );

    const handleToggleActive = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive, setIsActive]);

    const totalSeconds = (getModeMinutes(mode, storage) || 0) * 60;
    const notStarted = !totalSeconds || secondsLeft >= totalSeconds;
    const progress = notStarted ? 0 : Math.min(100, (1 - secondsLeft / totalSeconds) * 100);

    const getStatus = () => {
        if (isActive) {
            return mode === 'pomodoro' ? t('pomodoro.statusFocused') : t('pomodoro.statusBreak');
        }
        return notStarted ? t('pomodoro.statusReady') : t('pomodoro.statusPaused');
    };

    const getToggleLabel = () => {
        if (isActive) return t('pomodoro.pauseShort');
        return notStarted ? t('pomodoro.start') : t('pomodoro.resume');
    };

    const completed = storage?.pomodoroToday ?? 0;
    const filledDots = completed === 0 ? 0 : ((completed - 1) % CYCLE_LENGTH) + 1;

    return (
        <>
            <section
                aria-labelledby="pomodoro-title"
                className={`${shared.card} ${shared.half} ${classes.card}`}
            >
                <div className={shared.header}>
                    <h2 id="pomodoro-title" className={shared.title}>
                        {t('pomodoro.title')}
                    </h2>
                    <div className={shared.actions}>
                        <Shortcuts />
                        <Action
                            aria-label={t('pomodoro.settings')}
                            onClick={() => setOpened(true)}
                            size={40}
                        >
                            <IconSettings size={18} />
                        </Action>
                    </div>
                </div>

                <SegmentedControl
                    fullWidth
                    w="100%"
                    classNames={{ label: classes.modeLabel }}
                    size="md"
                    radius={12}
                    bg="var(--dp-surface-muted)"
                    value={mode}
                    data={POMODORO_MODES.map(({ value }) => ({
                        value,
                        label: t(MODE_CONFIG[value].labelKey)
                    }))}
                    onChange={(value) => setMode(value as PomodoroModeValue)}
                />

                <PomodoroTimer
                    secondsLeft={secondsLeft}
                    isActive={isActive}
                    progress={progress}
                    status={getStatus()}
                    toggleLabel={getToggleLabel()}
                    onToggleActive={handleToggleActive}
                    onRestart={restartPomodoro}
                />

                <div className={classes.footer}>
                    <span>
                        <b className={classes.count} data-empty={completed === 0 || undefined}>
                            {completed}
                        </b>{' '}
                        {t('pomodoro.completedToday')}
                    </span>
                    <div className={classes.footerEnd}>
                        {completed > 0 && (
                            <Action
                                aria-label={t('pomodoro.restartCount')}
                                onClick={restartPomodorosToday}
                            >
                                <IconTrash size={16} />
                            </Action>
                        )}
                        <span className={classes.dots} aria-hidden="true">
                            {Array.from({ length: CYCLE_LENGTH }, (_, index) => (
                                <span key={index} data-filled={index < filledDots || undefined} />
                            ))}
                        </span>
                    </div>
                </div>
            </section>

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
