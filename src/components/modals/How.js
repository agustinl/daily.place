import { useState } from "react";
import { Modal, Text, Anchor } from "@mantine/core";

const How = () => {
	const [opened, setOpened] = useState(false);

	return (
		<>
			<Anchor
				component="button"
				type="button"
				onClick={() => setOpened(true)}
			>
				How?
			</Anchor>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="💾 How we store your daily place?"
				centered
			>
				<Text component="p" fz={14}>
					Everything is saved and available in your browser under a
					name of your choosing.
				</Text>
				<Text component="p" fz={14}>
					The information is stored in the local storage of your
					browser. It will be available as long as it is not deleted
					or you do not use the app in incognito mode.
				</Text>
				<Text component="p" fz={14} c="dimmed">
					Storage and availability on different devices soon.
				</Text>
			</Modal>
		</>
	);
};

export default How;
