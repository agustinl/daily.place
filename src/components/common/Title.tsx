import { Title as MantineTitle, Flex, Divider, useMantineTheme, TextProps } from "@mantine/core";

const Title = ({ text, children }: { text: string; children?: React.ReactElement }) => {
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
