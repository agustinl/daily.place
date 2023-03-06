import Link from "next/link";
import { Text, Badge, Flex, ActionIcon, Anchor } from "@mantine/core";
import { IconX } from "@tabler/icons";

const PlacesList = ({ list, onRemovePlace }) => {
	return (
		<Flex
			align="center"
			gap={10}
			mt={20}
			mb={20}
			w="50vw"
			wrap="wrap"
			sx={_ => ({
				"@media (max-width: 680px)": {
					width: "100%",
				},
			})}
		>
			{Boolean(list?.length) && (
				<Text fz={14} c="dimmed">
					My last places:
				</Text>
			)}
			{list?.map((place, index) => (
				<Flex key={index} align="center" gap={3}>
					<Link href={`/${place}`} passHref legacyBehavior>
						<Anchor fz="sm" fw={500}>
							{place}
						</Anchor>
					</Link>
					<ActionIcon
						size="xs"
						variant="subtle"
						color="red"
						onClick={() => onRemovePlace(index)}
					>
						<IconX size={10} />
					</ActionIcon>
				</Flex>
			))}
		</Flex>
	);
};

export default PlacesList;
