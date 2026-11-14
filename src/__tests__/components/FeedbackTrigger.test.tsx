import { act, fireEvent, render, screen } from '@testing-library/react';

import FeedbackTrigger from '@/components/common/FeedbackTrigger';
import { BIND_DELAY_MS, resetFeedbackFish } from '@/lib/feedbackFish';

const widgetScripts = () =>
    Array.from(document.querySelectorAll<HTMLScriptElement>('script')).filter((script) =>
        script.src.startsWith('https://feedback.fish/ff.js')
    );

const renderTrigger = (onClick = jest.fn()) => {
    render(
        <FeedbackTrigger>
            <button type="button" onClick={onClick}>
                Send feedback
            </button>
        </FeedbackTrigger>
    );
    return screen.getByRole('button', { name: 'Send feedback' });
};

describe('FeedbackTrigger', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        resetFeedbackFish();
        widgetScripts().forEach((script) => script.remove());
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('marks its child for the widget without loading the script', () => {
        const button = renderTrigger();

        expect(button).toHaveAttribute('data-feedback-fish');
        expect(widgetScripts()).toHaveLength(0);
    });

    it('loads the script once on hover or focus', () => {
        const button = renderTrigger();

        fireEvent.pointerEnter(button);
        fireEvent.focus(button);

        expect(widgetScripts()).toHaveLength(1);
    });

    it('opens the widget after loading when clicked before it was ready', async () => {
        const onClick = jest.fn();
        const button = renderTrigger(onClick);

        fireEvent.click(button);
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(2);

        fireEvent.load(widgetScripts()[0]);
        await act(async () => {
            jest.advanceTimersByTime(BIND_DELAY_MS);
        });

        // One replayed click for the widget's own handler, not one per early click
        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('allows another attempt when the script fails to load', () => {
        const button = renderTrigger();

        fireEvent.pointerEnter(button);
        fireEvent.error(widgetScripts()[0]);
        expect(widgetScripts()).toHaveLength(0);

        fireEvent.pointerEnter(button);
        expect(widgetScripts()).toHaveLength(1);
    });
});
