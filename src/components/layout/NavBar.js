import Link from "next/link";
import Image from "next/image";
import {
	ActionIcon,
	Flex,
	useMantineColorScheme,
	Tooltip,
	Anchor,
	Title,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons";
import { useHotkeys } from "@mantine/hooks";

const NavBar = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	useHotkeys([["mod+J", () => toggleColorScheme()]]);

	return (
		<Flex justify="space-between" align="center" w="100%" mb={25}>
			<Link href="/" passHref legacyBehavior>
				<Anchor inherit variant="text">
					<Flex align="center" gap={10}>
						<Image
							alt="Daily place logo"
							src={dark ? "/logo-dark.svg" : "/logo-light.svg"}
							width={40}
							height={40}
						/>
						<Title
							order={1}
							variant="gradient"
							gradient={
								dark
									? {
											from: "#3e3e3e",
											to: "#545454",
											deg: 90,
									  }
									: {
											from: "#f56d3b",
											to: "#e74863",
											deg: 90,
									  }
							}
							fw={600}
							fz={18}
						>
							daily.place
						</Title>
					</Flex>
				</Anchor>
			</Link>
			<Tooltip label="Toggle theme">
				<ActionIcon
					color={dark ? "gray" : "brand"}
					onClick={() => toggleColorScheme()}
					aria-label="Toggle theme"
					variant="transparent"
				>
					{dark ? <IconSun size={18} /> : <IconMoon size={18} />}
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
};

export default NavBar;
