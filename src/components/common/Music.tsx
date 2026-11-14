import { Avatar, Text, Slider, Flex, ThemeIcon, Anchor } from '@mantine/core';
import ReactPlayer from 'react-player/youtube';

import { Sound } from '@/types/sound';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

import classes from './music.module.css';

const Music = (props: Sound) => {
    const { cover, icon, title, videoID, avatar, url } = props;
    const { play, volume, togglePlay, setVolume } = useMusicPlayer();

    return (
        <Flex gap={10} w="100%" className={classes.content}>
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
