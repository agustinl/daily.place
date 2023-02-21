import { ThemeIcon, Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons";

const Question = () => {
	const [opened, { close, open }] = useDisclosure(false);

	return (
		<Popover
			width={250}
			position="bottom"
			withArrow
			shadow="md"
			opened={opened}
            ml={10}
		>
			<Popover.Target>
				<ThemeIcon
					size="xs"
					radius="xl"
					variant="outline"
					color="gray"
					onMouseEnter={open}
					onMouseLeave={close}
				>
					<IconQuestionMark size={12} />
				</ThemeIcon>
			</Popover.Target>
			<Popover.Dropdown sx={{ pointerEvents: "none" }} >
				<Text size="sm">
                The information is stored in the local storage of your browser. It will be available as long as it is not deleted or you do not use the app in incognito mode.
				</Text>
			</Popover.Dropdown>
		</Popover>
	);
};

export default Question;
