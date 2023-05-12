import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Flex, Text, useMantineColorScheme, Grid, Anchor } from "@mantine/core";
import DateAndTime from "@/components/DateAndTime";
import Places from "../common/Places";
import ThemeToggle from "../common/ThemeToggle";
import ForkPlace from "../modals/ForkPlace";

import useLocalStorage from "@/hooks/useLocalStorage";

const NavBar = () => {
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";
	const router = useRouter();
    const { name } = router.query;
    const [storage, setStorage] = useLocalStorage("dailyPlaceNames", "", false);

	/* const getGreeting = () => {
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
	}; */

	return (<>
		<Grid justify="center" align="center" w="100%">
            <Grid.Col span={4}>
                <Flex align="center" gap={15}>
                    { router?.pathname !== "/" &&
                        <Link href="/" passHref legacyBehavior>
                            <Anchor inherit variant="text">
                                <Image
                                    alt="Daily place logo"
                                    src={
                                        dark ? "/logo-dark.svg" : "/logo-light.svg"
                                    }
                                    width={20}
                                    height={20}
                                />
                            </Anchor>
                        </Link> }
                    { name && <DateAndTime /> }
                </Flex>
            </Grid.Col>
            { name && <>
                <Grid.Col span={4}>
                    <Text fz={18} fw={500} ta="center">
                        {name}&apos;s{" "}
                        <Text span c="dimmed">
                            place
                        </Text>
                    </Text>
                </Grid.Col>
            </>}
			<Grid.Col span="auto">
				<Flex justify="flex-end" gap={15}>
                    { name && <ForkPlace name={name} /> }
					{ storage && <Places items={storage?.split(",")} setItems={setStorage} name={name} /> }
					<ThemeToggle />
				</Flex>
			</Grid.Col>
		</Grid>
	</>);
};

export default NavBar;
