import Head from "next/head";
import { Flex, Title, Text, Badge, List, Divider } from "@mantine/core";
import GoBack from "@/components/layout/GoBack";
import { format } from "date-fns";

import Data from "../../public/changelog.json";

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
					<Title order={1} fz={48} fw={700} mb={25}>
						Changelog
					</Title>

					<Flex align="center" gap={25} mb={25}>
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

                        <a href="https://www.buymeacoffee.com/daily.place"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=daily.place&button_colour=FF5F5F&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" /></a>
                    </Flex>

					{Object.values(Data)?.map((data, index) => (
						<Flex
							key={index}
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
								<Badge
									color={index > 0 && "gray"}
									size="lg"
									radius="sm"
								>
									{data?.version}
								</Badge>
								<Text fz="sm" c="dimmed" component="p">
									{format(
										new Date(data?.date),
										"LLLL d, yyyy"
									)}
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
								<Title order={2}>{data?.title}</Title>
								{data?.content && (
									<Text
										fz="sm"
										component="p"
										dangerouslySetInnerHTML={{
											__html: data?.content || "",
										}}
										mt={25}
									/>
								)}
								<List size="sm" withPadding mt={25}>
									{data?.list?.length > 0 &&
										data?.list?.map((item, i) => (
											<List.Item key={i}>
												<div
													dangerouslySetInnerHTML={{
														__html: item || "",
													}}
												></div>
											</List.Item>
										))}
								</List>
								<Divider my={25} />
							</Flex>
						</Flex>
					))}
				</div>
			</div>
		</>
	);
};

export default Changelog;
