import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import DateAndTime from '@/components/DateAndTime';

import AuthButton from '../common/AuthButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Logo from '../common/Logo';
import Places from '../common/Places';
import ThemeToggle from '../common/ThemeToggle';
import classes from './NavBar.module.css';

const LINKS = [
    { href: '/#tools', label: 'nav.tools' },
    { href: '/changelog', label: 'nav.changelog' },
    { href: '/contact', label: 'nav.contact' }
] as const;

const NavBar = () => {
    const router = useRouter();
    const t = useTranslations();
    const { name } = router.query;

    if (name) {
        return (
            <header className={classes.header} data-variant="place">
                <div className={classes.side}>
                    <Link href="/" aria-label={t('nav.home')} className={classes.homeLink}>
                        <Logo size={28} />
                    </Link>
                    <DateAndTime />
                </div>
                <h1 className={classes.placeTitle}>
                    {name}&apos;s <span>place</span>
                </h1>
                <nav aria-label={t('nav.placeOptions')} className={classes.nav}>
                    <Places name={name as string} />
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <AuthButton />
                </nav>
            </header>
        );
    }

    return (
        <header className={classes.header}>
            <Link href="/" className={classes.brand}>
                <Logo />
                daily.place
            </Link>
            <nav aria-label={t('nav.main')} className={classes.nav}>
                {LINKS.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={classes.link}
                        aria-current={router.pathname === href ? 'page' : undefined}
                    >
                        {t(label)}
                    </Link>
                ))}
                <Places name="" />
                <LanguageSwitcher />
                <ThemeToggle />
                <AuthButton />
            </nav>
        </header>
    );
};

export default NavBar;
