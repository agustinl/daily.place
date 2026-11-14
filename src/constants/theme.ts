import {
    createTheme,
    rem,
    type CSSVariablesResolver,
    type MantineColorsTuple
} from '@mantine/core';

// Neutral scale used by Mantine in the dark color scheme:
// 0 text, 2 dimmed, 4 borders, 5 hover, 6 surfaces, 7 page background.
const dark: MantineColorsTuple = [
    '#F1F1EE',
    '#B9BAC0',
    '#8E9096',
    '#5C5E66',
    '#3A3C42',
    '#2C2E33',
    '#1B1C1F',
    '#121314',
    '#0E0F10',
    '#0A0A0B'
];

export const theme = createTheme({
    fontFamily:
        'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    headings: {
        fontFamily:
            'var(--font-space-grotesk), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        sizes: {
            h1: {
                fontWeight: '600',
                fontSize: rem(50)
            },
            h2: {
                fontWeight: '400',
                fontSize: rem(23)
            },
            h3: {
                fontWeight: '500',
                fontSize: rem(27)
            },
            h4: {
                fontWeight: '600',
                fontSize: rem(20)
            }
        }
    },
    colors: { dark },
    primaryColor: 'orange',
    primaryShade: { light: 9, dark: 7 },
    defaultRadius: 'md',
    radius: {
        md: rem(10)
    },
    components: {
        Modal: {
            styles: {
                title: { fontWeight: '500', fontSize: '20' }
            }
        },
        TextInput: {
            styles: {
                label: {
                    marginBottom: 5
                }
            }
        },
        Textarea: {
            styles: {
                label: {
                    marginBottom: 5
                }
            }
        },
        Text: {
            styles: {
                root: {
                    fontSize: 14
                }
            }
        },
        Anchor: {
            styles: {
                root: {
                    fontSize: 'inherit'
                }
            }
        }
    }
});

// Design tokens. Components read them as `var(--dp-*)`, so each one follows the color scheme
// without checking it in JS.
export const cssVariablesResolver: CSSVariablesResolver = () => ({
    variables: {
        '--dp-footer-bg': '#17181A',
        '--dp-footer-text': '#C9CACE',
        '--dp-footer-title': '#FFFFFF',
        '--dp-footer-divider': '#2E3034'
    },
    light: {
        '--mantine-color-body': '#F5F5F1',
        '--mantine-color-text': '#17181A',
        '--mantine-color-dimmed': '#6B6D73',
        '--dp-bg': '#F5F5F1',
        '--dp-surface': '#FFFFFF',
        '--dp-surface-muted': '#F2F2EE',
        '--dp-surface-alt': '#ECECE6',
        '--dp-border': '#E8E8E2',
        '--dp-border-strong': '#D8D8D1',
        '--dp-text': '#17181A',
        '--dp-text-secondary': '#4A4C52',
        '--dp-text-muted': '#6B6D73',
        '--dp-accent': '#D9480F',
        '--dp-accent-text': '#B23C0A',
        '--dp-accent-soft': '#FFF4E6',
        '--dp-accent-soft-text': '#A33A08',
        '--dp-success': '#2B8A3E',
        '--dp-inverse': '#17181A',
        '--dp-inverse-text': '#FFFFFF'
    },
    dark: {
        '--mantine-color-body': '#121314',
        '--mantine-color-text': '#F1F1EE',
        '--mantine-color-dimmed': '#8E9096',
        '--dp-bg': '#121314',
        '--dp-surface': '#1B1C1F',
        '--dp-surface-muted': '#232428',
        '--dp-surface-alt': '#202125',
        '--dp-border': '#2C2E33',
        '--dp-border-strong': '#3A3C42',
        '--dp-text': '#F1F1EE',
        '--dp-text-secondary': '#B9BAC0',
        '--dp-text-muted': '#8E9096',
        '--dp-accent': '#F76707',
        '--dp-accent-text': '#FF922B',
        '--dp-accent-soft': 'rgba(253, 126, 20, 0.15)',
        '--dp-accent-soft-text': '#FF922B',
        '--dp-success': '#51CF66',
        '--dp-inverse': '#F1F1EE',
        '--dp-inverse-text': '#17181A'
    }
});
