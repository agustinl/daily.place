import { useState } from "react";
import { Table, Modal, Kbd, Text, Badge } from "@mantine/core";
import { KEYBOARD_SHORTCUTS } from "@/constants/KeyboardShortcuts";

const Shortcuts = () => {
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
				Shortcuts
			</Text>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="⌨️ Keyboard Shortcuts"
				centered
			>
				<Table withColumnBorders>
					<thead>
						<tr>
							<th>Shortcuts</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{KEYBOARD_SHORTCUTS?.map((hotkey, index) => (
							<tr key={index}>
								<td>
									<Kbd
										dangerouslySetInnerHTML={{
											__html: hotkey?.keys,
										}}
									/>
								</td>
								<td>{hotkey?.description}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Modal>
		</>
	);
};

export default Shortcuts;
