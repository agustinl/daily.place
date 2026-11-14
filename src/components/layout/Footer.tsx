import { FeedbackFish } from '@feedback-fish/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { placePath } from '@/helpers/placeName';
import { useChangeLocale } from '@/hooks/useChangeLocale';
import useLocalStorage from '@/hooks/useLocalStorage';
import { locales, localeNames } from '@/i18n';
import Logo from '../common/Logo';
import classes from './Footer.module.css';

const FEEDBACK_PROJECT_ID = '6a0ab10df6a57f';
const COFFEE_URL = 'https://www.buymeacoffee.com/daily.place';
const X_URL = 'https://x.com/agustinlautaro';
const REPO_URL = 'https://github.com/agustinl/daily.place';

const version = process.env.NEXT_PUBLIC_APP_VERSION;

type FooterProps = {
    variant?: 'full' | 'minimal';
    /** Lists the saved places (full variant only). */
    showPlaces?: boolean;
};

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes.link}>
        {children}
    </a>
);

const Footer = ({ variant = 'full', showPlaces = false }: FooterProps) => {
    const t = useTranslations();
    const { locale, changeLocale } = useChangeLocale();
    const [storedPlaces] = useLocalStorage<string>(STORAGE_KEYS.placeNames, '');
    const places = showPlaces && storedPlaces ? storedPlaces.split(',') : [];

    if (variant === 'minimal') {
        return (
            <footer className={classes.minimal}>
                <span>daily.place{version && ` · v${version}`}</span>
                <nav aria-label={t('footer.label')} className={classes.minimalLinks}>
                    <Link href="/changelog" className={classes.link}>
                        {t('nav.changelog')}
                    </Link>
                    <Link href="/contact" className={classes.link}>
                        {t('nav.contact')}
                    </Link>
                    <FeedbackFish projectId={FEEDBACK_PROJECT_ID}>
                        <button type="button" className={classes.link}>
                            {t('footer.sendFeedback')}
                        </button>
                    </FeedbackFish>
                    <ExternalLink href={COFFEE_URL}>{t('footer.buyMeACoffee')}</ExternalLink>
                </nav>
            </footer>
        );
    }

    return (
        <footer className={classes.full}>
            <div className={classes.inner}>
                <div className={classes.top}>
                    <div className={classes.brandColumn}>
                        <Link href="/" className={classes.brand}>
                            <Logo onDark />
                            daily.place
                        </Link>
                        <p>{t('footer.description')}</p>
                    </div>

                    <nav aria-label={t('footer.label')} className={classes.columns}>
                        <div className={classes.column}>
                            <span className={classes.columnTitle}>{t('footer.product')}</span>
                            <Link href="/#tools" className={classes.link}>
                                {t('nav.tools')}
                            </Link>
                            <Link href="/" className={classes.link}>
                                {t('footer.createPlace')}
                            </Link>
                            <Link href="/changelog" className={classes.link}>
                                {t('nav.changelog')}
                            </Link>
                        </div>

                        {places.length > 0 && (
                            <div className={classes.column}>
                                <span className={classes.columnTitle}>
                                    {t('footer.yourPlaces')}
                                </span>
                                {places.map((place) => (
                                    <Link
                                        key={place}
                                        href={placePath(place)}
                                        className={classes.link}
                                    >
                                        {place}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className={classes.column}>
                            <span className={classes.columnTitle}>{t('footer.help')}</span>
                            <Link href="/contact" className={classes.link}>
                                {t('nav.contact')}
                            </Link>
                            <FeedbackFish projectId={FEEDBACK_PROJECT_ID}>
                                <button type="button" className={classes.link}>
                                    {t('footer.sendFeedback')}
                                </button>
                            </FeedbackFish>
                            <ExternalLink href={`${REPO_URL}/issues`}>
                                {t('footer.reportBug')}
                            </ExternalLink>
                        </div>

                        <div className={classes.column}>
                            <span className={classes.columnTitle}>{t('footer.community')}</span>
                            <ExternalLink href={X_URL}>X / Twitter</ExternalLink>
                            <ExternalLink href={REPO_URL}>GitHub</ExternalLink>
                            <ExternalLink href={COFFEE_URL}>
                                {t('footer.buyMeACoffee')}
                            </ExternalLink>
                        </div>
                    </nav>
                </div>

                <div className={classes.bottom}>
                    <span>
                        {t('footer.madeBy')}{' '}
                        <a
                            href={X_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.author}
                        >
                            Agustín
                        </a>
                        {version && ` · v${version}`}
                    </span>
                    <div
                        role="group"
                        aria-label={t('footer.language')}
                        className={classes.languages}
                    >
                        {locales.map((loc) => (
                            <button
                                key={loc}
                                type="button"
                                lang={loc}
                                title={localeNames[loc]}
                                aria-pressed={locale === loc}
                                onClick={() => changeLocale(loc)}
                                className={classes.language}
                            >
                                {loc.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
