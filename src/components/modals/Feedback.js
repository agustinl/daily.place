import { useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import {
	Flex,
	Modal,
	Button,
	Text,
	TextInput,
	Textarea,
	Anchor,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const Feedback = () => {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

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
			showNotification({
				title: "Feedback error",
				message:
					"We had trouble sending your feedback. Please try again in a few seconds.",
				color: "red",
				autoClose: 6000,
			});
			return;
		}

		showNotification({
			title: "Feedback sent",
			message: "Thank you for taking the time to give us your feedback!",
			color: "green",
			autoClose: 6000,
		});
		setOpened(false);
		form.reset();
	};

	return (
		<>
			<Anchor c="gray.6" component="text" onClick={() => setOpened(true)}>
				Feedback
			</Anchor>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Feedback"
				centered
			>
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

				<Text fz={14} mt={25}>
					Follow <b>daily.place</b> on twitter:{" "}
					<Anchor
						href="https://twitter.com/1dailyplace"
						target="_blank"
						rel="noopener noreferrer"
						data-splitbee-event="Click DP Twitter"
					>
						@1dailyplace
					</Anchor>
				</Text>

				<Text fz={14} mt={5}>
					Follow me on twitter:{" "}
					<Anchor
						href="https://twitter.com/agustinlautaro"
						target="_blank"
						rel="noopener noreferrer"
						data-splitbee-event="Click AE Twitter"
					>
						@agustinlautaro
					</Anchor>
				</Text>
			</Modal>
		</>
	);
};

export default Feedback;
