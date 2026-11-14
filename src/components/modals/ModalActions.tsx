import { Group } from '@mantine/core';

/** Footer of a modal: actions aligned to the end, the main one last. */
const ModalActions = ({ children }: { children: React.ReactNode }) => (
    <Group justify="flex-end" gap="sm" mt={28}>
        {children}
    </Group>
);

export default ModalActions;
