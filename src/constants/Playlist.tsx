import {
    IconCoffee,
    IconTrees,
    IconCampfire,
    IconCloudRain,
    IconRipple,
    IconBuildingSkyscraper,
    IconBeach,
    IconMoonFilled
} from '@tabler/icons-react';

import { Sound } from '@/types/sound';

export const SOUNDS_LIST: Sound[] = [
    /* {
		audioFile: "https://ik.imagekit.io/dailyplace/sounds/lofi.mp3",
		title: "Lofi",
		icon: <IconVinyl />,
	}, */
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/coffee-shop.mp3',
        title: 'Coffee shop',
        icon: <IconCoffee />
    },
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/forest.mp3',
        title: 'Forest',
        icon: <IconTrees />
    },
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/fireplace.mp3',
        title: 'Fireplace',
        icon: <IconCampfire />
    },
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/rain.mp3',
        title: 'Rain',
        icon: <IconCloudRain />
    },
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/waves.mp3',
        title: 'Waves',
        icon: <IconRipple />
    },
    /* {
		audioFile: "https://ik.imagekit.io/dailyplace/sounds/vaporwave-synthwave.mp3",
		title: "Vaporwave/Synthwave",
		icon: <IconDeviceSpeaker />,
	},
	{
		audioFile: "https://ik.imagekit.io/dailyplace/sounds/asmr.mp3",
		title: "ASMR",
		icon: <IconMicrophone />,
	}, */
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/city-walk.mp3',
        title: 'City',
        icon: <IconBuildingSkyscraper />
    },
    /* {
		cover: "https://ik.imagekit.io/dailyplace/lofi_girl.jpg",
		audioFile: "https://ik.imagekit.io/dailyplace/sounds/lofi-girl.mp3",
		title: "Lofi Girl",
		avatar: true,
		url: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
	}, */
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/beach.mp3',
        title: 'Beach',
        icon: <IconBeach />
    },
    {
        audioFile: 'https://ik.imagekit.io/dailyplace/sounds/night.mp3',
        title: 'Night',
        icon: <IconMoonFilled />
    }
];
