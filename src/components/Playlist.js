import { Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Grid, Flex, Image } from "@mantine/core";

import Title from "./common/Title";
import Music from "./common/Music";

import { SOUNDS_LIST } from "@/constants/Playlist";

const Playlist = () => {
	return (
		<Stack w="100%">
			<Title text="Playlist" />
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
							<Music {...sound} />
						</Carousel.Slide>
					);
				})}
			</Carousel>
		</Stack>
	);
};

export default Playlist;
