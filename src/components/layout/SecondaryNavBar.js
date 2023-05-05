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
		<Flex align="center" justify="space-between" gap={20} w="100%" sx={_ => ({
            "@media (max-width: 560px)": {
                flexDirection: "column",
            },
        })}>
			<Title
                order={1}
                fz={28}
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
