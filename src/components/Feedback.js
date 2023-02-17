import { useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import {
	Flex,
	Modal,
	Button,
	Text,
	TextInput,
	Textarea,
	Alert,
} from "@mantine/core";

const Feedback = () => {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({
		show: false,
		text: "",
		color: "green",
	});

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			message: "",
		},
		validate: {
			message: isNotEmpty("Message cannot be empty"),
		},
	});

	const sendFeedback = async values => {
		setLoading(true);

		const res = await fetch("/api/sendgrid", {
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});
		setLoading(false);

		const { error } = await res.json();
		if (error) {
			setError({
				show: true,
				text: "We had trouble sending your feedback. Please try again in a few seconds.",
				color: "red",
			});
			return;
		}

		setError({
			show: true,
			text: "Thank you for taking the time to give us your feedback!",
			color: "green",
		});

		form.reset();
	};

	return (
		<>
			<Text
				style={{
					cursor: "pointer",
				}}
				c="dimmed"
				fz="xs"
				onClick={() => setOpened(true)}
			>
				Feedback
			</Text>

			<Modal
				opened={opened}
				onClose={() => {
					setError({ ...error, show: false });
					setOpened(false);
				}}
				title="Feedback"
				centered
			>
				{error?.show && (
					<Alert color={error?.color} mb={20}>
						{error?.text}
					</Alert>
				)}
				<form onSubmit={form.onSubmit(sendFeedback)}>
					<TextInput
						placeholder="Name"
						label="Name"
						mb={20}
						{...form.getInputProps("name")}
					/>

					<TextInput
						placeholder="Email"
						label="Email"
						mb={20}
						{...form.getInputProps("email")}
					/>

					<Textarea
						placeholder="Message"
						label="Message"
						withAsterisk
						{...form.getInputProps("message")}
					/>

					<Flex justify="flex-end" mt={25}>
						<Button type="submit" loading={loading}>
							Send
						</Button>
					</Flex>
				</form>
			</Modal>
		</>
	);
};

export default Feedback;
