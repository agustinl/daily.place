import { Text, createStyles } from "@mantine/core";
// import Image from "next/image";

const useStyles = createStyles((theme, _params) => {
	return {
		content: {
			position: "relative"
		},

		image: {
			borderRadius: 5,
		},

		video: {
            width: "100%",
			borderRadius: 5
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
            zIndex: 98
		},

		title: {
			color: theme.white,
		},

		indicator: {
			position: "absolute",
			bottom: 20,
			left: 20,
            zIndex: 99
		},
	};
});

const Music = props => {
	const { cover, title, videoID, onVideoSelect } = props;
	const { classes } = useStyles();

	return (
		<div className={classes.content}>
			{/*<Image
				alt={title}
				src={cover}
				width={480}
				height={180}
				quality={100}
				style={{
					maxWidth: "100%",
					height: "100%",
				}}
				className={classes.image}
			/>*/}
            <video muted autoPlay loop className={classes.video}>
                <source src={cover} type="video/webm"/>
                Your browser does not support the video tag. You can download the video anyway.
            </video>
			<div
				className={classes.overlay}
				onClick={() => onVideoSelect(title, videoID)}
                data-splitbee-event={`Play ${title}`}
			/>

			<div className={classes.indicator}>
				<>
					<Text size="sm" className={classes.title}>
						{title}
					</Text>
					{/*
                        !hideIndicator && <Slider
                            w="100%"
                            color="green"
                            size="sm"
                            radius="md"
                            min={0.0}
                            max={1.0}
                            step={0.1}
                            value={volume}
                            label={(value) => value.toFixed(1)}
                            onChangeEnd={(value) => setVolume(value)}
                            showLabelOnHover
                        />
                    */}
				</>
			</div>
		</div>
	);
};

export default Music;
