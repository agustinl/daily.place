import { Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconPlaylist } from "@tabler/icons";
import Title from "./common/Title";

import Music from "./common/Music";

import vaporwave from "../../public/covers/vaporwave.jpg";
import asmr from "../../public/covers/asmr.jpg";
import rain from "../../public/covers/rain.jpg";

import rainAudio from "../../public/sounds/forest.mp3";

const Playlist = () => {
	return (
		<Stack w="100%">
			<Title icon={<IconPlaylist />} text="Playlist" />
			<Carousel
				slideSize="33.333333%"
				breakpoints={[{ maxWidth: "xs", slideSize: "50%" }]}
				slideGap="md"
				loop
				align="start"
				slidesToScroll={1}
				dragFree
			>
				<Carousel.Slide>
					<Music
						cover={vaporwave}
						title="Vaporwave"
						audio={rainAudio}
					/>
				</Carousel.Slide>
				<Carousel.Slide>
					<Music cover={asmr} title="ASMR" />
				</Carousel.Slide>
				<Carousel.Slide>
					<Music cover={rain} title="Rain" />
				</Carousel.Slide>
			</Carousel>
		</Stack>
	);
};

export default Playlist;
