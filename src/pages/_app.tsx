import { useState, useEffect } from "react";

import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Inter } from "@next/font/google";
import splitbee from "@splitbee/web";
import { Analytics } from "@vercel/analytics/react";
import { getCookie, setCookie } from "cookies-next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

import Layout from "@/components/layout/Layout";

import * as gtag from "../lib/gtag";

const inter = Inter({ subsets: ["latin"] });

type AppCustomProps = AppProps & {
	mode: ColorScheme;
};

export default function App({ Component, pageProps, mode }: AppCustomProps) {
	const router = useRouter();
	const [colorScheme, setColorScheme] = useState(mode);

	useEffect(() => {
		splitbee.init({
			scriptUrl: "/bee.js",
			apiUrl: "/_hive",
		});
	}, []);

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			gtag.pageview(url);
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	const toggleColorScheme = (value: ColorScheme) => {
		const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		setCookie("daily-place-theme", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	};

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					globalStyles: theme => ({
						body: {
							backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.colors.gray[0],
							color: theme.colorScheme === "dark" ? theme.white : theme.black,
							lineHeight: theme.lineHeight,
						},
						"ul li p": {
							marginBottom: "2px!important",
						},
						footer: {
							width: "100%",
						},
						a: {
							color: theme.colors.orange[6],
							textDecoration: "none",
						},
					}),
					colorScheme,
					fontFamily: inter.style.fontFamily,
					headings: {
						fontFamily: inter.style.fontFamily,
						sizes: {
							h1: {
								fontWeight: 600,
								fontSize: 50,
							},
							h2: {
								fontWeight: 400,
								fontSize: 23,
							},
							h3: {
								fontWeight: 500,
								fontSize: 27,
							},
							h4: {
								fontWeight: 600,
								fontSize: 20,
							},
						},
					},
					components: {
						Modal: {
							styles: {
								title: { fontWeight: 500, fontSize: 20 },
							},
						},
						TextInput: {
							styles: {
								label: {
									marginBottom: 5,
								},
							},
						},
						Textarea: {
							styles: {
								label: {
									marginBottom: 5,
								},
							},
						},
						Anchor: {
							defaultProps: {
								color: "orange.6",
							},
						},
					},
				}}
			>
				<Head>
					<title>daily.place</title>
					<meta
						name="title"
						content="daily.place"
					/>
					<meta
						name="description"
						content="Create your perfect space to focus on your daily tasks."
					/>

					<meta
						property="og:site_name"
						content="Daily place"
					/>
					<meta
						property="og:type"
						content="website"
					/>
					<meta
						property="og:url"
						content="https://daily.place/"
					/>
					<meta
						property="og:title"
						content="daily.place"
					/>
					<meta
						property="og:description"
						content="Create your perfect space to focus on your daily tasks."
					/>
					<meta
						property="og:image"
						content="https://daily.place/banner-light.jpg"
						key="ogImage"
					/>

					<meta
						name="twitter:card"
						content="summary_large_image"
					/>
					<meta
						name="twitter:url"
						content="https://daily.place/"
					/>
					<meta
						name="twitter:title"
						content="daily.place"
					/>
					<meta
						name="twitter:description"
						content="Create your perfect space to focus on your daily tasks."
					/>
					<meta
						name="twitter:image"
						content="https://daily.place/banner-light.jpg"
						key="twImage"
					/>

					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/favicon-16x16.png"
					/>
					<link
						rel="manifest"
						href="/manifest.json"
					/>
					<meta
						name="theme-color"
						content={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
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
                            `,
						}}
					/>
				</Head>
				<NotificationsProvider
					position="top-center"
					color="orange"
					autoClose={60000}
				>
					<Layout>
						<style
							global
							jsx
						>{`
							html,
							body,
							div#__next {
								height: 100%;
							}
						`}</style>
						<Script
							strategy="afterInteractive"
							src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
						/>
						<Component {...pageProps} />
						<Analytics />
					</Layout>
				</NotificationsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

App.getInitialProps = ({ ctx }) => ({
	mode: getCookie("daily-place-theme", ctx) || "light",
});
