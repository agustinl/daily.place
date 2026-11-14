import { Modal, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { POMODORO_SETTINGS } from '@/constants/PomodoroConstants';
import { placeNameValidator } from '@/helpers/placeName';
import { usePlaceNames } from '@/hooks/usePlaceNames';
import { useAnalytics } from '@/hooks/useAnalytics';

import Button from '../common/Button';
import ModalActions from './ModalActions';

interface ForkPlaceProps {
    name: string;
    open: boolean;
    onClose: (value: boolean) => void;
}

const ForkPlace = ({ name, open, onClose }: ForkPlaceProps) => {
    const router = useRouter();
    const { placeExists, forkPlaceConfiguration } = usePlaceNames();
    const { trackEvent } = useAnalytics();
    const t = useTranslations();

    const form = useForm({
        initialValues: {
            placeName: ''
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: {
            placeName: placeNameValidator(t)
        }
    });

    const setDailyPlaceStorageName = () => {
        const placeName = form.values.placeName.trim();

        if (placeExists(placeName)) {
            form.setFieldError('placeName', t('places.placeExists', { name: placeName }));
            return;
        }

        trackEvent({
            action: 'place_forked',
            category: 'place',
            label: `Forked from ${name} to ${placeName}`
        });

        forkPlaceConfiguration(name, placeName, [], 'todo');
        forkPlaceConfiguration(name, placeName, POMODORO_SETTINGS, 'pomodoro');

        onClose(false);
        form.reset();
        router?.push({
            pathname: `/${placeName}`
        });
    };

    return (
        <Modal opened={open} onClose={() => onClose(false)} title={t('places.forkTitle', { name })}>
            <form onSubmit={form.onSubmit(() => setDailyPlaceStorageName())}>
                <TextInput
                    label={t('places.newPlaceName')}
                    data-autofocus
                    {...form.getInputProps('placeName')}
                />

                <Text c="var(--dp-text-muted)" fz={13} mt={12}>
                    {t('places.copyWarning', { name })}
                </Text>

                <ModalActions>
                    <Button tone="secondary" onClick={() => onClose(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={!form.isValid()}>
                        {t('common.create')}
                    </Button>
                </ModalActions>
            </form>
        </Modal>
    );
};

export default ForkPlace;
