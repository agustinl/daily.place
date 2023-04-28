import { useRouter } from "next/router";

import {
	Title,
	Text,
	TextInput,
	Flex,
	createStyles,
	Grid,
	useMantineTheme,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

import Places from "@/components/common/Places";
import Social from "@/components/common/Social";
import Button from "@/components/common/Button";

const useStyles = createStyles((theme, _params) => {
	return {
		spanBold: {
			fontWeight: 700,
			color: theme.colorScheme === "dark" ? theme.white : theme.black,
			paddingRight: 5,
		},
	};
});

const Home = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
		},
		validate: {
			name: isNotEmpty(),
		},
	});

	return (
		<>
			<Flex
				w="100%"
				mih="calc(100vh - 60px)"
				direction="column"
                justify="center"
			>
				<Title
					order={1}
					sx={_ => ({
						"@media (max-width: 480px)": {
							fontSize: 42,
						},
					})}
                    variant="gradient"
                    gradient={{
                        from: "dark.7",
                        to: "dark.4",
                    }}
				>
					daily.place
				</Title>

				<Title
					order={2}
					mb={40}
                    c="gray.4"
					sx={_ => ({
						"@media (max-width: 480px)": {
							fontSize: 22,
						},
					})}
				>
					Create your perfect space to focus on your daily tasks
				</Title>
				<form
					onSubmit={form.onSubmit(({ name }) =>
						router.push(`/${name}`)
					)}
				>
					<Flex align="center" mb={20} gap={10}>
						<TextInput
							placeholder="Name of your space"
							size="lg"
                            radius="xl"
							error
							{...form.getInputProps("name")}
						/>
						<Button
							type="submit"
							px={30}
                            size="lg"
						>
							Create
						</Button>
					</Flex>
				</form>
                <Places />
				{/* <Link href="/work" passHref legacyBehavior>
					<Anchor fz={14}>Try live demo</Anchor>
				</Link> */}
			</Flex>

			<Flex mb={100} direction="column" w="100%">
				<Title order={3} mb={25}>
					Tools
				</Title>

				<Grid gutter="xl">
					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>Pomodoro.</span>
							Set up your timer. And relax with short and long
							breaks.
						</Text>
					</Grid.Col>

					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>To-Do.</span>
							Create, edit and delete an entire to-do list.
						</Text>
					</Grid.Col>

					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>Playlist.</span>7
							differents sounds. Mix them and control their
							volume.
						</Text>
					</Grid.Col>

					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>
								Key shortcuts.
							</span>
							Control your pomodoro directly from your keyboard.
						</Text>
					</Grid.Col>

					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>
								Always available.
							</span>
							All saved under your place name.
						</Text>
					</Grid.Col>

					<Grid.Col xs={6} sm={4}>
						<Text component="p" fw={400} c="dimmed" m={0}>
							<span className={classes.spanBold}>Dark mode.</span>
							For those who enjoy the night 🦇
						</Text>
					</Grid.Col>
				</Grid>
			</Flex>

			<Flex mb={50} direction="column">
				<Title order={3}>How its work?</Title>
				<Text component="p">
					Everything is <b>saved and available</b> in your browser
					under a name of your choosing.
				</Text>
				<Text component="p" m={0}>
					The information is stored in the local storage of your
					browser. It will be available as long as it is not deleted
					or you do not use the app in incognito mode.
				</Text>
				<Text component="p" fz={14} c="dimmed">
					Storage and availability on different devices soon.
				</Text>
			</Flex>

			{/* <Flex justify="center" w="100%">
				<Social />
			</Flex> */}
		</>
	);
};

export default Home;
