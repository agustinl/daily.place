import Head from "next/head";
import { Flex, Title, Text, Badge, List, Divider } from "@mantine/core";
import GoBack from "@/components/layout/GoBack";
import { format } from "date-fns";

const Changelog = () => {
	return (
		<>
			<Head>
				<title>Changelog | daily.place</title>
				<meta name="title" content="Changelog | daily.place" />
			</Head>
			<div>
				<GoBack />
				<div>
					<Title order={1} fz={48} fw={700} mb={50}>
						Changelog
					</Title>

					<Flex
						gap={25}
						sx={_ => ({
							"@media (max-width: 768px)": {
								flexDirection: "column",
								gap: 10,
							},
						})}
					>
						<Flex
							w="20%"
							direction="column"
							align="start"
							gap={10}
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Badge color="green" size="lg" radius="sm">
								v2.0.0
							</Badge>
							<Text fz="sm" c="dimmed" component="p">
								{format(new Date("2/24/2023"), "LLLL d, yyyy")}
							</Text>
						</Flex>
						<Flex
							gap={0}
							direction="column"
							w="80%"
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Title order={2} mb={25}>
								v2 Launch 🤘
							</Title>
							<List size="sm" withPadding>
								<List.Item>
									🔃 Support to re-order tasks.
								</List.Item>
								<List.Item>
									Replaced checkboxs in To-Do list to prevent
									flicker when drag-n-drop.
								</List.Item>
								<List.Item>
                                    Added our own primary colors.
								</List.Item>
								<List.Item>
									Replaced RingProgress with step bar in To-Do list.
								</List.Item>
								<List.Item>
                                    Re-ordered welcome header titles.
								</List.Item>
								<List.Item>
                                    <b>Fix:</b> theme mode persist.
								</List.Item>
								<List.Item>
                                    Add Google Analytics.
								</List.Item>
							</List>
							<Divider my={25} />
						</Flex>
					</Flex>

					<Flex
						gap={25}
						sx={_ => ({
							"@media (max-width: 768px)": {
								flexDirection: "column",
								gap: 10,
							},
						})}
					>
						<Flex
							w="20%"
							direction="column"
							align="start"
							gap={10}
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Badge color="gray" size="lg" radius="sm">
								v1.1.0
							</Badge>
							<Text fz="sm" c="dimmed" component="p">
								{format(new Date("2/20/2023"), "LLLL d, yyyy")}
							</Text>
						</Flex>
						<Flex
							gap={0}
							direction="column"
							w="80%"
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Title order={2} mb={25}>
								Playlist enhancement
							</Title>
							<List size="sm" withPadding>
								<List.Item>
									🌌 Add{" "}
									<a
										href="https://developer.mozilla.org/es/docs/Web/Progressive_web_apps"
										target="_blank"
										rel="noopener noreferrer"
									>
										{" "}
										PWA{" "}
									</a>{" "}
									support.
								</List.Item>
								<List.Item>
									Use{" "}
									<a
										href="https://github.com/goldfire/howler.js"
										target="_blank"
										rel="noopener noreferrer"
									>
										howler
									</a>{" "}
									library.
								</List.Item>
								<List.Item>
									Add <b>lofi</b> sound.
								</List.Item>
								<List.Item>
									Add support to change volume.
								</List.Item>
								<List.Item>
									<b>Fix:</b> stop audio when page change.
								</List.Item>
								<List.Item>
									Add ring sound when pomodoro timer ends.
								</List.Item>
								<List.Item>
									Reduce audios and gifs size.
								</List.Item>
							</List>
							<Divider my={25} />
						</Flex>
					</Flex>

					<Flex
						gap={25}
						sx={_ => ({
							"@media (max-width: 768px)": {
								flexDirection: "column",
								gap: 10,
							},
						})}
					>
						<Flex
							w="20%"
							direction="column"
							align="start"
							gap={10}
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Badge color="gray" size="lg" radius="sm">
								v1.0.0
							</Badge>
							<Text fz="sm" c="dimmed" component="p">
								{format(new Date("2/17/2023"), "LLLL d, yyyy")}
							</Text>
						</Flex>
						<Flex
							gap={0}
							direction="column"
							w="80%"
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Title order={2} mb={25}>
								Launch
							</Title>
							<a
								href="https://www.producthunt.com/posts/daily-place?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-daily&#0045;place"
								target="_blank"
                                rel="noopener noreferrer"
							>
								<img
									src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=380723&theme=light"
									alt="daily&#0046;place - Create&#0032;your&#0032;perfect&#0032;space&#0032;to&#0032;focus&#0032;on&#0032;your&#0032;daily&#0032;tasks | Product Hunt"
									style={{
										width: "250px",
										height: "54px",
									}}
									width="250"
									height="54"
								/>
							</a>
							<Text fz="sm" component="p">
								The objective of <b>daily.place</b> is to have
								within reach of a single page the{" "}
								<b>
									necessary tools to be able to have a space
									for concentration
								</b>
								.<br />
								Also, timer settings and to-do list are saved to
								browser storage under the name you choose for
								your place. As long as you don&apos;t clean up
								your storage or use the incognito app, your
								settings will be available.
							</Text>
							<List size="sm" mt={25} withPadding>
								<List.Item>
									Music list with different ambient modes
									(rain, forest, lo-fi, coffee shop, etc.)
								</List.Item>
								<List.Item>
									Pomodoro timer with short and long pause,
									fully configurable.
								</List.Item>
								<List.Item>
									To-do list with progress ring.
								</List.Item>
								<List.Item>
									☀️ Light and 🌑 dark mode.
								</List.Item>
								<List.Item>
									Configurable name + daily greeting and
									current time and date.
								</List.Item>
							</List>
							<Divider my={25} />
						</Flex>
					</Flex>
				</div>
			</div>
		</>
	);
};

export default Changelog;
