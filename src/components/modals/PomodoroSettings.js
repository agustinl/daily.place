import { useEffect } from "react";
import { Stack, Flex, Modal, NumberInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import Button from "../common/Button";

const PomodoroSettings = ({ open, onClose, settings, onSaveSettings }) => {
	const form = useForm({
		initialValues: {
			pomodoro: settings?.pomodoro,
			shortBreak: settings?.shortBreak,
			longBreak: settings?.longBreak,
		},
		validateInputOnChange: true,
		validate: {
			pomodoro: value => (value < 1 ? "Number required" : null),
			pomodoro: isNotEmpty("Pomodoro time cannot be empty"),
			shortBreak: value => (value < 1 ? "Number required" : null),
			shortBreak: isNotEmpty("Short break time cannot be empty"),
			longBreak: value => (value < 1 ? "Number required" : null),
			longBreak: isNotEmpty("Long break time cannot be empty"),
		},
	});

	useEffect(() => {
		form.setValues(settings);
	}, [settings]);

	return (
		<Modal
			opened={open}
			onClose={() => onClose(false)}
			title="Pomodoro settings"
			aria-label="Pomodoro settings"
			centered
		>
			<Stack>
				<NumberInput
					label="Pomodoro time"
					description="in minutes"
					{...form.getInputProps("pomodoro")}
					min={1}
					step={5}
				/>

				<NumberInput
					label="Short break time"
					description="in minutes"
					{...form.getInputProps("shortBreak")}
					min={1}
					step={5}
				/>

				<NumberInput
					label="Long break time"
					description="in minutes"
					{...form.getInputProps("longBreak")}
					min={1}
					step={5}
				/>
			</Stack>

			<Flex justify="space-between" mt={50}>
				<Button variant="default" color="black" onClick={() => onClose(false)}>
					Cancel
				</Button>

				<Button
					onClick={() => onSaveSettings(form?.values)}
					disabled={!form.isValid()}
                    color="green"
                    variant="filled"
				>
					Save
				</Button>
			</Flex>
		</Modal>
	);
};

export default PomodoroSettings;
