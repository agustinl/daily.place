import { useCallback } from 'react';
import * as gtag from '@/lib/gtag';

interface AnalyticsEventParams {
    action: string;
    category?: string;
    label?: string;
    value?: number;
}

interface UseAnalyticsReturn {
    trackEvent: (params: AnalyticsEventParams) => void;
}

/**
 * Custom hook to track events with Google Analytics 4
 *
 * Provides a type-safe wrapper around the gtag function to track
 * user interactions and events throughout the application.
 * Only executes in browser environment when GA tracking ID is available.
 *
 * @returns Object with trackEvent method for sending analytics events
 *
 * @example
 * ```tsx
 * const { trackEvent } = useAnalytics();
 *
 * trackEvent({
 *   action: 'button_click',
 *   category: 'user_interaction',
 *   label: 'Save Button',
 *   value: 1
 * });
 * ```
 */
export const useAnalytics = (): UseAnalyticsReturn => {
    const trackEvent = useCallback(({ action, category, label, value }: AnalyticsEventParams) => {
        if (typeof window !== 'undefined' && gtag.GA_TRACKING_ID) {
            gtag.event({
                action,
                category: category || 'engagement',
                label: label || '',
                value: value || 0
            });
        }
    }, []);

    return {
        trackEvent
    };
};

