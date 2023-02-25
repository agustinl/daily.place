const coffee = "https://res.cloudinary.com/listi/image/upload/v1677296752/daily-place/covers/coffe-shop_bjcxxn.gif";
const forest = "https://res.cloudinary.com/listi/image/upload/v1677296750/daily-place/covers/forest_b09b7d.jpg";
const fireplace = "https://res.cloudinary.com/listi/image/upload/v1677296755/daily-place/covers/fireplace_bpmxwh.gif";
const rain = "https://res.cloudinary.com/listi/image/upload/v1677296754/daily-place/covers/rain_agiveq.gif";
const waves = "https://res.cloudinary.com/listi/image/upload/v1677296750/daily-place/covers/waves_ybvnvs.jpg";
const lofi = "https://res.cloudinary.com/listi/image/upload/v1677296753/daily-place/covers/lofi_lon3vh.gif";

const forestAudio = "https://res.cloudinary.com/listi/video/upload/v1677296757/daily-place/sounds/forest_mbppe1.mp3";
const coffeeShopAudio = "https://res.cloudinary.com/listi/video/upload/v1677296755/daily-place/sounds/coffee-shop_hwqrto.mp3";
const fireplaceAudio = "https://res.cloudinary.com/listi/video/upload/v1677296756/daily-place/sounds/fireplace_cehc9g.mp3";
const rainAudio = "https://res.cloudinary.com/listi/video/upload/v1677296761/daily-place/sounds/rain_iug6dg.mp3";
const wavesAudio = "https://res.cloudinary.com/listi/video/upload/v1677296758/daily-place/sounds/waves_ezqpdy.mp3";
const lofiAudio = "https://res.cloudinary.com/listi/video/upload/v1677296759/daily-place/sounds/lofi_djiz5s.mp3";

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