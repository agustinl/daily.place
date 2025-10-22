import { useEffect, useRef, useCallback } from 'react';
import JSConfetti from 'js-confetti';

/**
 * Custom hook to manage confetti celebrations
 *
 * Creates and manages a JSConfetti instance for displaying
 * celebratory confetti animations. Initializes canvas once
 * and provides methods to trigger different confetti effects.
 * Automatically cleans up canvas on unmount.
 *
 * @returns Object with methods to trigger confetti animations
 *
 * @example
 * ```tsx
 * const { celebrate, addEmoji } = useConfetti();
 *
 * // Trigger default confetti
 * celebrate();
 *
 * // Trigger emoji confetti
 * addEmoji(['🎉', '✨', '🎊']);
 * ```
 */
export const useConfetti = () => {
    const jsConfettiRef = useRef<JSConfetti | null>(null);

    // Initialize JSConfetti instance once
    useEffect(() => {
        jsConfettiRef.current = new JSConfetti();

        return () => {
            // Cleanup on unmount
            jsConfettiRef.current?.clearCanvas();
        };
    }, []);

    /**
     * Trigger celebration with colorful confetti
     */
    const celebrate = useCallback(() => {
        jsConfettiRef.current?.addConfetti({
            confettiColors: [
                '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
                '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d'
            ],
            confettiRadius: 6,
            confettiNumber: 250,
        });
    }, []);

    /**
     * Trigger celebration with custom emojis
     */
    const addEmoji = useCallback((emojis: string[], emojiSize = 80) => {
        jsConfettiRef.current?.addConfetti({
            emojis,
            emojiSize,
            confettiNumber: 30,
        });
    }, []);

    /**
     * Clear all confetti from canvas
     */
    const clearCanvas = useCallback(() => {
        jsConfettiRef.current?.clearCanvas();
    }, []);

    return {
        celebrate,
        addEmoji,
        clearCanvas
    };
};

