import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Flex, Text, useMantineColorScheme, Grid, Anchor } from "@mantine/core";
import DateAndTime from "@/components/DateAndTime";
import Places from "../common/Places";
import ThemeToggle from "../common/ThemeToggle";
import ForkPlace from "../modals/ForkPlace";
import Action from "../common/Action";
import { IconBrandTwitter } from "@tabler/icons";
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

	return (
		<>
			<Grid justify="center" align="center" w="100%" m={0}>
				<Grid.Col
					xs={4}
					span={12}
					p={0}
					sx={_ => ({
						"@media (max-width: 576px)": {
							marginBottom: 20,
						},
					})}
				>
					<Flex align="center" gap={15} justify="flex-start">
						{router?.pathname !== "/" && (
							<Link href="/" passHref legacyBehavior>
								<Anchor inherit variant="text">
									<Image
										alt="Daily place logo"
										src={
											dark
												? "/logo-dark.svg"
												: "/logo-light.svg"
										}
										width={20}
										height={20}
									/>
								</Anchor>
							</Link>
						)}
						{name && <DateAndTime />}
					</Flex>
				</Grid.Col>
				{name && (
					<>
						<Grid.Col xs={4} span={6} p={0}>
							<Text
								fz={18}
								fw={500}
								ta="center"
								sx={_ => ({
									"@media (max-width: 576px)": {
										textAlign: "left",
									},
								})}
							>
								{name}&apos;s{" "}
								<Text span c="dimmed">
									place
								</Text>
							</Text>
						</Grid.Col>
					</>
				)}
				<Grid.Col xs="auto" span="auto" p={0}>
					<Flex justify="flex-end" gap={15}>
						{name && (
							<>
								<Action
									component="a"
									target="_blank"
									rel="noopener noreferrer"
									href={`https://twitter.com/intent/tweet?text=${name}'s place by&url=https://daily.place/${name}`}
									color="blue"
									variant="subtle"
								>
									<IconBrandTwitter size={18} />
								</Action>
								<ForkPlace name={name} />
							</>
						)}
						{storage && (
							<Places
								items={storage?.split(",")}
								setItems={setStorage}
								name={name}
							/>
						)}
						<ThemeToggle />
					</Flex>
				</Grid.Col>
			</Grid>
		</>
	);
};

export default NavBar;
