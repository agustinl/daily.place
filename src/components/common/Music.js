import { useState } from "react";
import { Text, createStyles, Slider, Indicator } from "@mantine/core";
import ReactPlayer from "react-player/youtube";

const useStyles = createStyles((theme, _params) => {
	return {
		content: {
			position: "relative",
		},

		image: {
			borderRadius: 5,
		},

		cover: {
			width: "100%",
			borderRadius: 5,
		},

		overlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 6,
			backgroundImage:
				theme.colorScheme === "dark"
					? "linear-gradient(180deg, rgba(0,0,0, 0) 0%, rgba(0,0,0, .45) 90%)"
					: "linear-gradient(180deg, rgba(80,80,80, 0) 0%, rgba(80,80,80, .65) 90%)",
			transition: "top 500ms ease",
			borderRadius: 5,
			cursor: "pointer",
			zIndex: 98,
		},

		indicator: {
			position: "absolute",
			bottom: 20,
			left: 20,
			right: 10,
			zIndex: 99,
		},
	};
});

const Music = props => {
	const { cover, title, videoID } = props;
	const { classes } = useStyles();
	const [play, setPlay] = useState(false);
	const [volume, setVolume] = useState(1);

	return (
		<div className={classes.content}>
			<video muted autoPlay loop className={classes.cover}>
				<source
					src={process.env.NODE_ENV === "development" ? "" : cover}
					type="video/webm"
				/>
			</video>
			<ReactPlayer
				url={`https://www.youtube.com/watch?v=${videoID}`}
				loop={true}
				className={classes.video}
				width={10}
				height={10}
				style={{
					position: "absolute",
				}}
				playing={play}
				volume={volume}
			/>
			<div
				className={classes.overlay}
				onClick={() => setPlay(!play)}
			/>

			<div className={classes.indicator}>
				<>
					<Indicator
						color="green"
						position="middle-start"
						processing
						size={8}
						disabled={!play}
					>
						<Text size="sm" c="white" pl={10}>
							{title}
						</Text>
					</Indicator>
					{play && (
						<Slider
							w="100%"
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
					)}
				</>
			</div>
		</div>
	);
};

export default Music;
