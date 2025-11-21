import { FeedbackFish } from '@feedback-fish/react';
import { Flex, Anchor, Text, Badge, Stack } from '@mantine/core';
import Link from 'next/link';

const Footer = () => {
    return (
        <Stack w="100%" mt={50}>
            <Flex
                component="footer"
                justify="center"
                w="100%"
                align="center"
                gap={20}
                wrap="wrap"
                fz={12}
            >
                <Anchor component={Link} href="/changelog" c="gray.6">
                    Changelog
                </Anchor>

                <Anchor component={Link} href="/contact" c="gray.6">
                    Contact
                </Anchor>

                <Text fz={12}>
                    built in Argentina by{' '}
                    <Anchor c="gray.6" href="https://x.com/agustinlautaro" target="_blank">
                        Agustín
                    </Anchor>
                </Text>

                <FeedbackFish projectId="6a0ab10df6a57f">
                    <Badge variant="dot" style={{ cursor: 'pointer' }}>
                        Feedback
                    </Badge>
                </FeedbackFish>
            </Flex>
            <Text c="dimmed" fz={10} ta="center">
                Sound effects courtesy of BBC Sound Effects Archive (© BBC). Used under licence for
                non-commercial/educational use.
            </Text>
        </Stack>
    );
};

export default Footer;
