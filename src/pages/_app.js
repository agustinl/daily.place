import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import splitbee from "@splitbee/web";
import * as gtag from "../lib/gtag";

import Layout from "@/components/layout/Layout";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps, mode }) {
	const router = useRouter();
	const [colorScheme, setColorScheme] = useState(mode);

	useEffect(() => {
		splitbee.init({
			scriptUrl: "/bee.js",
			apiUrl: "/_hive",
		});
	}, []);

	useEffect(() => {
		const handleRouteChange = url => {
			gtag.pageview(url);
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	const toggleColorScheme = value => {
		const nextColorScheme =
			value || (colorScheme === "dark" ? "light" : "dark");
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
							backgroundColor:
								theme.colorScheme === "dark"
									? theme.black
									: theme.white,
							color:
								theme.colorScheme === "dark"
									? theme.white
									: theme.black,
							lineHeight: theme.lineHeight,
						},
					}),
					colorScheme: colorScheme,
					fontFamily: inter.style.fontFamily,
					headings: {
						fontFamily: inter.style.fontFamily,
						sizes: {
							h1: { fontWeight: 500, fontSize: 32 },
							h2: { fontWeight: 600, fontSize: 20 },
						},
					},
					colors: {
						brand: [
							"#fff0e7",
							"#fee0ca",
							"#fec0a4",
							"#ffa07b",
							"#f28a61",
							"#f56d38",
							"#f16345",
							"#ee5851",
							"#ea4b5f",
							"#e2394e",
						],
					},
					primaryColor: "brand",
					components: {
						Modal: {
							styles: {
								title: { fontWeight: 500 },
							},
						},
						TextInput: {
							styles: {
								label: {
									marginBottom: 5,
								}
							},
						},
						Textarea: {
							styles: {
								label: {
									marginBottom: 5,
								},
							},
						},
					},
				}}
			>
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
					<link rel="manifest" href="/manifest.json" />
					<meta
						name="theme-color"
						content={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
					></meta>
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
						<style global jsx>{`
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
					</Layout>
				</NotificationsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

App.getInitialProps = ({ ctx }) => ({
	mode: getCookie("daily-place-theme", ctx) || "light",
});
