import {
    createTheme,
    rem,
    type CSSVariablesResolver,
    type MantineColorsTuple
} from '@mantine/core';

import classes from './Theme.module.css';

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
            'var(--font-space-grotesk), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
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
            defaultProps: {
                centered: true,
                radius: 24,
                overlayProps: { backgroundOpacity: 0.45, blur: 3 }
            },
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle,
                body: classes.modalBody,
                close: classes.modalClose
            }
        },
        TextInput: {
            defaultProps: { size: 'md', radius: 12 },
            classNames: { label: classes.inputLabel, input: classes.input }
        },
        NumberInput: {
            defaultProps: { size: 'md', radius: 12 },
            classNames: { label: classes.inputLabel, input: classes.input }
        },
        Kbd: {
            classNames: { root: classes.kbd }
        },
        Text: {
            styles: {
                root: {
                    fontSize: 14
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
        '--mantine-color-default-border': '#D8D8D1',
        '--mantine-color-default-hover': '#F2F2EE',
        '--dp-bg': '#F5F5F1',
        '--dp-surface': '#FFFFFF',
        '--dp-surface-muted': '#F2F2EE',
        '--dp-surface-alt': '#ECECE6',
        '--dp-border': '#E8E8E2',
        '--dp-border-strong': '#D8D8D1',
        // Boundary of controls that have no other visible shape (3:1, e.g. an unchecked checkbox)
        '--dp-control-border': '#95958F',
        '--dp-text': '#17181A',
        '--dp-text-secondary': '#4A4C52',
        '--dp-text-muted': '#6B6D73',
        // Slightly darker than orange.9 so white button text reaches 4.5:1
        '--dp-accent': '#D2460F',
        '--dp-accent-hover': '#C2410C',
        '--dp-accent-contrast': '#FFFFFF',
        '--dp-accent-text': '#B23C0A',
        '--dp-accent-soft': '#FFF4E6',
        '--dp-accent-soft-text': '#A33A08',
        '--dp-success': '#2A873D',
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
        '--dp-control-border': '#65676C',
        '--dp-text': '#F1F1EE',
        '--dp-text-secondary': '#B9BAC0',
        '--dp-text-muted': '#8E9096',
        '--dp-accent': '#F76707',
        '--dp-accent-hover': '#FD7E14',
        '--dp-accent-contrast': '#17181A',
        '--dp-accent-text': '#FF922B',
        '--dp-accent-soft': 'rgba(253, 126, 20, 0.15)',
        '--dp-accent-soft-text': '#FF922B',
        '--dp-success': '#51CF66',
        '--dp-inverse': '#F1F1EE',
        '--dp-inverse-text': '#17181A'
    }
});
