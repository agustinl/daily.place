import { useState } from "react";
import { Table, Modal, Kbd, Text, Badge } from "@mantine/core";
import { HOT_KEYS } from "@/constants/Hotkeys";

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
				<Badge ml={5} color="green" size="xs" radius="sm">New</Badge>
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
                        {
                            HOT_KEYS?.map((hotkey, index) => (
                                <tr key={index}>
                                    <td>
                                        <Kbd dangerouslySetInnerHTML={{
											__html: hotkey?.keys,
									    }} />
                                    </td>
                                    <td>{hotkey?.description}</td>
                                </tr>
                            ))
                        }
					</tbody>
				</Table>
			</Modal>
		</>
	);
};

export default Hotkeys;
