import { useState } from 'react';

import { Flex, Modal, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import Action from '../common/Action';
import Button from '../common/Button';

const DeleteTasks = ({ onDeleteTasks }: { onDeleteTasks: () => void }) => {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Tooltip label="Delete all tasks" withArrow>
                <Action
                    color="red"
                    variant="light"
                    aria-label="Delete all tasks"
                    onClick={() => setOpened(true)}
                >
                    <IconTrash size={18} />
                </Action>
            </Tooltip>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Delete all tasks"
                centered
            >
                <Text>
                    Are you sure you want to delete all tasks?
                </Text>

                <Flex justify="space-between" mt="md">
                    <Button variant="subtle" color="gray" onClick={() => setOpened(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onDeleteTasks();
                            setOpened(false);
                        }}
                        color="red"
                        variant="filled"
                    >
                        Delete
                    </Button>
                </Flex>
            </Modal>
        </>
    );
};

export default DeleteTasks;
