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
							<Text fz="sm" component="p">
								The objective of <b>daily.place</b> is to have
								within the reach of a single page the necessary
								tools to be able to have{" "}
								<b>a space for concentration</b>.<br />
								In addition, the timer settings and the task
								list are saved in the browser&apos;s storage
								with the name you choose for your place. As long
								as you don&apos;t clean the storage or
								don&apos;t use the app in incognito, your
								settings will be available.
							</Text>
							<List size="sm" mt={25} withPadding>
								<List.Item>
									Music list with different ambient modes
									(rain, lofi, retrowave, coffee shop, etc.)
								</List.Item>
								<List.Item>
									Pomodoro timer with short and long break,
									fully configurable.
								</List.Item>
								<List.Item>
									To- do list with progress ring.
								</List.Item>
								<List.Item>
									☀️ Light and 🌑 dark mode.
								</List.Item>
								<List.Item>
									Configurable name + daily greeting and
									current hour and date.
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
