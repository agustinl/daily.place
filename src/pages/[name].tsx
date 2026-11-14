import { lazy, Suspense } from 'react';

import { Loader, Center } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Pomodoro from '@/components/Pomodoro';
import Todo from '@/components/Todo';
import { usePlaceNames } from '@/hooks/usePlaceNames';
import classes from './Place.module.css';

// Lazy load the Playlist component because it contains ReactPlayer
const Playlist = lazy(() => import('@/components/Playlist'));

const Place = () => {
    const router = useRouter();
    const { name } = (router.query as { name: string }) || { name: '' };
    const title = `${name}'s place | daily.place`;
    const ogImage = `https://daily.place/api/og?title=${encodeURIComponent(title)}`;

    usePlaceNames(name);

    if (!name) return null;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:image" content={ogImage} key="ogImage" />
                <meta name="twitter:image" content={ogImage} key="twImage" />
            </Head>

            <div className={classes.columns}>
                <Pomodoro name={name} title={title} />
                <Todo name={name} />
            </div>

            <Suspense
                fallback={
                    <Center w="100%" py={50}>
                        <Loader size="md" />
                    </Center>
                }
            >
                <Playlist />
            </Suspense>
        </>
    );
};

export default Place;
