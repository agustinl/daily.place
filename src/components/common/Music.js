import { useState, useEffect } from "react";
import { Text, Indicator, createStyles, Slider, Flex } from "@mantine/core";
import Image from "next/image";
import { Howl } from "howler";

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
			backgroundImage: theme.colorScheme === "dark"
                ? "linear-gradient(180deg, rgba(0,0,0, 0) 0%, rgba(0,0,0, .65) 90%)"
                : "linear-gradient(180deg, rgba(80,80,80, 0) 0%, rgba(80,80,80, .65) 90%)",
			transition: "top 500ms ease",
			borderRadius: 5,
			cursor: "pointer",
		},

		title: {
			color: theme.white,
			marginLeft: 10,
			paddingBottom: 2,
		},

		indicator: {
			position: "absolute",
			bottom: 10,
			left: 20,
            right: 20
		},
	};
});

const Music = ({ cover, title, audio, gif }) => {
	const { classes } = useStyles();
	const [sound, setSound] = useState(null);
	const [volume, setVolume] = useState(1.0);
	const [hideIndicator, setHideIndicator] = useState(true);

	useEffect(() => {
		var sound = new Howl({
			src: audio,
			loop: true,
            volume: volume,
			onplay: function () {
				setHideIndicator(false);
			},
			onpause: function () {
				setHideIndicator(true);
			}
		});

		setSound(sound);

		return () => {
			setHideIndicator(true);
			sound.stop();
		};
	}, []);

    useEffect(() => {
		sound && sound.volume(volume);
	}, [volume]);

	const playStopSound = () => {
		let playing = sound.playing();

		playing ? sound.pause() : sound.play();
	};

	return (
		<div className={classes.content}>
			<Image
				alt={title}
				src={cover}
				placeholder={gif || "blur"}
				width={480}
				height={180}
				quality={100}
				style={{
					maxWidth: "100%",
					height: "100%",
				}}
				className={classes.image}
			/>
			<div className={classes.overlay} onClick={playStopSound} />

			<div className={classes.indicator}>
                <>
                    <Indicator
                        color="green"
                        position="middle-start"
                        size={7}
                        disabled={hideIndicator}
                        processing
                    >
                        <Text size="sm" w="100%" className={classes.title}>
                            {title}
                        </Text>
                    </Indicator>
                    {
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
                    }
                </>
			</div>
		</div>
	);
};

export default Music;
