import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, isNotEmpty } from "@mantine/form";
import { Flex, Modal, TextInput, Text, Tooltip } from "@mantine/core";
import { IconGitFork } from "@tabler/icons";
import Action from "../common/Action";
import Button from "../common/Button";

import { dailyPlaceExist, forkDailyPlaceConfiguration } from "@/helpers/dailyPlaceFunctions";

import { POMODORO_SETTINGS } from "@/constants/PomodoroConstants";

const ForkPlace = ({ name }) => {
	const [opened, setOpened] = useState(false);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			placeName: "",
		},
		validateInputOnChange: true,
		validateInputOnBlur: true,
		validate: {
			placeName: isNotEmpty("Place name cannot be empty"),
		},
	});    

    const setDailyPlaceStorageName = () => {
        const exist = dailyPlaceExist(form?.values?.placeName);

        if (exist) {
            form.setFieldError('placeName', `Place ${form?.values?.placeName} already exist`);
            return;
        };
        
        forkDailyPlaceConfiguration(name, form?.values?.placeName, [], "todo");
        forkDailyPlaceConfiguration(name, form?.values?.placeName, POMODORO_SETTINGS, "pomodoro");

        setOpened(false);
        form.reset();
        router?.push({
            pathname: `/${form?.values?.placeName}`
        });
    };

	return (<>
        <Tooltip label="Create copy from this place">
            <Action
                aria-label="Create copy from this place"
                onClick={() => setOpened(true)}
            >
                <IconGitFork size={18} />
            </Action>
        </Tooltip>

		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title={`Create copy from ${name}`}
			centered
		>
			<form
				onSubmit={form.onSubmit(() => setDailyPlaceStorageName())}
			>
				<TextInput
					label="New place name"
					mb={20}
					{...form.getInputProps("placeName")}
				/>

                <Text c="dimmed" fz={12}>The current place ({name}) <b>will not be deleted</b>. The deletion must be done manually.</Text>

				<Flex justify="space-between" mt={50}>
					<Button variant="default" onClick={() => setOpened(false)}>
						Cancel
					</Button>
					<Button type="submit" variant="filled" color="green" disabled={!form.isValid()}>
						Create
					</Button>
				</Flex>
			</form>
		</Modal>
    </>);
};

export default ForkPlace;
