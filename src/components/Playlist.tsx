import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

import { SOUNDS_LIST } from '@/constants/Playlist';

import Music from './common/Music';
import shared from './PlaceCard.module.css';
import classes from './Playlist.module.css';

const Playlist = () => {
    const t = useTranslations();
    const [playing, setPlaying] = useState<string[]>([]);

    const handlePlayingChange = useCallback((title: string, isPlaying: boolean) => {
        setPlaying((current) => {
            if (isPlaying === current.includes(title)) return current;
            return isPlaying ? [...current, title] : current.filter((sound) => sound !== title);
        });
    }, []);

    return (
        <section aria-labelledby="sounds-title" className={`${shared.card} ${classes.card}`}>
            <div className={shared.header}>
                <h2 id="sounds-title" className={shared.title}>
                    {t('playlist.title')}
                </h2>
                <span className={classes.playing} aria-live="polite">
                    {playing.length > 0
                        ? t('playlist.playing', { sounds: playing.join(' + ') })
                        : t('playlist.nothingPlaying')}
                </span>
            </div>
            <div className={classes.grid}>
                {SOUNDS_LIST?.map((sound) => (
                    <Music {...sound} key={sound.title} onPlayingChange={handlePlayingChange} />
                ))}
            </div>
        </section>
    );
};

export default Playlist;
