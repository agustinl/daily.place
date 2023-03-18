import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { Flex, Title, Text } from "@mantine/core";

import Pomodoro from "@/components/Pomodoro";
import Todo from "@/components/Todo";
import Playlist from "@/components/Playlist";
import DateAndTime from "@/components/DateAndTime";

import { format } from "date-fns";

const Place = () => {
	const router = useRouter();
	const { name } = router.query;
	const title = `${name}'s place | daily.place`;
	const place = `${name}'s place`;

	useEffect(() => {
		const storage = localStorage.getItem("dailyPlaceNames");

		if (storage) {
			const found = storage?.split(",").find(element => element == name);

			if (!found) {
				localStorage.setItem(
					"dailyPlaceNames",
					storage?.concat(",", name)
				);
			}
		} else {
			localStorage.setItem("dailyPlaceNames", name);
		}
	}, [name]);

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
				<Flex direction="column">
					<Title order={1} mb={20}>
						{place}
					</Title>
					<Flex justify="space-between" align="center">
						<Text component="p" m={0} c="dimmed" fz={14}>
							{getGreeting()}
						</Text>

						<DateAndTime />
					</Flex>
				</Flex>
				<Flex
					gap={50}
					my={50}
					w="100%"
					sx={_ => ({
						"@media (max-width: 680px)": {
							flexDirection: "column",
						},
					})}
				>
					<Pomodoro name={name} />
					<Todo name={name} />
				</Flex>

				<Flex w="100%">
					<Playlist />
				</Flex>

				<Flex w="100%"></Flex>
			</div>
		</>
	);
};

export default Place;
