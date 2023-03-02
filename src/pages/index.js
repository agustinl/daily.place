import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	Title,
	Text,
	TextInput,
	Button,
	Badge,
	Flex,
	ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons";
import { useForm, isNotEmpty } from "@mantine/form";
import List from "@/components/List";
import Question from "@/components/common/Question";

const Home = () => {
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		const storage = localStorage.getItem("dailyPlaceNames");

		if (storage) {
			const found = storage?.split(",");
			setPlaces(found);
		}
	}, []);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
		},
		validate: {
			name: isNotEmpty(),
		},
	});

	const removePlace = placeIndex => {
		const temporal_places = [...places];
		temporal_places.splice(placeIndex, 1);

		setPlaces(temporal_places);
		localStorage.setItem("dailyPlaceNames", temporal_places?.toString());
	};

	return (
		<div>
			<Title
				order={1}
				variant="gradient"
				gradient={{ from: "#f56d3b", to: "#e74863", deg: 90 }}
				fz={48}
				fw={700}
				sx={_ => ({
					"@media (max-width: 576px)": {
						fontSize: 36,
					},
				})}
			>
				daily.place
			</Title>
			<Text
				c="dimmed"
				my={20}
				sx={_ => ({
					"@media (max-width: 576px)": {
						fontSize: 14,
					},
				})}
			>
				<b>Create your perfect space to focus on your daily tasks.</b>
				<br />
				Ambient sounds, pomodoro timer and a to do list.
				<br />
				Everything is saved and available in your browser under a name
				of your choosing.
				<Question />
			</Text>
			<form
				onSubmit={form.onSubmit(({ name }) => router.push(`/${name}`))}
			>
				<TextInput
					w="60%"
					placeholder="Enter your daily place name..."
					size="md"
					mb={10}
					error
					{...form.getInputProps("name")}
					sx={_ => ({
						"@media (max-width: 576px)": {
							width: "100%",
						},
					})}
					rightSection={
						<Button variant="subtle" type="submit">
							Create
						</Button>
					}
					rightSectionWidth={90}
				/>
			</form>
			<Flex
				align="center"
				gap={10}
				my={15}
				w="60%"
				wrap="wrap"
				sx={_ => ({
					"@media (max-width: 680px)": {
						width: "100%",
					},
				})}
			>
				{Boolean(places?.length) && (
					<Text fz={14} fw={500} c="dimmed">
						My last places:
					</Text>
				)}
				{places?.map((place, index) => (
					<Flex key={index} align="center">
						<Badge
							size="md"
							radius="xs"
							variant="gradient"
							gradient={{
								from: "#f56d3b",
								to: "#e74863",
								deg: 90,
							}}
							onClick={() => router.push(`/${place}`)}
							sx={{ cursor: "pointer" }}
						>
							{place}
						</Badge>
						<ActionIcon
							size="sm"
							radius="xs"
							variant="light"
							color="red"
							onClick={() => removePlace(index)}
						>
							<IconX size={10} />
						</ActionIcon>
					</Flex>
				))}
			</Flex>
			<List />
		</div>
	);
};

export default Home;
