import { useState, lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';

import { Alert, Anchor, Flex, Loader, Center } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Pomodoro from '@/components/Pomodoro';
import Todo from '@/components/Todo';
import { usePlaceNames } from '@/hooks/usePlaceNames';

// Lazy load del componente Playlist ya que contiene ReactPlayer
const Playlist = lazy(() => import('@/components/Playlist'));

const Place = () => {
    const router = useRouter();
    const { name } = (router.query as { name: string }) || { name: '' };
    const title = `${name}'s place | daily.place`;
    const [showAlert, setShowAlert] = useState(true);
    const t = useTranslations();

    // Automatic place name management
    usePlaceNames(name);

    if (!name) return null;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    property="og:image"
                    content={`https://daily.place/api/og?title=${title}`}
                    key="ogImage"
                />
                <meta
                    name="twitter:image"
                    content={`https://daily.place/api/og?title=${title}`}
                    key="twImage"
                />
            </Head>

            <Flex direction="column" justify="space-between" w="100%">
                <div>
                    <Flex gap={50} my={50} w="100%" direction={{ base: 'column', sm: 'row' }}>
                        <Pomodoro name={name} title={title} />
                        <Todo name={name} />
                    </Flex>

                    <Suspense
                        fallback={
                            <Center w="100%" py={50}>
                                <Loader size="md" />
                            </Center>
                        }
                    >
                        <Flex w="100%">
                            <Playlist />
                        </Flex>
                    </Suspense>
                </div>

                <div />
            </Flex>
            {showAlert && (
                <Alert
                    variant="light"
                    title={t('alerts.enjoyingTitle')}
                    mb="xl"
                    w="100%"
                    withCloseButton
                    onClose={() => setShowAlert(false)}
                >
                    {t('alerts.enjoyingMessage')}{' '}
                    <Anchor href="http://buymeacoffee.com/daily.place" target="_blank">
                        {t('alerts.yourContribution')}
                    </Anchor>{' '}
                    {t('alerts.wouldBeHelpful')}
                </Alert>
            )}
        </>
    );
};

export default Place;
