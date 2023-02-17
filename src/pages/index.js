import { useRouter } from "next/router";
import { Flex, Title, Text, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import List from "@/components/List";
import Question from "@/components/common/Question";

const Home = () => {
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
		<Flex
			direction="column"
			w="60%"
			sx={_ => ({
				"@media (max-width: 768px)": {
					width: "100%",
				},
			})}
		>
			<Title
				order={1}
				fz={48}
				fw={700}
				sx={_ => ({
					"@media (max-width: 576px)": {
						fontSize: 36,
					},
				})}
			>
				daily.place
			</Title>
			<Text
				c="dimmed"
				my={20}
				sx={_ => ({
					"@media (max-width: 576px)": {
						fontSize: 14,
					},
				})}
			>
				Create your perfect space to focus on your daily tasks. Ambient
				sounds, Pomodoro timer and a task list to know your progress.
				<br />
				<b>
					Everything is saved and available in your browser under a
					name of your choice.
				</b>{" "}
				<Question />
			</Text>
			<form
				onSubmit={form.onSubmit(({ name }) => router.push(`/${name}`))}
			>
				<TextInput
					w="70%"
					placeholder="Enter your daily place name..."
					size="md"
					mb={25}
					error
					{...form.getInputProps("name")}
					sx={_ => ({
						"@media (max-width: 576px)": {
							width: "100%",
						},
					})}
				/>
			</form>
			<List />
		</Flex>
	);
};

export default Home;
