import { useRef } from 'react';
import { Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    IconArrowRight,
    IconClock,
    IconCloudUpload,
    IconHeadphones,
    IconKeyboard,
    IconListCheck,
    IconMoon,
    IconWorld
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import HeroPreview from '@/components/home/HeroPreview';
import { placeNameValidator, placePath } from '@/helpers/placeName';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import classes from './Home.module.css';

const PLACE_INPUT_ID = 'place-name';

const STEPS = ['1', '2', '3'] as const;

// Feature list of the home page: `home.<tool>Title` / `home.<tool>Description` messages
const TOOLS = [
    { key: 'tool1', Icon: IconClock },
    { key: 'tool2', Icon: IconListCheck },
    { key: 'tool3', Icon: IconHeadphones },
    { key: 'tool4', Icon: IconKeyboard },
    { key: 'tool5', Icon: IconCloudUpload },
    { key: 'tool6', Icon: IconMoon },
    { key: 'tool7', Icon: IconWorld }
] as const;

const Home = () => {
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const t = useTranslations();
    const { places } = useConvexPlaces();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        initialValues: {
            name: ''
        },
        validate: {
            name: placeNameValidator(t)
        }
    });

    const { error, ...inputProps } = form.getInputProps('name');

    const focusPlaceInput = (event: React.MouseEvent) => {
        event.preventDefault();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputRef.current?.focus({ preventScroll: true });
    };

    return (
        <>
            <section className={`${classes.container} ${classes.hero}`}>
                <div className={classes.heroContent}>
                    <span className={classes.pill}>{t('home.freeMessage')}</span>
                    <h1 className={classes.title}>{t('home.subtitle')}</h1>
                    <p className={classes.lead}>{t('home.heroDescription')}</p>

                    <form
                        className={classes.form}
                        onSubmit={form.onSubmit(({ name: rawName }) => {
                            const name = rawName.trim();
                            trackEvent({
                                action: 'place_created',
                                category: 'place',
                                label: `New place created: ${name}`
                            });
                            router.push(`/${name}`);
                        })}
                    >
                        <label htmlFor={PLACE_INPUT_ID} className={classes.label}>
                            {t('home.createLabel')}
                        </label>
                        <div className={classes.field} data-invalid={error ? true : undefined}>
                            <div className={classes.inputWrapper}>
                                <span className={classes.prefix}>{t('common.appName')}/</span>
                                <input
                                    {...inputProps}
                                    ref={inputRef}
                                    id={PLACE_INPUT_ID}
                                    type="text"
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    placeholder={t('home.createPlaceholder')}
                                    aria-invalid={error ? true : undefined}
                                    aria-describedby={error ? `${PLACE_INPUT_ID}-error` : undefined}
                                    className={classes.input}
                                />
                            </div>
                            <Button
                                type="submit"
                                h={52}
                                px={24}
                                fz={16}
                                fw={600}
                                className={classes.submit}
                                rightSection={<IconArrowRight size={18} />}
                                vars={() => ({
                                    root: {
                                        '--button-bg': 'var(--dp-accent)',
                                        '--button-hover': 'var(--dp-accent-hover)',
                                        '--button-color': 'var(--dp-accent-contrast)'
                                    }
                                })}
                            >
                                {t('home.createButton')}
                            </Button>
                        </div>
                        {error && (
                            <p
                                id={`${PLACE_INPUT_ID}-error`}
                                role="alert"
                                className={classes.error}
                            >
                                {error}
                            </p>
                        )}
                    </form>

                    {places.length > 0 && (
                        <div className={classes.places}>
                            <span className={classes.placesLabel}>{t('home.myPlaces')}</span>
                            {places.map((place) => (
                                <Link key={place} href={placePath(place)} className={classes.chip}>
                                    {place}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <HeroPreview />
            </section>

            <section aria-labelledby="how-it-works-title" className={classes.band}>
                <div className={`${classes.container} ${classes.section}`}>
                    <div className={classes.sectionHeader}>
                        <p className={classes.eyebrow}>{t('home.howItWorks')}</p>
                        <h2 id="how-it-works-title" className={classes.sectionTitle}>
                            {t('home.howItWorksTitle')}
                        </h2>
                    </div>
                    <ol className={classes.steps}>
                        {STEPS.map((step) => (
                            <li key={step} className={classes.step}>
                                <span aria-hidden="true" className={classes.stepNumber}>
                                    0{step}
                                </span>
                                <h3 className={classes.cardTitle}>{t(`home.step${step}Title`)}</h3>
                                <p className={classes.cardText}>{t(`home.description${step}`)}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section
                id="tools"
                aria-labelledby="tools-title"
                className={`${classes.container} ${classes.section}`}
            >
                <div className={classes.sectionHeader}>
                    <p className={classes.eyebrow}>{t('home.tools')}</p>
                    <h2 id="tools-title" className={classes.sectionTitle}>
                        {t('home.toolsTitle')}
                    </h2>
                </div>
                <ul className={classes.tools}>
                    {TOOLS.map(({ key, Icon }, index) => (
                        <li
                            key={key}
                            className={classes.tool}
                            data-featured={index === 0 || undefined}
                        >
                            <span aria-hidden="true" className={classes.toolIcon}>
                                <Icon size={22} />
                            </span>
                            <h3 className={classes.cardTitle}>{t(`home.${key}Title`)}</h3>
                            <p className={classes.cardText}>{t(`home.${key}Description`)}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={`${classes.container} ${classes.ctaSection}`}>
                <div className={classes.cta}>
                    <div className={classes.ctaText}>
                        <h2 className={classes.ctaTitle}>{t('home.ctaTitle')}</h2>
                        <p className={classes.ctaDescription}>{t('home.ctaDescription')}</p>
                    </div>
                    <a
                        href={`#${PLACE_INPUT_ID}`}
                        onClick={focusPlaceInput}
                        className={classes.ctaButton}
                    >
                        {t('home.ctaButton')}
                    </a>
                </div>
            </section>
        </>
    );
};

export default Home;
