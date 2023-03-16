import { Button, Flex } from "@mantine/core";
import {
	IconBrandTwitter,
	IconBrandGithub,
	IconBrandProducthunt,
} from "@tabler/icons";

const Social = () => {
	return (
		<>
			<Button
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://twitter.com/1dailyplace"
				leftIcon={<IconBrandTwitter size={18} />}
				styles={theme => ({
					root: {
						backgroundColor: "#00acee",

						"&:hover": {
							backgroundColor: theme.fn.darken("#00acee", 0.05),
						},
					},

					leftIcon: {
						marginRight: 15,
					},
				})}
			>
				Follow @1dailyplace
			</Button>

			<Button
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://github.com/agustinl/daily.place"
				leftIcon={<IconBrandGithub size={18} />}
				styles={theme => ({
					root: {
						backgroundColor: "#868E96",

						"&:hover": {
							backgroundColor: theme.fn.darken("#868E96", 0.05),
						},
					},

					leftIcon: {
						marginRight: 15,
					},
				})}
			>
				Star on GitHub
			</Button>

			<Button
				component="a"
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.producthunt.com/products/daily-place"
				leftIcon={<IconBrandProducthunt size={18} />}
				styles={theme => ({
					root: {
						backgroundColor: "#ff6154",

						"&:hover": {
							backgroundColor: theme.fn.darken("#ff6154", 0.05),
						},
					},

					leftIcon: {
						marginRight: 15,
					},
				})}
			>
				Featured on Product Hunt
			</Button>
		</>
	);
};

export default Social;
