import { useRef, useEffect } from 'react';
import { Avatar, Text, Slider, Flex, ThemeIcon, Anchor } from '@mantine/core';

import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Sound } from '@/types/sound';

import classes from './music.module.css';

const Music = (props: Sound) => {
    const { cover, icon, title, audioFile, avatar, url } = props;
    const { play, volume, togglePlay, setVolume } = useMusicPlayer();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Sync play state with audio element
    useEffect(() => {
        if (audioRef.current) {
            if (play) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [play]);

    // Sync volume state with audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <Flex gap={10} w="100%" className={classes.content}>
            <audio
                ref={audioRef}
                src={audioFile}
                loop
                preload="none"
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: '-1',
                    width: 10,
                    height: 10
                }}
            />
            {avatar ? (
                <Avatar
                    src={cover}
                    radius="xl"
                    size="md"
                    onClick={() => togglePlay(title)}
                    className={classes.playButton}
                />
            ) : (
                <ThemeIcon
                    radius="md"
                    size="xl"
                    onClick={() => togglePlay(title)}
                    className={classes.playButton}
                    variant="gradient"
                    gradient={{
                        from: 'dark.7',
                        to: 'dark.4'
                    }}
                >
                    {icon}
                </ThemeIcon>
            )}

            <Flex direction="column" w="100%" justify="center" gap={5}>
                {url ? (
                    <Anchor href={url} target="_blank" rel="noreferrer" fw={600}>
                        {title}
                    </Anchor>
                ) : (
                    <Text fw={600}>{title}</Text>
                )}

                {play && (
                    <Flex align="flex-end" gap={10}>
                        <div className={classes.bars}>
                            <span />
                            <span />
                            <span />
                        </div>
                        <Slider
                            w="80%"
                            color="green"
                            size="sm"
                            radius="md"
                            min={0.0}
                            max={1.0}
                            step={0.1}
                            value={volume}
                            label={(value) => value.toFixed(1)}
                            onChangeEnd={(value) => setVolume(value)}
                            showLabelOnHover
                        />
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default Music;
