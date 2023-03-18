import { Title as MantineTitle, Flex, Divider } from "@mantine/core";

const Title = ({ text, children }) => {
	return (
		<>
			<Flex align="center" gap="xs" justify="space-between">
				<MantineTitle order={3}>{text}</MantineTitle>
				<div>{children}</div>
			</Flex>
			<Divider />
		</>
	);
};

export default Title;
