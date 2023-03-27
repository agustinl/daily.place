import { Flex, ActionIcon, Tooltip } from "@mantine/core";
import {
	IconBrandTwitter,
	IconBrandGithub,
	IconBrandProducthunt,
} from "@tabler/icons";

const Social = () => {
	return (
		<Flex align="center" gap={10}>            
			<Tooltip label="Share on twitter">
                <ActionIcon
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://twitter.com/intent/tweet?text=Create your perfect space to focus on your daily tasks&url=https://daily.place&hashtags=lofi,pomodoro,todo&via=1dailyplace"
                    color="blue"
                    variant="subtle"
                    data-splitbee-event="Share on twitter"
                >
                    <IconBrandTwitter size={18} />
                </ActionIcon>
            </Tooltip>

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
