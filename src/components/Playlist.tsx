import { Stack, SimpleGrid } from "@mantine/core";
import { useTranslations } from "next-intl";

import { SOUNDS_LIST } from "@/constants/Playlist";

import Music from "./common/Music";
import Title from "./common/Title";

const Playlist = () => {
	const t = useTranslations();

	return (
		<Stack w="100%">
			<Title text={t('playlist.title')} />
			<SimpleGrid
				cols={{ base: 1, xs: 2, md: 3 }}
				spacing={{ base: 'sm', sm: 'md', md: 'xl' }}
				verticalSpacing="xl"
			>
				{SOUNDS_LIST?.map((sound, i) => {
					return (
						<Music
							{...sound}
							key={i}
						/>
					);
				})}
			</SimpleGrid>
		</Stack>
	);
};

export default Playlist;
