import { useCallback } from 'react';

import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Locale } from '@/i18n';

/** Current locale plus a setter that also reports the change to analytics. */
export const useChangeLocale = () => {
    const { locale, setLocale } = useLanguageContext();
    const { trackEvent } = useAnalytics();

    const changeLocale = useCallback(
        async (newLocale: Locale) => {
            await setLocale(newLocale);

            trackEvent({
                action: 'language_changed',
                category: 'settings',
                label: `Changed to ${newLocale}`
            });
        },
        [setLocale, trackEvent]
    );

    return { locale, changeLocale };
};
