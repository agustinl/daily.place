import { Flex, Tooltip } from "@mantine/core";
import { IconBrandGithub, IconBrandProducthunt, IconBrandX } from "@tabler/icons-react";

import Action from "./Action";

const Social = () => {
	return (
		<Flex
			align="center"
			gap={10}
		>
			<Tooltip label="Share on X">
				<Action
					component="a"
					target="_blank"
					rel="noopener noreferrer"
					href={`https://x.com/intent/tweet
					?text=Create your perfect space to focus on your daily tasks
					&url=https://daily.place&hashtags=lofi,pomodoro,todo`}
					color="dark"
					variant="subtle"
				>
					<IconBrandX size={18} />
				</Action>
			</Tooltip>

			<Action
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://github.com/agustinl/daily.place"
				variant="subtle"
			>
				<IconBrandGithub size={18} />
			</Action>

			<Action
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.producthunt.com/products/daily-place"
				variant="subtle"
				color="orange"
			>
				<IconBrandProducthunt size={18} />
			</Action>
		</Flex>
	);
};

export default Social;
