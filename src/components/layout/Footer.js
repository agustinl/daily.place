import Link from "next/link";
import { Flex, Anchor, Text, Tooltip, Divider, Badge } from "@mantine/core";
import { IconBrandNextjs, IconBrandMantine } from "@tabler/icons";
import Feedback from "../Feedback";

const Footer = () => {
	return (
		<>
			<Flex
				justify="space-between"
				align="center"
				w="100%"
				mt={25}
				sx={_ => ({
					"@media (max-width: 500px)": {
						flexDirection: "column",
						gap: 10,
					},
				})}
			>
				<Divider
					w="100%"
					sx={_ => ({
						"@media (min-width: 500px)": {
							display: "none",
						},
					})}
				/>
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
					<Text fz="xs" c="dimmed">
						Built with
					</Text>
					<Tooltip label="Next.js">
						<Anchor href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
							<IconBrandNextjs
								size={20}
								stroke={1.5}
								color="gray"
								alt="Next.js"
							/>
						</Anchor>
					</Tooltip>
					<Text fz="xs" c="dimmed">
						and
					</Text>
					<Tooltip label="Mantine">
						<Anchor href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">
							<IconBrandMantine
								size={20}
								stroke={1.5}
								color="gray"
							/>
						</Anchor>
					</Tooltip>
				</Flex>
			</Flex>
		</>
	);
};

export default Footer;
