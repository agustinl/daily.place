import {
    Alert,
    Image,
    Title,
    Text,
    TextInput,
    Flex,
    Grid,
    useMantineColorScheme,
    Stack,
    Anchor,
    Badge
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import Button from '@/components/common/Button';
import { useAnalytics } from '@/hooks/useAnalytics';

import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import classes from './global.module.css';

const Home = () => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const t = useTranslations();
    const { places } = useConvexPlaces();

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
                <Title m="50px 0 20px">{t('home.title')}</Title>

                <Title order={2} mb={20} c="dark.2" ta="center">
                    {t('home.subtitle')}
                </Title>
                <form
                    onSubmit={form.onSubmit(({ name }) => {
                        trackEvent({
                            action: 'place_created',
                            category: 'place',
                            label: `New place created: ${name}`
                        });
                        router.push(`/${name}`);
                    })}
                >
                    <Flex align="flex-end" gap={10}>
                        <TextInput
                            placeholder={t('home.createPlaceholder')}
                            size="md"
                            label={`${t('common.appName')}/${form?.values?.name}`}
                            error
                            {...form.getInputProps('name')}
                        />
                        <Button type="submit" size="md">
                            {t('home.createButton')}
                        </Button>
                    </Flex>
                </form>
                <Text c="dimmed" fz={14} mt={10}>
                    {t('home.freeMessage')}
                </Text>
                {places?.length > 0 && (
                    <Flex align="center" justify="center" gap={10} mt={10} wrap="wrap">
                        <Text c="dimmed" fz={14}>
                            {t('home.myPlaces')}
                        </Text>
                        {places?.map((place, index) => (
                            <Link
                                href={{
                                    pathname: `/${place}`,
                                    query: { idx: index }
                                }}
                                passHref
                                legacyBehavior
                                key={index}
                                as={`/${place}`}
                            >
                                <Badge component="a" color="orange" style={{ cursor: 'pointer' }}>
                                    {place}
                                </Badge>
                            </Link>
                        ))}
                    </Flex>
                )}
            </Flex>

            <Flex mt={100} mb={50} direction="column">
                <Title order={3} mb="md">
                    {t('home.howItWorks')}
                </Title>
                <Stack>
                    <Text>{t('home.description1')}</Text>
                    <Text m={0}>{t('home.description2')}</Text>
                    <Text c="orange" fw={500}>
                        {t('home.description3')}
                    </Text>
                </Stack>
            </Flex>

            <Flex mb={100} direction="column" w="100%" id="tools">
                <Title order={3} mb={25}>
                    {t('home.tools')}
                </Title>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool1Title')}</span>{' '}
                            {t('home.tool1Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool2Title')}</span>{' '}
                            {t('home.tool2Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool3Title')}</span>{' '}
                            {t('home.tool3Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool4Title')}</span>{' '}
                            {t('home.tool4Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool5Title')}</span>{' '}
                            {t('home.tool5Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool6Title')}</span>{' '}
                            {t('home.tool6Description')}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, xs: 4 }}>
                        <Text c="dimmed">
                            <span className={classes.spanBold}>{t('home.tool7Title')}</span>{' '}
                            {t('home.tool7Description')}
                        </Text>
                    </Grid.Col>
                </Grid>
            </Flex>
        </>
    );
};

export default Home;
