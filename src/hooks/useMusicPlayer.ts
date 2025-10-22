import { useState, useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface UseMusicPlayerReturn {
    play: boolean;
    volume: number;
    togglePlay: (title: string) => void;
    setVolume: (volume: number) => void;
}

/**
 * Custom hook to manage music player state
 *
 * Controls play/pause state and volume level for the audio player.
 * Tracks music play events via Google Analytics when music starts playing.
 *
 * @returns Object with play state, volume level, and control methods
 *
 * @example
 * ```tsx
 * const { play, volume, togglePlay, setVolume } = useMusicPlayer();
 *
 * <button onClick={() => togglePlay('Rain Sounds')}>
 *   {play ? 'Pause' : 'Play'}
 * </button>
 * ```
 */
export const useMusicPlayer = (): UseMusicPlayerReturn => {
    const [play, setPlay] = useState(false);
    const [volume, setVolumeState] = useState(1);
    const { trackEvent } = useAnalytics();

    const togglePlay = useCallback((title: string) => {
        setPlay((prev) => {
            const newPlayState = !prev;
            if (newPlayState) {
                trackEvent({
                    action: 'music_played',
                    category: 'playlist',
                    label: title
                });
            }
            return newPlayState;
        });
    }, [trackEvent]);

    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(newVolume);
    }, []);

    return {
        play,
        volume,
        togglePlay,
        setVolume
    };
};

