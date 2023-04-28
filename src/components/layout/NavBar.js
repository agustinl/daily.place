import Link from "next/link";
import Image from "next/image";
import {
	Flex,
	useMantineColorScheme,
	Tooltip,
	Anchor,
} from "@mantine/core";
import Action from "../common/Action";
import { IconSun, IconMoon } from "@tabler/icons";
import { useHotkeys } from "@mantine/hooks";

const NavBar = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	useHotkeys([["mod+J", () => toggleColorScheme()]]);

	return (
		<Flex justify="space-between" align="center" w="100%">
			<Link href="/" passHref legacyBehavior>
				<Anchor inherit variant="text">
					<Image
						alt="Daily place logo"
						src="/logo-dark.svg"
						width={40}
						height={40}
					/>
				</Anchor>
			</Link>
			<Tooltip label="Toggle theme">
				<Action
					onClick={() => toggleColorScheme()}
					aria-label="Toggle theme"
				>
					{dark ? <IconSun size={18} /> : <IconMoon size={18} />}
				</Action>
			</Tooltip>
		</Flex>
	);
};

export default NavBar;
