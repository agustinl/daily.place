import { useState } from 'react';

import { Table, Modal, Kbd } from '@mantine/core';
import { IconCommand } from '@tabler/icons-react';

import { KEYBOARD_SHORTCUTS } from '@/constants/KeyboardShortcuts';

import Action from '../common/Action';

const Shortcuts = () => {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Action aria-label="Pomodoro shortcuts" onClick={() => setOpened(true)}>
                <IconCommand size={18} />
            </Action>

            <Modal opened={opened} onClose={() => setOpened(false)} title="Shortcuts" centered>
                <Table withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Shortcuts</Table.Th>
                            <th>Action</th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {KEYBOARD_SHORTCUTS?.map((hotkey, index) => (
                            <Table.Tr key={index}>
                                <Table.Td>
                                    <Kbd>{hotkey?.keys}</Kbd>
                                </Table.Td>
                                <Table.Td>{hotkey?.description}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Modal>
        </>
    );
};

export default Shortcuts;
