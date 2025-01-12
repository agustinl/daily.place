import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/constants/theme';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as gtag from '../lib/gtag';
import Layout from '@/components/layout/Layout';
import Script from 'next/script';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <title>daily.place</title>
                <meta name="title" content="daily.place" />
                <meta
                    name="description"
                    content="Create your perfect space to focus on your daily tasks."
                />

                <meta property="og:site_name" content="Daily place" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://daily.place/" />
                <meta property="og:title" content="daily.place" />
                <meta
                    property="og:description"
                    content="Create your perfect space to focus on your daily tasks."
                />
                <meta
                    property="og:image"
                    content="https://daily.place/banner-light.jpg"
                    key="ogImage"
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://daily.place/" />
                <meta name="twitter:title" content="daily.place" />
                <meta
                    name="twitter:description"
                    content="Create your perfect space to focus on your daily tasks."
                />
                <meta
                    name="twitter:image"
                    content="https://daily.place/banner-light.jpg"
                    key="twImage"
                />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
				<Script defer data-domain="daily.place" src="https://plausible.io/js/script.pageview-props.tagged-events.js"/>
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gtag.GA_TRACKING_ID}', {
                                    page_path: window.location.pathname,
                                });
                            `
                    }}
                />
            </Head>
            <MantineProvider theme={theme}>
                <Notifications position="top-center" color="orange" autoClose={60000} />
                <Layout>
                    <style global jsx>{`
                        html,
                        body,
                        div#__next {
                            height: 100%;
                            background: light-dark(
                                var(--mantine-color-gray-0),
                                var(--mantine-color-black)
                            );
                        }
                    `}</style>
                    <Component {...pageProps} />
                </Layout>
            </MantineProvider>
        </>
    );
}
