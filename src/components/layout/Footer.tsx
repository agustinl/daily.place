import { FeedbackFish } from '@feedback-fish/react';
import { Flex, Anchor, Text, Badge } from '@mantine/core';
import Link from 'next/link';

const Footer = () => {
    return (
        <Flex
            component="footer"
            justify="center"
            w="100%"
            align="center"
            gap={20}
            mt={50}
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
    );
};

export default Footer;
