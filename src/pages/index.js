import { useRouter } from "next/router";
import Image from "next/image";

import {
	Title,
	Text,
	TextInput,
	Flex,
	createStyles,
	Grid,
	useMantineColorScheme,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useForm, isNotEmpty } from "@mantine/form";
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
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";
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
			<Flex w="100%" direction="column" align="center">
				<Image
					alt="Daily place logo"
					src={dark ? "/logo-dark.svg" : "/logo-light.svg"}
					width={120}
					height={120}
				/>
				<Title order={1} m="50px 0 20px">
					daily.place
				</Title>

				<Title order={2} mb={20} c="dark.2">
					Create your perfect space to focus on your daily tasks
				</Title>
				<form
					onSubmit={form.onSubmit(({ name }) =>
						router.push(`/${name}`)
					)}
				>
					<Flex align="flex-end" gap={10}>
						<TextInput
							placeholder="Name of your space"
							size="md"
							label={`daily.place/${form?.values?.name}`}
							error
							{...form.getInputProps("name")}
						/>
						<Button type="submit" size="md">
							Create
						</Button>
					</Flex>
				</form>
				<Text c="dimmed" fz={14} mt={10}>
					100% Free. All <a href="#tools">tools</a> available.
				</Text>
			</Flex>

			<Carousel
				sx={{ maxWidth: 960 }}
				mx="auto"
				my={50}
				slideGap="md"
				controlsOffset="xl"
				loop
				draggable={false}
				withIndicators
				styles={{
					viewport: {
						borderRadius: "12px",
						boxShadow: "0px 5px 75px -11px rgba(0,0,0,0.3)",
					},
					indicators: {
						bottom: "-25px",
					},
					indicator: {
						width: 8,
						height: 8,
						transition: "width 250ms ease",
						backgroundColor: "#a9a9a9",

						"&[data-active]": {
							width: 8,
							backgroundColor: "#858585",
						},
					},
				}}
			>
				<Carousel.Slide>
					<img src="/carrousel/1.jpg" alt="Daily place light mode example" />
				</Carousel.Slide>
				<Carousel.Slide>
					<img src="/carrousel/2.jpg" alt="Daily place dark mode example" />
				</Carousel.Slide>
				<Carousel.Slide>
					<img src="/carrousel/3.jpg" alt="Daily place with tasks" />
				</Carousel.Slide>
				<Carousel.Slide>
					<img src="/carrousel/5.jpg" alt="Daily place showing places menu" />
				</Carousel.Slide>
			</Carousel>

			<Flex mb={50} direction="column">
				<Title order={3}>How does this work?</Title>
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

			<Flex mb={100} direction="column" w="100%" id="tools">
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
		</>
	);
};

export default Home;
