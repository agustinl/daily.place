import { useState } from "react";
import {
	Text,
	createStyles,
	Slider,
	Flex,
	ThemeIcon,
	keyframes,
} from "@mantine/core";
import ReactPlayer from "react-player/youtube";

export const bounce = keyframes({
	"10%": { transform: "scaleY(0.3)" },
	"30%": { transform: "scaleY(1)" },
	"60%": { transform: "scaleY(0.5)" },
	"80%": { transform: "scaleY(0.75)" },
	"100%": { transform: "scaleY(0.6)" },
});

const useStyles = createStyles((theme, _params) => {
	return {
		content: {
			position: "relative",
		},

		bars: {
			position: "relative",
			display: "flex",
			justifyContent: "space-between",
			width: "13px",
			height: "13px",

			"& span": {
				width: "3px",
				height: "100%",
				backgroundColor: theme.colors.green[6],
				borderRadius: "3px",
				content: '""',
				animation: `${bounce}  2.2s ease infinite alternate`,

				"&:nth-of-type(2)": {
					animationDelay: "-2.2s",
				},

				"&:nth-of-type(2)": {
					animationDelay: "-3.7s",
				},
			},
		},

		playButton: {
			cursor: "pointer",
		},
	};
});

const Music = props => {
	const { icon, title, videoID } = props;
	const { classes } = useStyles();
	const [play, setPlay] = useState(false);
	const [volume, setVolume] = useState(1);

	return (
		<Flex gap={10} w="100%" className={classes.content}>
			<ReactPlayer
				url={`https://www.youtube.com/watch?v=${videoID}`}
				loop={true}
				className={classes.video}
				width={10}
				height={10}
				style={{
					position: "absolute",
					top: 10,
					left: 10,
					zIndex: "-1",
				}}
				playing={play}
				volume={volume}
			/>
			<ThemeIcon
				radius="lg"
				size="xl"
				onClick={() => setPlay(!play)}
				className={classes.playButton}
                variant="gradient"
                gradient={{
                    from: "dark.7",
                    to: "dark.4",
                }}
			>
				{icon}
			</ThemeIcon>

			<Flex direction="column" w="100%" justify="center" gap={5}>
				<Text size="sm" fw="600">
					{title}
				</Text>

				{play && (
					<Flex align="flex-end" gap={10}>
						<div className={classes.bars}>
							<span />
							<span />
							<span />
						</div>
						<Slider
							w="80%"
							color="green"
							size="sm"
							radius="md"
							min={0.0}
							max={1.0}
							step={0.1}
							value={volume}
							label={value => value.toFixed(1)}
							onChangeEnd={value => setVolume(value)}
							showLabelOnHover
						/>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default Music;
