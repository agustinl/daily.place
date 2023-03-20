import { useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import {
	Flex,
	Modal,
	Button,
	TextInput,
	Textarea,
	Anchor,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import Social from "../common/Social";

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
        
        splitbee.track("Feedback", {
            email: values?.email,
            message: values?.message
        });

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

                <Flex justify="center" w="100%">
                    <Social />
                </Flex>
			</Modal>
		</>
	);
};

export default Feedback;
