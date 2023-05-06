import { Title as MantineTitle, Flex, Divider, useMantineTheme } from "@mantine/core";

const Title = ({ text, children }) => {    
	const theme = useMantineTheme();
	return (
		<>
			<Flex align="center" gap="xs" justify="space-between">
				<MantineTitle order={4}>{text}</MantineTitle>
				<div>{children}</div>
			</Flex>
			<Divider color={theme.colorScheme === "dark" ? "dark.5" : "gray.2"} />
		</>
	);
};

export default Title;
