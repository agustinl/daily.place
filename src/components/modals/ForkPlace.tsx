import { Flex, Modal, TextInput, Text } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { POMODORO_SETTINGS } from '@/constants/PomodoroConstants';
import { usePlaceNames } from '@/hooks/usePlaceNames';
import { useAnalytics } from '@/hooks/useAnalytics';

import Button from '../common/Button';

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
            placeName: isNotEmpty(t('places.newPlaceName'))
        }
    });

    const setDailyPlaceStorageName = () => {
        const exist = placeExists(form?.values?.placeName);

        if (exist) {
            form.setFieldError('placeName', t('places.placeExists', { name: form?.values?.placeName }));
            return;
        }

        trackEvent({
            action: 'place_forked',
            category: 'place',
            label: `Forked from ${name} to ${form?.values?.placeName}`
        });

        forkPlaceConfiguration(name, form?.values?.placeName, [], 'todo');
        forkPlaceConfiguration(name, form?.values?.placeName, POMODORO_SETTINGS, 'pomodoro');

        onClose(false);
        form.reset();
        router?.push({
            pathname: `/${form?.values?.placeName}`
        });
    };

    return (
        <Modal
            opened={open}
            onClose={() => onClose(false)}
            title={t('places.forkTitle', { name })}
            centered
        >
            <form onSubmit={form.onSubmit(() => setDailyPlaceStorageName())}>
                <TextInput label={t('places.newPlaceName')} mb={20} {...form.getInputProps('placeName')} />

                <Text c="dimmed" fz={12}>
                    {t('places.copyWarning', { name })}
                </Text>

                <Flex justify="space-between" mt="lg">
                    <Button variant="subtle" color="gray" onClick={() => onClose(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        disabled={!form.isValid()}
                    >
                        {t('common.create')}
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default ForkPlace;
