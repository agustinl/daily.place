import { List as MantineList, ThemeIcon, Text } from "@mantine/core";
import {
	IconClockHour1,
	IconHeadphones,
	IconChecklist,
	IconDeviceFloppy,
} from "@tabler/icons";
import How from "./modals/How";

const FeaturesList = () => {
	return (
		<MantineList spacing="xs" size="sm" center mt={20}>
			<MantineList.Item
				icon={
					<ThemeIcon
						color="green"
						size={24}
						radius="xl"
						variant="light"
					>
						<IconHeadphones size={16} />
					</ThemeIcon>
				}
			>
				<Text c="dimmed" component="p" m={0}>
					<b>+5</b> different ambient sounds + lofi + vaporwave
				</Text>
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon
						color="green"
						size={24}
						radius="xl"
						variant="light"
					>
						<IconClockHour1 size={16} />
					</ThemeIcon>
				}
			>
				<Text c="dimmed" component="p" m={0}>
					Set up your perfect <b>pomodoro timer</b>
				</Text>
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon
						color="green"
						size={24}
						radius="xl"
						variant="light"
					>
						<IconChecklist size={16} />
					</ThemeIcon>
				}
			>
				<Text c="dimmed" component="p" m={0}>
					Create, edit and delete an entire <b>to-do list</b>
				</Text>
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon size={24} radius="xl" variant="light">
						<IconDeviceFloppy size={16} />
					</ThemeIcon>
				}
			>
				<Text c="dimmed" component="p" m={0}>
					All saved under your place name: <How />
				</Text>
			</MantineList.Item>
		</MantineList>
	);
};

export default FeaturesList;
