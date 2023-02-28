import { useState, useEffect } from "react";
import { Stack, ActionIcon, Flex, Indicator, Text } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import Title from "./common/Title";

import Music from "./common/Music";

import YouTube from "react-youtube";

import { SOUNDS_LIST } from "@/constants/Playlist";

const YT_OPTS = {
	playerVars: {
		autoplay: 1,
		loop: 1,
	},
};

let videoElement = null;

const Playlist = () => {
	const [videoID, setVideoID] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [videoTitle, setVideoTitle] = useState(true);

	useEffect(() => {
		if (videoID && videoElement) {
			if (isPlaying) {
				videoElement?.target?.playVideo();
			} else {
				videoElement?.target?.pauseVideo();
			}
		}
	}, [isPlaying, videoID]);

	const _onReady = event => {
		videoElement = event;
	};

	const handleVideoSelect = (title, id) => {
		setVideoID(id);
		setIsPlaying(true);
		setVideoTitle(title);
	};

	const BUTTONS = (
		<Flex align="center" gap={20}>
			<Indicator
				color="green"
				position="middle-start"
				size={9}
				disabled={!isPlaying}
				processing
			>
				<Text size="sm" w="100%" ml={10} fw={600}>
					{videoTitle}
				</Text>
			</Indicator>
			{videoID && (isPlaying ? (
				<ActionIcon
					color="red"
					variant="light"
					onClick={() => setIsPlaying(false)}
					aria-label="Pause sound"
				>
					<IconPlayerPause size={18} />
				</ActionIcon>
			) : (
				<ActionIcon
					color="green"
					variant="light"
					onClick={() => setIsPlaying(true)}
					aria-label="Play sound"
				>
					<IconPlayerPlay size={18} />
				</ActionIcon>
			))}
		</Flex>
	);

	return (
		<Stack w="100%">
			<Title text="Playlist">{BUTTONS}</Title>
			<YouTube
				videoId={videoID}
				opts={YT_OPTS}
				onReady={_onReady}
				style={{
					pointerEvents: "none",
					userSelect: "none",
					position: "fixed",
					top: "100%",
					left: "100%",
				}}
			/>
			<Carousel
				slideSize="33.333333%"
				breakpoints={[
					{
						maxWidth: 480,
						slideSize: "100%",
					},
					{
						maxWidth: "sm",
						slideSize: "50%",
					},
				]}
				slideGap="md"
				loop
				align="start"
				slidesToScroll={1}
			>
				{SOUNDS_LIST?.map((sound, i) => {
					return (
						<Carousel.Slide key={i}>
							<Music
								{...sound}
								onVideoSelect={handleVideoSelect}
							/>
						</Carousel.Slide>
					);
				})}
			</Carousel>
		</Stack>
	);
};

export default Playlist;
