import { Flex, Text, useMantineColorScheme, Grid, Anchor, Badge } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FeedbackFish } from '@feedback-fish/react'

import DateAndTime from '@/components/DateAndTime';

import Places from '../common/Places';
import ThemeToggle from '../common/ThemeToggle';

const NavBar = () => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const router = useRouter();
    const { name } = router.query;

    return (
        <Grid justify="center" align="center" w="100%" m={0}>
            <Grid.Col span={{ base: 12, sm: 4 }}>
                <Flex align="center" justify="flex-start" gap="sm">
                    {router?.pathname !== '/' && (
                        <Anchor component={Link} href="/" lh={0}>
                            <Image
                                alt="Daily place logo"
                                src={dark ? '/logo-dark.svg' : '/logo-light.svg'}
                                width={20}
                                height={20}
                            />
                        </Anchor>
                    )}
                    {name && <DateAndTime />}
                </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 'auto', sm: 4 }}>
                {name && (
                    <Text fz={18} fw={500} ta="center">
                        {name}&apos;s{' '}
                        <Text span c="dimmed">
                            place
                        </Text>
                    </Text>
                )}
            </Grid.Col>
            <Grid.Col span={{ base: 'auto', sm: 4 }}>
                <Flex gap="md" justify="flex-end" align="center">
					<FeedbackFish projectId="6a0ab10df6a57f">
						<Badge variant="dot" style={{ cursor: 'pointer' }}>Feedback</Badge>
					</FeedbackFish>
                    <Places name={name as string} />
                    <ThemeToggle />
                </Flex>
            </Grid.Col>
        </Grid>
    );
};

export default NavBar;
