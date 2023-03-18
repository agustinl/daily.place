import Link from "next/link";
import { useRouter } from "next/router";

import {
	Title,
	Text,
	TextInput,
	Button,
	Flex,
	Anchor,
	createStyles,
	Image,
	Grid,
	useMantineTheme,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

import Places from "@/components/common/Places";
import Social from "@/components/common/Social";

const useStyles = createStyles((theme, _params) => {
	return {
		card: {
			borderRadius: 10,
			boxShadow:
				"0 0 0 1px rgba(0,0,0,.02),0 2px 4px rgba(0,0,0,.05), 0 0 24px rgba(0,0,0,.05)",
			border:
				theme.colorScheme === "dark"
					? "1px solid rgba(55, 58, 64, 0.5)"
					: "1px solid rgba(222, 226, 230, 0.3)",
		},
		spanBold: {
			fontWeight: 700,
			color: theme.colorScheme === "dark" ? theme.white : theme.black,
			paddingRight: 5,
		},
		tools: {
			width: "30%",
			height: "100%",

			"@media (max-width: 768px)": {
				width: "48%",
			},

			"@media (max-width: 576px)": {
				width: "100%",
			},
		},
		toolsMargins: {
			marginBottom: 50,

			"@media (max-width: 768px)": {
				width: "48%",
			},

			"@media (max-width: 576px)": {
				width: "100%",
			},
		},
	};
});

const Home = () => {
	const { classes } = useStyles();
	const theme = useMantineTheme();

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
				justify="center"
				w="100%"
				mih="70vh"
				direction="column"
				align="center"
				py={100}
			>
				<Places />

				<Title
					order={1}
					variant="gradient"
					gradient={{
						from: "#f56d3b",
						to: "#e74863",
						deg: 90,
					}}
					fz={58}
					sx={_ => ({
						"@media (max-width: 480px)": {
							fontSize: 42,
						},
					})}
				>
					Daily place
				</Title>

				<Title
					order={2}
					mb={40}
					fw={300}
					ta="center"
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
							placeholder="Your daily.place name"
							size="md"
							error
							{...form.getInputProps("name")}
						/>
						<Button
							type="submit"
							variant="gradient"
							gradient={{
								from: "#f56d3b",
								to: "#e74863",
								deg: 90,
							}}
							h={42}
							px={30}
						>
							Create
						</Button>
					</Flex>
				</form>
				<Link href="/work" passHref legacyBehavior>
					<Anchor fz={14}>Try live demo</Anchor>
				</Link>
			</Flex>

			<Flex mb={100}>
				<Image
					src={
						process.env.NODE_ENV === "development"
							? ""
							: `https://ik.imagekit.io/dailyplace/app-screen-${theme.colorScheme}.jpg`
					}
					alt="Daily place screen"
					radius={10}
					className={classes.card}
				/>
			</Flex>

			<Flex mb={100} direction="column" w="100%">
				<Title order={2} mb={25}>
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
				<Title order={2}>How its work?</Title>
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

			<Flex justify="center" w="100%">
				<Social />
			</Flex>
		</>
	);
};

export default Home;
