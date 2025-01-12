import { useEffect } from 'react';

import { Flex } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Playlist from '@/components/Playlist';
import Pomodoro from '@/components/Pomodoro';
import Todo from '@/components/Todo';

const Place = () => {
    const router = useRouter();
    const { name } = router.query as { name: string } || { name: '' };
    const title = `${name}'s place | daily.place`;

    useEffect(() => {
        const storage = localStorage.getItem('dailyPlaceNames');

        if (storage) {
            const found = storage?.split(',').find((element) => element === name);

            if (!found) {
                localStorage.setItem('dailyPlaceNames', storage?.concat(',', name?.toString()));
            }
        } else {
            localStorage.setItem('dailyPlaceNames', name?.toString());
        }
    }, [name]);

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
                    <Flex
                        gap={50}
                        my={50}
                        w="100%"
						direction={{ base: 'column', sm: 'row' }}
                    >
                        <Pomodoro name={name} title={title} />
                        <Todo name={name} />
                    </Flex>

                    <Flex w="100%">
                        <Playlist />
                    </Flex>
                </div>

                <div />
            </Flex>
        </>
    );
};

export default Place;
