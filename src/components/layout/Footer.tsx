import { Flex, Anchor, Text, Divider } from "@mantine/core";
import Link from "next/link";

const Footer = () => {
	return (
		<footer>
			<Flex
				fz={12}
				justify="center"
				w="100%"
				align="center"
				gap={20}
				mt={50}
				wrap="wrap"
			>
				<Link
					href="/changelog"
					passHref
					legacyBehavior
					data-splitbee-event="Changelog click"
				>
					<Anchor c="gray.6">Changelog</Anchor>
				</Link>

				<Link
					href="/contact"
					passHref
					legacyBehavior
					data-splitbee-event="Contact click"
				>
					<Anchor c="gray.6">Contact</Anchor>
				</Link>

				<Text>
					built in Argentina by{" "}
					<Anchor
						c="gray.6"
						href="https://twitter.com/agustinlautaro"
						target="_blank"
						data-splitbee-event="Author click"
					>
						Agustín
					</Anchor>
				</Text>
			</Flex>
			<Divider my="sm" />
			<Text
				fz={11}
				fw={400}
				c="gray.5"
			>
				The audio content featured on this website is sourced from YouTube videos. We do not claim ownership of
				any of the videos or audio tracks used. All copyrights and rights to the content remain with their
				respective owners. The inclusion of these audio files is for informational or educational purposes only
				and does not imply endorsement or affiliation with the original creators. If you are the owner of any
				content and have concerns regarding its use, please{" "}
				<Link
					href="/contact"
					passHref
					legacyBehavior
					data-splitbee-event="Contact disclaimer click"
				>
					<Anchor c="gray.6">contact us</Anchor>
				</Link>{" "}
				directly, and we will address any issues promptly.{" "}
				<Anchor
					c="gray.6"
					href="https://github.com/agustinl/daily.place/blob/main/README.md"
					target="_blank"
				>
					Original YouTube videos.
				</Anchor>
			</Text>
		</footer>
	);
};

export default Footer;
