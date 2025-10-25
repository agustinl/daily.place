import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Table, Modal, Kbd } from '@mantine/core';
import { IconCommand } from '@tabler/icons-react';

import Action from '../common/Action';

const Shortcuts = () => {
    const [opened, setOpened] = useState(false);
    const t = useTranslations();

    const shortcuts = [
        { keys: 'Ctrl/⌘ + P', description: t('shortcuts.playPause') },
        { keys: 'Ctrl/⌘ + Alt + 1', description: t('shortcuts.changePomodoro') },
        { keys: 'Ctrl/⌘ + Alt + 2', description: t('shortcuts.changeShort') },
        { keys: 'Ctrl/⌘ + Alt + 3', description: t('shortcuts.changeLong') }
    ];

    return (
        <>
            <Action aria-label={t('shortcuts.title')} onClick={() => setOpened(true)}>
                <IconCommand size={18} />
            </Action>

            <Modal opened={opened} onClose={() => setOpened(false)} title={t('shortcuts.title')} centered>
                <Table withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('shortcuts.title')}</Table.Th>
                            <th>Action</th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {shortcuts?.map((hotkey, index) => (
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
