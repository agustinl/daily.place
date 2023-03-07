import Link from "next/link";
import { Flex, Anchor, Badge, ActionIcon } from "@mantine/core";
import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons";
import Feedback from "../modals/Feedback";
import Shortcuts from "../modals/Shortcuts";

const Footer = () => {
	return (
		<>
			<Flex
                justify="space-between"
                align="center"
                w="100%"
                mt={50}
                sx={_ => ({
					"@media (max-width: 500px)": {
						flexDirection: "column",
                        gap: 10
					},
				})}
            >
				<Flex gap={25}>
					<Link href="/" passHref legacyBehavior>
						<Anchor c="dimmed" fz="xs">
							Home
						</Anchor>
					</Link>
					<Link href="/changelog" passHref legacyBehavior>
						<Anchor c="dimmed" fz="xs">
							Changelog
							<Badge ml={5} color="green" size="xs" radius="sm">
								v3.0.0
							</Badge>
						</Anchor>
					</Link>
					<Feedback />
					<Shortcuts />
				</Flex>
				<Flex gap="xs" align="center">
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
