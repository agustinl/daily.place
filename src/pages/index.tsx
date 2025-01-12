import { Image, Title, Text, TextInput, Flex, Grid, useMantineColorScheme, Stack, Anchor } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { useRouter } from 'next/router';

import Button from '@/components/common/Button';

import classes from './global.module.css';
import { usePlausible } from 'next-plausible';

const Home = () => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const router = useRouter();
	const plausible = usePlausible();

    const form = useForm({
        initialValues: {
            name: ''
        },
        validate: {
            name: isNotEmpty()
        }
    });

    return (
        <>
            <Flex w="100%" h="60vh" direction="column" align="center" justify="center">
                <Image
                    alt="Daily place logo"
                    src={dark ? '/logo-dark.svg' : '/logo-light.svg'}
                    w={120}
                />
                <Title m="50px 0 20px">
                    daily.place
                </Title>

                <Title order={2} mb={20} c="dark.2" ta="center">
                    Create your perfect space to focus on your daily tasks
                </Title>
                <form onSubmit={form.onSubmit(({ name }) => {
					plausible('New+place', {
						props: {
							name
						}
					})
					router.push(`/${name}`);
					})}>
                    <Flex align="flex-end" gap={10}>
                        <TextInput
                            placeholder="Name of your space"
                            size="md"
                            label={`daily.place/${form?.values?.name}`}
                            error
                            {...form.getInputProps('name')}
                        />
                        <Button type="submit" size="md">
                            Create
                        </Button>
                    </Flex>
                </form>
                <Text c="dimmed" fz={14} mt={10}>
                    100% Free. All <Anchor href="#tools">tools</Anchor> available.
                </Text>
            </Flex>

            <Flex mt={100} mb={50} direction="column">
                <Title order={3} mb="md">How does this work?</Title>
                <Stack>
					<Text>
						Everything is <b>saved and available</b> in your browser under a name of your
						choosing.
					</Text>
					<Text m={0}>
						The information is stored in the local storage of your browser. It will be
						available as long as it is not deleted or you do not use the app in incognito
						mode.
					</Text>
					<Text fz={14} c="dimmed">
						Storage and availability on different devices soon.
					</Text>
				</Stack>
            </Flex>

            <Flex mb={100} direction="column" w="100%" id="tools">
                <Title order={3} mb={25}>
                    Tools
                </Title>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>Pomodoro.</span>
                            Set up your timer. And relax with short and long breaks.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>To-Do.</span>
                            Create, edit and delete an entire to-do list.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>Playlist.</span>9 differents sounds.
                            Mix them and control their volume.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>Key shortcuts.</span>
                            Control your pomodoro directly from your keyboard.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>Always available.</span>
                            All saved under your place name.
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
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
