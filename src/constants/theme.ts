import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
    headings: {
        sizes: {
            h1: {
                fontWeight: '600',
                fontSize: rem(50),
            },
            h2: {
                fontWeight: '400',
                fontSize: rem(23),
            },
            h3: {
                fontWeight: '500',
                fontSize: rem(27),
            },
            h4: {
                fontWeight: '600',
                fontSize: rem(20),
            },
        },
    },
    primaryColor: 'orange',
    components: {
        Modal: {
            styles: {
                title: { fontWeight: '500', fontSize: '20' },
            },
        },
        TextInput: {
            styles: {
                label: {
                    marginBottom: 5,
                },
            },
        },
        Textarea: {
            styles: {
                label: {
                    marginBottom: 5,
                },
            },
        },
        Text: {
            styles: {
                root: {
					fontSize: 14
				},
            },
        },
        Anchor: {
            styles: {
                root: {
					fontSize: 'inherit'
				},
            },
        },
    },
});
