import { createContext, useContext, ReactNode } from 'react';
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

    return (
        <LanguageContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </LanguageContext.Provider>
    );
};

