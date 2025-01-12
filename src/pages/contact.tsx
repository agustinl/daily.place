import { useState } from 'react';

import { Flex, Title, TextInput, Textarea, Paper, Text, Anchor, Stack } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';

import Button from '@/components/common/Button';
import Social from '@/components/common/Social';

type FormValues = {
    name: string;
    email: string;
    message: string;
};

const Contact = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            message: ''
        },
        validate: {
            message: isNotEmpty('Message cannot be empty')
        }
    });

    const submitForm = async (values: FormValues) => {
        setLoading(true);
        const res = await fetch('/api/sendgrid', {
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        setLoading(false);

        const { error } = await res.json();
        if (error) {
            showNotification({
                title: ':(',
                message: 'We had trouble sending your message. Please try again in a few seconds.',
                color: 'red',
                autoClose: 6000
            });
            return;
        }

        showNotification({
            title: 'Message sent',
            message: 'Thank you for taking the time to contact us!',
            color: 'green',
            autoClose: 6000
        });
        form.reset();
    };

    return (
        <>
            <Head>
                <title>Contact | daily.place</title>
                <meta name="title" content="Contact | daily.place" />
                <meta name="description" content="Questions, feedback or help about daily.place" />
            </Head>
            <div>
                <Title order={3}>Contact</Title>
                <Text>
                    If you have any questions, feedback, or need help with the app, just send us an
                    email using the form below:
                </Text>
            </div>

            <Flex
                w="100%"
                gap={25}
                direction={{ base: 'column', sm: 'row' }}
            >
                <Paper
                    p="md"
                    withBorder
                    miw={400}
                >
                    <form onSubmit={form.onSubmit(submitForm)}>
                        <Stack>
							<TextInput
								placeholder="Fox Mulder"
								label="Name"
								{...form.getInputProps('name')}
							/>

							<TextInput
								placeholder="fox@x-files.com"
								label="Email"
								{...form.getInputProps('email')}
							/>

							<Textarea
								placeholder="I want to believe"
								label="Message"
								{...form.getInputProps('message')}
							/>

							<Flex justify="flex-end">
								<Button type="submit" loading={loading}>
									Send
								</Button>
							</Flex>
						</Stack>
                    </form>
                </Paper>
                <div>
                    <Text>
                        You can also write us directly to our e-mail or social networks:
                    </Text>

                    <Flex gap={20} wrap="wrap" align="center" mt="md">
                        <Anchor href="mailto:daily.place@proton.me">daily.place@proton.me</Anchor>

                        <Social />
                    </Flex>
                </div>
            </Flex>
        </>
    );
};

export default Contact;
