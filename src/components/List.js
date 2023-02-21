import { List as MantineList, ThemeIcon, Anchor } from "@mantine/core";
import Link from "next/link";
import {
	IconClockHour1,
	IconHeadphones,
	IconChecklist,
	IconDeviceFloppy,
} from "@tabler/icons";

const List = () => {
	return (
		<MantineList spacing="xs" size="sm" center>
			<MantineList.Item
				icon={
					<ThemeIcon color="green" size={24} radius="xl">
						<IconHeadphones size={16} />
					</ThemeIcon>
				}
			>
				Playlist of different ambient sounds.
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon color="green" size={24} radius="xl">
						<IconClockHour1 size={16} />
					</ThemeIcon>
				}
			>
				Pomodoro timer.
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon color="green" size={24} radius="xl">
						<IconChecklist size={16} />
					</ThemeIcon>
				}
			>
				To-do list.
			</MantineList.Item>
			<MantineList.Item
				icon={
					<ThemeIcon color="blue" size={24} radius="xl">
						<IconDeviceFloppy size={16} />
					</ThemeIcon>
				}
			>
				All saved under your place name.{" "}
				<Link href="/fox mulder" passHref legacyBehavior>
					<Anchor>View demo</Anchor>
				</Link>
			</MantineList.Item>
		</MantineList>
	);
};

export default List;
