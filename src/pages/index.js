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
				mih="50vw"
				direction="column"
				align="center"
				py={100}
			>
				{/*<Title
						ta="center"
						order={1}
						variant="gradient"
						gradient={{ from: "#f56d3b", to: "#e74863", deg: 90 }}
						fz={68}
						fw={700}
					>
						daily.place
					</Title>*/}
				<Places />
				<Title order={1} mb={40} ta="center">
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

			<Flex mb={50}>
				<Image
					src="/app-screen.jpg"
					alt=""
					radius={10}
					className={classes.card}
				/>
			</Flex>

			<Flex mb={100} justify="center" gap={20} w="100%" wrap="wrap">
				<Social />
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
		</>
	);
};

export default Home;
