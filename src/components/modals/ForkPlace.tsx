import { Flex, Modal, TextInput, Text } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { useRouter } from 'next/router';

import { POMODORO_SETTINGS } from '@/constants/PomodoroConstants';
import { dailyPlaceExist, forkDailyPlaceConfiguration } from '@/helpers/dailyPlaceFunctions';

import Button from '../common/Button';

interface ForkPlaceProps {
    name: string;
    open: boolean;
    onClose: (value: boolean) => void;
}

const ForkPlace = ({ name, open, onClose }: ForkPlaceProps) => {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            placeName: ''
        },
        validateInputOnChange: true,
        validateInputOnBlur: true,
        validate: {
            placeName: isNotEmpty('Place name cannot be empty')
        }
    });

    const setDailyPlaceStorageName = () => {
        const exist = dailyPlaceExist(form?.values?.placeName);

        if (exist) {
            form.setFieldError('placeName', `Place ${form?.values?.placeName} already exist`);
            return;
        }

        forkDailyPlaceConfiguration(name, form?.values?.placeName, [], 'todo');
        forkDailyPlaceConfiguration(name, form?.values?.placeName, POMODORO_SETTINGS, 'pomodoro');

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
            title={`Create copy from ${name}`}
            centered
        >
            <form onSubmit={form.onSubmit(() => setDailyPlaceStorageName())}>
                <TextInput label="New place name" mb={20} {...form.getInputProps('placeName')} />

                <Text c="dimmed" fz={12}>
                    The current place ({name}) <b>will not be deleted</b>. The deletion must be done
                    manually.
                </Text>

                <Flex justify="space-between" mt="lg">
                    <Button variant="subtle" color="gray" onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        disabled={!form.isValid()}
                        plausible-event-name="Fork+place"
                    >
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default ForkPlace;
