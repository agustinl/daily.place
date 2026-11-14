import { FeedbackFish } from '@feedback-fish/react';
import {
    IconArrowUpRight,
    IconBrandGithub,
    IconBrandX,
    IconCoffee,
    IconMessage
} from '@tabler/icons-react';
import Head from 'next/head';
import { useTranslations } from 'next-intl';

import classes from './Contact.module.css';
import page from './Page.module.css';

const FEEDBACK_PROJECT_ID = '6a0ab10df6a57f';

type Tone = 'inverse' | 'accent' | 'muted';

const CardContent = ({
    icon,
    title,
    description,
    external = false
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    external?: boolean;
}) => (
    <>
        <span className={classes.icon} aria-hidden="true">
            {icon}
        </span>
        <span className={classes.text}>
            <span className={classes.cardTitle}>{title}</span>
            <span className={classes.cardDescription}>{description}</span>
        </span>
        {external && <IconArrowUpRight size={18} className={classes.arrow} aria-hidden="true" />}
    </>
);

const LINKS: { href: string; tone: Tone; icon: React.ReactNode; key: string }[] = [
    {
        href: 'https://x.com/agustinlautaro',
        tone: 'inverse',
        icon: <IconBrandX size={22} />,
        key: 'x'
    },
    {
        href: 'https://github.com/agustinl/daily.place/issues',
        tone: 'muted',
        icon: <IconBrandGithub size={22} />,
        key: 'bug'
    },
    {
        href: 'https://www.buymeacoffee.com/daily.place',
        tone: 'accent',
        icon: <IconCoffee size={22} />,
        key: 'coffee'
    }
];

const Contact = () => {
    const t = useTranslations();
    const title = `${t('nav.contact')} | daily.place`;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={t('contact.description')} />
            </Head>

            <div className={page.header}>
                <div className={page.intro}>
                    <p className={page.eyebrow}>{t('nav.contact')}</p>
                    <h1 className={page.title}>{t('contact.title')}</h1>
                    <p className={page.lead}>{t('contact.description')}</p>
                </div>
            </div>

            <ul className={classes.cards}>
                <li>
                    <FeedbackFish projectId={FEEDBACK_PROJECT_ID}>
                        <button type="button" className={classes.card} data-tone="muted">
                            <CardContent
                                icon={<IconMessage size={22} />}
                                title={t('contact.feedbackTitle')}
                                description={t('contact.feedbackDescription')}
                            />
                        </button>
                    </FeedbackFish>
                </li>
                {LINKS.map(({ href, tone, icon, key }) => (
                    <li key={key}>
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.card}
                            data-tone={tone}
                        >
                            <CardContent
                                icon={icon}
                                title={t(`contact.${key}Title`)}
                                description={t(`contact.${key}Description`)}
                                external
                            />
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Contact;
