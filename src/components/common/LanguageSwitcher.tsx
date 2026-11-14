import { Menu } from '@mantine/core';
import { useChangeLocale } from '@/hooks/useChangeLocale';
import { locales, localeNames, localeFlags } from '@/i18n';
import Action from './Action';

const LanguageSwitcher = () => {
    const { locale, changeLocale } = useChangeLocale();

    return (
        <Menu width={200} withArrow trigger="hover">
            <Menu.Target>
                <Action aria-label="Change language" variant="default" size={44} fz={14} fw={500}>
                    {locale.toUpperCase()}
                </Action>
            </Menu.Target>

            <Menu.Dropdown>
                {locales.map((loc) => (
                    <Menu.Item
                        key={loc}
                        onClick={() => changeLocale(loc)}
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
