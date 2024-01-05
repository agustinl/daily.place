import Link from "next/link";
import { Flex, Anchor, Text } from "@mantine/core";

const Footer = () => {
	return (
		<footer>
			<Flex fz={12} justify="center" w="100%" align="center" gap={20} mt={50} wrap="wrap">
				<Link
					href="/changelog"
					passHref
					legacyBehavior
					data-splitbee-event="Changelog click"
				>
					<Anchor c="gray.6">Changelog</Anchor>
				</Link>

				<Link href="/contact" passHref legacyBehavior data-splitbee-event="Contact click">
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
		</footer>
	);
};

export default Footer;
