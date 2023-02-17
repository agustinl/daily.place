import { useRouter } from "next/router";

import { Container, Anchor } from "@mantine/core";

const GoBack = () => {
	const router = useRouter();

	return (
		<Container p="xs">
			<Anchor
				c="dimmed"
				fz="xs"
				component="button"
				type="button"
				onClick={() => router.back()}
			>
				&#8592; Go Back
			</Anchor>
		</Container>
	);
};

export default GoBack;
