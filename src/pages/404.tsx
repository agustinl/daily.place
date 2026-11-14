import { IconArrowRight } from '@tabler/icons-react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Button from '@/components/common/Button';
import page from './Page.module.css';

const Custom404 = () => {
    const t = useTranslations();
    const title = `${t('404.title')} | daily.place`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <div className={page.header}>
                <div className={page.intro}>
                    <p className={page.eyebrow}>404</p>
                    <h1 className={page.title}>{t('404.title')}</h1>
                    <p className={page.lead}>{t('404.description')}</p>
                </div>
            </div>

            <Button component={Link} href="/" rightSection={<IconArrowRight size={18} />}>
                {t('404.backHome')}
            </Button>
        </>
    );
};

export default Custom404;
