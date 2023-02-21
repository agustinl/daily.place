import coffee from "../../public/covers/coffe-shop.gif";
import forest from "../../public/covers/forest.jpg";
import fireplace from "../../public/covers/fireplace.gif";
import rain from "../../public/covers/rain.gif";
import waves from "../../public/covers/waves.jpg";
import lofi from "../../public/covers/lofi.gif";

import forestAudio from "../../public/sounds/forest.mp3";
import coffeeShopAudio from "../../public/sounds/coffee-shop.mp3";
import fireplaceAudio from "../../public/sounds/fireplace.mp3";
import rainAudio from "../../public/sounds/rain.mp3";
import wavesAudio from "../../public/sounds/waves.mp3";
import lofiAudio from "../../public/sounds/lofi.mp3";

export const SOUNDS_LIST = [
    {
        cover: lofi,
        audio: lofiAudio,
        gif: true,
        title: "Lo-fi"
    },
    {
        cover: coffee,
        audio: coffeeShopAudio,
        gif: true,
        title: "Coffe shop"
    },
    {
        cover: forest,
        audio: forestAudio,
        gif: false,
        title: "Forest"
    },
    {
        cover: fireplace,
        audio: fireplaceAudio,
        gif: true,
        title: "Fireplace"
    },
    {
        cover: rain,
        audio: rainAudio,
        gif: true,
        title: "Rain"
    },
    {
        cover: waves,
        audio: wavesAudio,
        gif: false,
        title: "Waves"
    }
];