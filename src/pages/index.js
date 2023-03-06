import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Title, Text, TextInput, Button, Flex } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

import FeaturesList from "@/components/FeaturesList";
import PlacesList from "@/components/PlacesList";

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
			>
				daily.place
			</Title>
			<Title
				order={2}
				mb={20}
				sx={_ => ({
					"@media (max-width: 450px)": {
						fontSize: 18,
					},
				})}
			>
				Create your perfect space to focus on your daily tasks
			</Title>

			<Flex
				align="center"
				gap={10}
				sx={_ => ({
					"@media (max-width: 450px)": {
						flexDirection: "column",
						gap: 10,
					},
				})}
			>
				<form
					onSubmit={form.onSubmit(({ name }) =>
						router.push(`/${name}`)
					)}
				>
					<TextInput
						placeholder="Your daily place name"
						size="sm"
						error
						{...form.getInputProps("name")}
						sx={_ => ({
							"@media (max-width: 576px)": {
								width: "100%",
							},
						})}
						rightSection={
							<Button
								variant="subtle"
								type="submit"
								compact
								radius="xs"
							>
								Create
							</Button>
						}
						rightSectionWidth={70}
					/>
				</form>
				<Text c="dimmed" fz={14}>
					or
				</Text>
				<Link href="/work" passHref legacyBehavior>
					<Button component="a" href="#">
						Check demo
					</Button>
				</Link>
			</Flex>
			{Boolean(places?.length) && (
				<PlacesList list={places} onRemovePlace={removePlace} />
			)}
			<FeaturesList />
		</div>
	);
};

export default Home;
