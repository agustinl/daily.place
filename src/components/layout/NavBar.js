import {
	ActionIcon,
	Flex,
	useMantineColorScheme,
	Tooltip,
	Title,
	Anchor,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { IconBrandTwitter, IconSun, IconMoonStars } from "@tabler/icons";

const NavBar = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	return (
		<Flex justify="space-between" align="center" w="100%" mb={25}>
			<Title order={1} fz={20} fw={600}>
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
			</Title>
			<Flex gap="xs">
				<Tooltip label="Share on twitter">
					<ActionIcon
						color="blue"
						variant="light"
						aria-label="Share on twitter"
						className="twitter-share-button"
						component="a"
						href="https://twitter.com/intent/tweet?text=daily.place&url=https://www.daily.place&hashtags=lofi,pomodoro,todo"
						target="_blank"
					>
						<IconBrandTwitter size={18} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label="Change theme">
					<ActionIcon
						variant="light"
						color={dark ? "" : "gray"}
						onClick={() => toggleColorScheme()}
						aria-label="Toggle color scheme"
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
