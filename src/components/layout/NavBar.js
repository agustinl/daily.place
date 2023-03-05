import Link from "next/link";
import Image from "next/image";
import {
	ActionIcon,
	Flex,
	useMantineColorScheme,
	Tooltip,
	Anchor,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
import { useHotkeys } from "@mantine/hooks";

const NavBar = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	useHotkeys([["mod+J", () => toggleColorScheme()]]);

	return (
		<Flex justify="space-between" align="center" w="100%" mb={25}>
			<Link href="/" passHref legacyBehavior>
				<Anchor inherit variant="text">
					<Image
						alt="Daily place logo"
						src={dark ? "/logo-dark.svg" : "/logo-light.svg"}
						width={40}
						height={40}
					/>
				</Anchor>
			</Link>
			<Flex gap="xs">
				<Tooltip label="Toggle theme">
					<ActionIcon
						variant="light"
						color={dark ? "brand" : "gray"}
						onClick={() => toggleColorScheme()}
						aria-label="Toggle theme"
					>
						{dark ? (
							<IconSun size={18} />
						) : (
							<IconMoonStars size={18} />
						)}
					</ActionIcon>
				</Tooltip>
			</Flex>
		</Flex>
	);
};

export default NavBar;
