import { IconBrandX } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import { enUS, es, pt } from 'date-fns/locale';
import { render } from 'datocms-structured-text-to-html-string';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useTranslations } from 'next-intl';

import { useLanguageContext } from '@/contexts/LanguageContext';
import { Locale } from '@/i18n';
import { getChangelog } from '@/lib/datocms';
import classes from './Changelog.module.css';
import page from './Page.module.css';

type ChangelogRecord = {
    title: string;
    version: string;
    /** ISO date from the CMS, formatted on the client in the reader's language. */
    date: string | null;
    id: string;
    content: any;
    items: any;
};

const DATE_FORMATS: Record<Locale, { locale: typeof enUS; pattern: string }> = {
    en: { locale: enUS, pattern: 'MMMM d, yyyy' },
    es: { locale: es, pattern: "d 'de' MMMM, yyyy" },
    pt: { locale: pt, pattern: "d 'de' MMMM, yyyy" }
};

// Empty structured text fields come as null and can't be rendered
const toHtml = (field: { value?: any } | null | undefined) =>
    field?.value ? render(field.value) || '' : '';

export const getStaticProps = (async () => {
    const data = (await getChangelog()) || [];

    const logs = data?.data?.allChangelogs?.map((obj: ChangelogRecord) => ({
        ...obj,
        date: obj?.date ?? null
    }));

    return {
        props: {
            data: logs || []
        }
    };
}) satisfies GetStaticProps;

const Changelog = ({ data }: { data: ChangelogRecord[] }) => {
    const t = useTranslations();
    const { locale } = useLanguageContext();
    const title = `${t('nav.changelog')} | daily.place`;

    const formatDate = (date: string | null) => {
        if (!date) return null;
        // parseISO reads date-only values as local dates, so the day never shifts
        const { locale: dateLocale, pattern } = DATE_FORMATS[locale];
        return format(parseISO(date), pattern, { locale: dateLocale });
    };

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={t('changelog.description')} />
            </Head>

            <div className={page.header}>
                <div className={page.intro}>
                    <p className={page.eyebrow}>{t('nav.changelog')}</p>
                    <h1 className={page.title}>{t('changelog.title')}</h1>
                    <p className={page.lead}>{t('changelog.description')}</p>
                </div>
                <a
                    href="https://x.com/agustinlautaro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.follow}
                >
                    <IconBrandX size={16} aria-hidden="true" />
                    {t('changelog.followOnX')}
                </a>
            </div>

            <div className={classes.list}>
                {data.length === 0 && <p className={classes.empty}>{t('changelog.empty')}</p>}

                {data.map((entry, index) => {
                    const isLatest = index === 0;

                    return (
                        <article
                            key={entry.id}
                            className={classes.entry}
                            data-latest={isLatest || undefined}
                            aria-labelledby={`release-${entry.id}`}
                        >
                            <div className={classes.meta}>
                                <span className={classes.version}>{entry.version}</span>
                                {entry.date && (
                                    <time dateTime={entry.date} className={classes.date}>
                                        {formatDate(entry.date)}
                                    </time>
                                )}
                                {isLatest && (
                                    <span className={classes.latest}>{t('changelog.latest')}</span>
                                )}
                            </div>
                            <div className={classes.body}>
                                <h2 id={`release-${entry.id}`} className={classes.entryTitle}>
                                    {entry.title}
                                </h2>
                                {[entry.content, entry.items].map((field, fieldIndex) => {
                                    const html = toHtml(field);
                                    return html ? (
                                        <div
                                            key={fieldIndex}
                                            className={classes.content}
                                            dangerouslySetInnerHTML={{ __html: html }}
                                        />
                                    ) : null;
                                })}
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
};

export default Changelog;
