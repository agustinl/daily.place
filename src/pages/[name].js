import { useRouter } from "next/router";
import Head from "next/head";

import { Flex, Title, Text } from "@mantine/core";

import Pomodoro from "@/components/Pomodoro";
import Todo from "@/components/Todo";
import Playlist from "@/components/Playlist";

import { format } from "date-fns";

const Place = () => {
	const router = useRouter();
	const { name } = router.query;
	const title = `${name}'s place | daily.place`;
	const place = `${name}'s place`;

	const getDate = () => {
		const today = format(new Date(), "LLL do, hh:mm aaa");

		return today;
	};

	const getGreeting = () => {
		const hour = format(new Date(), "H");
		let greeting;

		if (hour >= 6 && hour < 12) {
			greeting = "🌤️ Good morning";
		} else if (hour >= 12 && hour < 19) {
			greeting = "☀️ Good afternoon";
		} else {
			greeting = "🌑 Good evening";
		}

		return greeting;
	};

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div>
				<Flex mb={50} direction="column">
					<Title
						fw={600}
						sx={_ => ({
							"@media (max-width: 576px)": {
								fontSize: 28,
							},
						})}
					>
						{place}
					</Title>
					<Flex justify="space-between" align="center">
						<Text fz={14} fw={300} component="p" m={0}>
							{getGreeting()}
						</Text>

						<Text fz={14} fw={300} component="p" m={0}>
							{getDate()}
						</Text>
					</Flex>
				</Flex>

				<Flex w="100%" mb={50}>
					<Playlist />
				</Flex>
				<Flex
					gap={50}
					w="100%"
					sx={_ => ({
						"@media (max-width: 768px)": {
							flexDirection: "column",
						},
					})}
				>
					<Pomodoro name={name} />
					<Todo name={name} />
				</Flex>
			</div>
		</>
	);
};

export default Place;
