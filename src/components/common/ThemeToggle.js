import { useMantineColorScheme} from "@mantine/core";
import Action from "../common/Action";
import { IconSun, IconMoon } from "@tabler/icons";
import { useHotkeys } from "@mantine/hooks";

const ThemeToggle = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	useHotkeys([["mod+J", () => toggleColorScheme()]]);

	return (
		<Action onClick={() => toggleColorScheme()} aria-label="Toggle theme">
			{dark ? <IconSun size={18} /> : <IconMoon size={18} />}
		</Action>
	);
};

export default ThemeToggle;
