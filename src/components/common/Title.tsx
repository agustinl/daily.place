import { Title as MantineTitle, Flex, Divider } from '@mantine/core';

const Title = ({ text, children }: { text: string; children?: React.ReactElement }) => {
    return (
        <>
            <Flex align="center" gap="xs" justify="space-between">
                <MantineTitle order={4}>{text}</MantineTitle>
                <div>{children}</div>
            </Flex>
            <Divider />
        </>
    );
};

export default Title;
