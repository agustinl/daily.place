import { Flex, Title } from "@mantine/core";

import DateAndTime from "@/components/DateAndTime";
import { format } from "date-fns";

const SecondaryNavBar = ({ place }) => {
	const getGreeting = () => {
		const hour = format(new Date(), "H");
		let greeting;

		if (hour >= 6 && hour < 12) {
			greeting = "🌤️";
		} else if (hour >= 12 && hour < 19) {
			greeting = "☀️";
		} else {
			greeting = "🌑";
		}

		return greeting;
	};

	return (
		<Flex align="center" justify="space-between" w="100%">
			<Title
				order={1}
				fz={28}
				variant="gradient"
				gradient={{
					from: "dark.5",
					to: "dark.4",
				}}
			>
				{place}
			</Title>

			<Flex align="center" gap={5}>
				<DateAndTime />
				{getGreeting()}
			</Flex>
		</Flex>
	);
};

export default SecondaryNavBar;
