import { useState } from "react";
import { Table, Modal, Kbd, Anchor } from "@mantine/core";
import { KEYBOARD_SHORTCUTS } from "@/constants/KeyboardShortcuts";

const Shortcuts = () => {
	const [opened, setOpened] = useState(false);

	return (
		<>
			<Anchor c="gray.6" onClick={() => setOpened(true)}>
				Shortcuts
			</Anchor>

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
