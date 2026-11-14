import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Stack, Modal, NumberInput } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import Button from '../common/Button';
import ModalActions from './ModalActions';
import { PomodoroSetting } from '@/types/pomodoro';

const PomodoroSettings = ({
    open,
    onClose,
    settings,
    onSaveSettings
}: {
    open: boolean;
    onClose: (value: boolean) => void;
    settings: PomodoroSetting;
    onSaveSettings: (value: PomodoroSetting) => void;
}) => {
    const t = useTranslations();

    const form = useForm({
        initialValues: {
            pomodoro: settings?.pomodoro,
            shortBreak: settings?.shortBreak,
            longBreak: settings?.longBreak
        },
        validateInputOnChange: true,
        validate: {
            pomodoro: isNotEmpty(t('pomodoro.pomodoroMinutes')),
            shortBreak: isNotEmpty(t('pomodoro.shortBreakMinutes')),
            longBreak: isNotEmpty(t('pomodoro.longBreakMinutes'))
        }
    });

    useEffect(() => {
        form.setValues(settings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    return (
        <Modal
            opened={open}
            onClose={() => onClose(false)}
            title={t('pomodoro.settingsTitle')}
            aria-label={t('pomodoro.settings')}
        >
            <Stack>
                <NumberInput
                    label={t('pomodoro.pomodoroMinutes')}
                    {...form.getInputProps('pomodoro')}
                    min={1}
                    step={5}
                />

                <NumberInput
                    label={t('pomodoro.shortBreakMinutes')}
                    {...form.getInputProps('shortBreak')}
                    min={1}
                    step={5}
                />

                <NumberInput
                    label={t('pomodoro.longBreakMinutes')}
                    {...form.getInputProps('longBreak')}
                    min={1}
                    step={5}
                />
            </Stack>

            <ModalActions>
                <Button tone="secondary" onClick={() => onClose(false)}>
                    {t('common.cancel')}
                </Button>

                <Button
                    onClick={() => onSaveSettings(form?.values as PomodoroSetting)}
                    disabled={!form.isValid()}
                >
                    {t('common.save')}
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default PomodoroSettings;
