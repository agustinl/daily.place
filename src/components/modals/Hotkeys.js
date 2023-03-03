import { useState } from "react";
import { Table, Modal, Kbd, Text } from "@mantine/core";

const Hotkeys = () => {
	const [opened, setOpened] = useState(false);

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
				Hotkeys
			</Text>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Hotkeys"
				centered
			>
				<Table withColumnBorders>
					<thead>
						<tr>
							<th>Hotkeys</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<Kbd>⌘/ctrl</Kbd> + <Kbd>J</Kbd>
							</td>
							<td>Toggle theme</td>
						</tr>
						<tr>
							<td>
								<Kbd>⌘/ctrl</Kbd> + <Kbd>P</Kbd>
							</td>
							<td>Play/pause pomodoro timer</td>
						</tr>
						<tr>
							<td>
								<Kbd>⌘/ctrl</Kbd> + <Kbd>1</Kbd>
							</td>
							<td>Select pomodoro timer</td>
						</tr>
						<tr>
							<td>
								<Kbd>⌘/ctrl</Kbd> + <Kbd>2</Kbd>
							</td>
							<td>Select short break</td>
						</tr>
						<tr>
							<td>
								<Kbd>⌘/ctrl</Kbd> + <Kbd>3</Kbd>
							</td>
							<td>Select long break</td>
						</tr>
					</tbody>
				</Table>
			</Modal>
		</>
	);
};

export default Hotkeys;
