import { Flex, Title, Text, Anchor, Stack, Badge } from '@mantine/core';
import Head from 'next/head';
import { useTranslations } from 'next-intl';

import { FeedbackFish } from '@feedback-fish/react';

const Contact = () => {
    const t = useTranslations();

    return (
        <>
            <Head>
                <title>Contact | daily.place</title>
                <meta name="title" content="Contact | daily.place" />
                <meta name="description" content="Questions, feedback or help about daily.place" />
            </Head>
            <div>
                <Title order={3}>{t('contact.title')}</Title>
                <Stack mt="md">
					<Text>
						{t('contact.description')}
					</Text>

					<FeedbackFish projectId="6a0ab10df6a57f">
						<Badge variant="dot" style={{ cursor: 'pointer' }}>
							{t('common.feedback')}
						</Badge>
					</FeedbackFish>

					<Text mt="md">{t('contact.orFollowMeOnX')}</Text>

					<Flex gap={20} wrap="wrap" align="center">
						<Anchor href="https://twitter.com/agustinlautaro" target="_blank">
							@agustinlautaro
						</Anchor>
					</Flex>
				</Stack>
            </div>
        </>
    );
};

export default Contact;
