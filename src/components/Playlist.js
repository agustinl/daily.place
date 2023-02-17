import { Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconPlaylist } from "@tabler/icons";
import Title from "./common/Title";

import Music from "./common/Music";

import coffee from "../../public/covers/coffe-shop.gif";
import forest from "../../public/covers/forest.jpg";
import fireplace from "../../public/covers/fireplace.gif";
import rain from "../../public/covers/rain.gif";
import waves from "../../public/covers/waves.jpg";

import forestAudio from "../../public/sounds/forest.mp3";
import coffeeShopAudio from "../../public/sounds/coffee-shop.mp3";
import fireplaceAudio from "../../public/sounds/fireplace.mp3";
import rainAudio from "../../public/sounds/rain.mp3";
import wavesAudio from "../../public/sounds/waves.mp3";

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
						cover={forest}
						title="Forest"
						audio={forestAudio}
					/>
				</Carousel.Slide>
				<Carousel.Slide>
					<Music
						cover={coffee}
						audio={coffeeShopAudio}
						title="Coffee shop"
						gif
					/>
				</Carousel.Slide>
				<Carousel.Slide>
					<Music
						cover={fireplace}
						audio={fireplaceAudio}
						title="Fireplace"
						gif
					/>
				</Carousel.Slide>
				<Carousel.Slide>
					<Music
						cover={rain}
						audio={rainAudio}
						title="Rain"
						gif
					/>
				</Carousel.Slide>
				<Carousel.Slide>
					<Music
						cover={waves}
						audio={wavesAudio}
						title="Waves"
					/>
				</Carousel.Slide>
			</Carousel>
		</Stack>
	);
};

export default Playlist;
