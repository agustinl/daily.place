import { useState } from "react";
import { Table, Modal, Kbd } from "@mantine/core";
import { IconCommand } from "@tabler/icons";
import { KEYBOARD_SHORTCUTS } from "@/constants/KeyboardShortcuts";
import Action from "../common/Action";

const Shortcuts = () => {
	const [opened, setOpened] = useState(false);

	return (
		<>
            <Action
                aria-label="Pomodoro shortcuts"
                onClick={() => setOpened(true)}
            >
                <IconCommand size={18} />
            </Action>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Shortcuts"
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
