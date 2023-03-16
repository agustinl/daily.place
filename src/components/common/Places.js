import { useState, useEffect } from "react";
import Link from "next/link";
import { CloseButton, Badge, Flex } from "@mantine/core";

const Places = () => {
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		const storage = localStorage.getItem("dailyPlaceNames");

		if (storage) {
			const found = storage?.split(",");
			setPlaces(found);
		}
	}, []);

	const removePlace = placeIndex => {
		const temporal_places = [...places];
		temporal_places.splice(placeIndex, 1);

		setPlaces(temporal_places);
		localStorage.setItem("dailyPlaceNames", temporal_places?.toString());
	};

	return (
		Boolean(places?.length) && (
			<Flex align="center" mb={20} gap={10}>
				{places?.map((place, index) => (
					<Flex key={index} align="center" gap={3}>
						<Link href={`/${place}`} passHref legacyBehavior>
							<Badge component="a" sx={{ cursor: "pointer" }}>
								{place}
							</Badge>
						</Link>
						<CloseButton
							size="xs"
							radius="lg"
							variant="subtle"
							color="red"
							onClick={() => removePlace(index)}
						/>
					</Flex>
				))}
			</Flex>
		)
	);
};

export default Places;
