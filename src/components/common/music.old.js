import { IconHeadphones, IconHeadphonesOff } from "@tabler/icons";
import {
	Card,
	Text,
	Group,
	createStyles,
	ActionIcon,
	Flex,
} from "@mantine/core";
import Image from 'next/image'

const useStyles = createStyles((theme, _params, getRef) => {
	const image = getRef("image");
    const overlay = getRef("overlay");

	return {
		card: {
			position: "relative",
            width: "100%",
			height: 180,
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],

			[`&:hover .${image}`]: {
				transform: "scale(1.03)",
			},
            [`&:hover .${overlay}`]: {
				top: "0%"
			},
		},

		image: {
			ref: image,
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundSize: "cover",
			backgroundPosition: "center",
			transition: "transform 500ms ease",
		},

		overlay: {
			ref: overlay,
			position: "absolute",
			top: "20%",
			left: 0,
			right: 0,
			bottom: 0,
			backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
			transition: "top 500ms ease",
		},

		content: {
			height: "100%",
			position: "relative",
			display: "flex",
			flexDirection: "column",
			justifyContent: "flex-end",
			zIndex: 1,
		},

		title: {
			color: theme.white
		}
	};
});

const Music = ({ image, title, link }) => {
	const { classes, theme } = useStyles();

	return (
		<Card
			p="sm"
			className={classes.card}
			radius="md"
			component="a"
			href={link}
			target="_blank"
		>
			<div
				className={classes.image}
				style={{ backgroundImage: `url(${image})` }}
			/>
			<div className={classes.overlay} />

			<div className={classes.content}>
				<Group position="apart">
					<Text size="sm" className={classes.title}>
						{title}
					</Text>
					<Flex gap="sm">
						{/* <ActionIcon color="green" variant="filled">
							<IconHeadphones size={18} />
						</ActionIcon>

						<ActionIcon color="red" variant="filled">
							<IconHeadphonesOff size={18} />
						</ActionIcon>*/}
					</Flex>
				</Group>
			</div>
		</Card>
	);
};

export default Music;
