import Link from "next/link";
import { Flex, Anchor, Indicator } from "@mantine/core";
import Feedback from "../modals/Feedback";
import Shortcuts from "../modals/Shortcuts";

const Footer = () => {
	return (
		<Flex
			fz={12}
			justify="center"
			w="100%"
			align="center"
			gap={20}
			mt={50}
			wrap="wrap"
		>
			<Indicator color="green" size={5}>
				<Link href="/changelog" passHref legacyBehavior>
					<Anchor c="gray.6">Changelog</Anchor>
				</Link>
			</Indicator>

			<Feedback />

			<Shortcuts />

			<Anchor
				href="https://twitter.com/intent/tweet?text=Create your perfect space to focus on your daily tasks&url=https://daily.place&hashtags=lofi,pomodoro,todo&via=1dailyplace"
				c="gray.6"
				target="_blank"
				data-splitbee-event="Share on twitter"
			>
				Twitter
			</Anchor>

			<Anchor
				href="https://github.com/agustinl/daily.place"
				c="gray.6"
				target="_blank"
				data-splitbee-event="Click Github"
			>
				Github
			</Anchor>
		</Flex>
	);
};

export default Footer;
