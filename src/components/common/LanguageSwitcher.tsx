import { Menu } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { locales, localeNames, localeFlags, Locale } from '@/i18n';
import { useAnalytics } from '@/hooks/useAnalytics';
import Action from './Action';

const LanguageSwitcher = () => {
    const { locale, setLocale } = useLanguageContext();
    const { trackEvent } = useAnalytics();

    const handleLocaleChange = async (newLocale: Locale) => {
        await setLocale(newLocale);

        trackEvent({
            action: 'language_changed',
            category: 'settings',
            label: `Changed to ${newLocale}`
        });
    };

    return (
        <Menu width={200} withArrow trigger="hover">
            <Menu.Target>
                <Action aria-label="Change language">
                    <IconLanguage size={18} />
                </Action>
            </Menu.Target>

            <Menu.Dropdown>
                {locales.map((loc) => (
                    <Menu.Item
                        key={loc}
                        onClick={() => handleLocaleChange(loc)}
                        leftSection={<span style={{ fontSize: '16px' }}>{localeFlags[loc]}</span>}
                        fw={locale === loc ? 600 : 400}
                        c={locale === loc ? 'orange' : 'inherit'}
                    >
                        {localeNames[loc]}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default LanguageSwitcher;

