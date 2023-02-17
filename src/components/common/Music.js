import { useState, useEffect } from "react";
import { Text, Indicator, createStyles } from "@mantine/core";
import Image from "next/image";

const useStyles = createStyles((theme, _params) => {
	return {
		content: {
			height: "100%",
			position: "relative",
		},

		image: {
			borderRadius: 5,
		},

		overlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundImage:
				"linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .65) 90%)",
			transition: "top 500ms ease",
			borderRadius: 5,
			cursor: "pointer",
		},

		title: {
			color: theme.white,
            marginLeft: 10,
            paddingBottom: 2
		},

		indicator: {
            position: "absolute",
			bottom: 10,
			left: 20,
		},
	};
});

const Music = ({ cover, title, audio, gif }) => {
	const { classes } = useStyles();

	const [song, setSong] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setSong(new Audio(audio));
    }, []);

	const playPause = () => {
		if (isPlaying) {
			song.pause();
		} else {
			song.play();
		}

		setIsPlaying(!isPlaying);
	};

	return (
		<div className={classes.content}>
			<Image
				alt={title}
				src={cover}
				placeholder={gif || "blur"}
				width={300}
				height={180}
				quality={100}
				style={{
					maxWidth: "100%",
					height: "100%",
				}}
				className={classes.image}
			/>
			<div className={classes.overlay} onClick={playPause} />

			<div
                className={classes.indicator}
            >
                <Indicator
                    color="green"
                    position="middle-start"
                    size={7}
                    disabled={!isPlaying}
                    processing
                >
                    <Text size="sm" className={classes.title}>
                        {title}
                    </Text>
                </Indicator>
            </div>
		</div>
	);
};

export default Music;
