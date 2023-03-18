import { Flex, ActionIcon } from "@mantine/core";
import {
	IconBrandTwitter,
	IconBrandGithub,
	IconBrandProducthunt,
} from "@tabler/icons";

const Social = () => {
	return (
		<Flex align="center" gap={10}>
			<ActionIcon
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://twitter.com/1dailyplace"
				color="blue"
				variant="subtle"
				data-splitbee-event="Follow daily.place"
			>
				<IconBrandTwitter size={18} />
			</ActionIcon>

			<ActionIcon
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://github.com/agustinl/daily.place"
				variant="subtle"
				data-splitbee-event="Click Github Social"
			>
				<IconBrandGithub size={18} />
			</ActionIcon>

			<ActionIcon
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.producthunt.com/products/daily-place"
				variant="subtle"
				color="brand"
				data-splitbee-event="Product Hunt"
			>
				<IconBrandProducthunt size={18} />
			</ActionIcon>
		</Flex>
	);
};

export default Social;
