import { Stack } from "@mantine/core";
import { SimpleGrid } from "@mantine/core";

import Title from "./common/Title";
import Music from "./common/Music";

import { SOUNDS_LIST } from "@/constants/Playlist";

const Playlist = () => {
	return (
		<Stack w="100%">
			<Title text="Playlist" />
            <SimpleGrid cols={3} spacing="xl" verticalSpacing="xl">
                {
                    SOUNDS_LIST?.map((sound, i) => {
                        return <Music {...sound} key={i} />
                    })
                }
            </SimpleGrid>
		</Stack>
	);
};

export default Playlist;
