import Link from "next/link";
import {
	Flex,
	Anchor,
	Badge,
	ActionIcon,
} from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Feedback from "../Feedback";

const Footer = () => {
	return (
		<>
			<Flex justify="space-between" align="center" w="100%" mt={50}>
				<Flex gap={25}>
					<Link href="/" passHref legacyBehavior>
						<Anchor c="dimmed" fz="xs">
							Home
						</Anchor>
					</Link>
					<Link href="/changelog" passHref legacyBehavior>
						<Anchor c="dimmed" fz="xs">
							Changelog
							{/**<Badge ml={5} color="green" size="xs" radius="sm">New</Badge> */}
						</Anchor>
					</Link>
					<Feedback />
				</Flex>
				<Flex gap={3} align="center">
					<ActionIcon
						variant="light"
						aria-label="Github repo"
						component="a"
						href="https://github.com/agustinl/daily.place"
						target="_blank"
                        data-splitbee-event="Click Github"
					>
						<IconBrandGithub size={18} />
					</ActionIcon>
				</Flex>
			</Flex>
		</>
	);
};

export default Footer;
