import { useEffect } from 'react';
import { Avatar, Slider } from '@mantine/core';
import { IconArrowUpRight, IconPlayerPlayFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import ReactPlayer from 'react-player/youtube';

import { Sound } from '@/types/sound';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

import classes from './Music.module.css';

type MusicProps = Sound & {
    /** Called whenever this sound starts or stops playing. */
    onPlayingChange?: (title: string, playing: boolean) => void;
};

const Music = ({ cover, icon, title, videoID, avatar, url, onPlayingChange }: MusicProps) => {
    const t = useTranslations();
    const { play, volume, togglePlay, setVolume } = useMusicPlayer();

    useEffect(() => {
        onPlayingChange?.(title, play);
    }, [onPlayingChange, title, play]);

    return (
        <div className={classes.tile} data-on={play || undefined}>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videoID}`}
                loop
                width={10}
                height={10}
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: '-1'
                }}
                playing={play}
                volume={volume}
            />

            <div className={classes.top}>
                <button
                    type="button"
                    aria-pressed={play}
                    onClick={() => togglePlay(title)}
                    className={classes.toggle}
                >
                    <span className={classes.icon} aria-hidden="true">
                        {avatar ? <Avatar src={cover} radius="xl" size={20} alt="" /> : icon}
                    </span>
                    <span className={classes.name}>{title}</span>
                    <span className={classes.state} aria-hidden="true">
                        {play ? (
                            <span className={classes.bars}>
                                <span />
                                <span />
                                <span />
                            </span>
                        ) : (
                            <IconPlayerPlayFilled size={14} />
                        )}
                    </span>
                </button>
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('playlist.openSource', { sound: title })}
                        className={classes.source}
                    >
                        <IconArrowUpRight size={16} />
                    </a>
                )}
            </div>

            {play ? (
                <Slider
                    className={classes.slider}
                    color="var(--dp-accent)"
                    size="sm"
                    min={0.0}
                    max={1.0}
                    step={0.1}
                    value={volume}
                    label={(value) => value.toFixed(1)}
                    thumbLabel={t('playlist.volume', { sound: title })}
                    onChangeEnd={(value) => setVolume(value)}
                    showLabelOnHover
                />
            ) : (
                <span className={classes.track} aria-hidden="true" />
            )}
        </div>
    );
};

export default Music;
