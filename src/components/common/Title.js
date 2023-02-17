import { Title as MantineTitle, Flex, Divider } from "@mantine/core";

const Title = ({ icon, text, children }) => {
	return (
		<>
			<Flex align="center" gap="xs" justify="space-between">
				{/*icon*/}
				<MantineTitle order={2}>{text}</MantineTitle>
				<div>{children}</div>
			</Flex>
			<Divider />
		</>
	);
};

export default Title;
