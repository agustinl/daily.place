import Link from "next/link";
import { Flex, Anchor, Indicator, Text } from "@mantine/core";
import Shortcuts from "../modals/Shortcuts";

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
				<Link href="/changelog" passHref legacyBehavior>
                    <Anchor c="gray.6">Changelog</Anchor>
                </Link>

				<Link href="/contact" passHref legacyBehavior>
					<Anchor c="gray.6">Contact</Anchor>
				</Link>

				<Shortcuts />

				<Text>
					built by{" "}
					<Anchor
						c="gray.6"
						href="https://twitter.com/agustinlautaro"
						target="_blank"
					>
						Agustín
					</Anchor>
				</Text>
			</Flex>
		</footer>
	);
};

export default Footer;
