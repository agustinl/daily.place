import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLanguage } from '@/hooks/useLanguage';
import { Locale } from '@/i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguageContext = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguageContext must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const { locale, setLocale, messages } = useLanguage();
    // Explicit time zone avoids next-intl's environment fallback: UTC on the server,
    // then the browser's zone once mounted (so hydration output matches)
    const [timeZone, setTimeZone] = useState('UTC');

    useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    }, []);

    return (
        <LanguageContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
                {children}
            </NextIntlClientProvider>
        </LanguageContext.Provider>
    );
};

