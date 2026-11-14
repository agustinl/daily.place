import {
    cloneElement,
    type FocusEvent,
    type MouseEvent,
    type PointerEvent,
    type ReactElement
} from 'react';

import { isFeedbackFishReady, loadFeedbackFish } from '@/lib/feedbackFish';

type TriggerProps = {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
};

type FeedbackTriggerProps = {
    children: ReactElement<TriggerProps>;
};

let pendingOpen = false;

const preload = () => {
    loadFeedbackFish().catch(() => undefined);
};

/**
 * Opens the feedback widget from its child element. The widget script loads on the first
 * hover, focus or click instead of on page load.
 */
const FeedbackTrigger = ({ children }: FeedbackTriggerProps) => {
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        children.props.onClick?.(event);
        // Once ready, the widget's own click handler opens it
        if (isFeedbackFishReady() || pendingOpen) return;

        const target = event.currentTarget;
        pendingOpen = true;
        loadFeedbackFish()
            .then(() => {
                if (target.isConnected) target.click();
            })
            .catch(() => undefined)
            .finally(() => {
                pendingOpen = false;
            });
    };

    return cloneElement(children, {
        'data-feedback-fish': true,
        onClick: handleClick,
        onFocus: (event: FocusEvent<HTMLElement>) => {
            children.props.onFocus?.(event);
            preload();
        },
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
            children.props.onPointerEnter?.(event);
            preload();
        }
    } as TriggerProps);
};

export default FeedbackTrigger;
