import { forwardRef } from 'react';

import { Button as MantineButton, ButtonProps, createPolymorphicComponent } from '@mantine/core';

type Tone = 'primary' | 'secondary' | 'danger';

type Props = ButtonProps & {
    /** primary: accent fill · secondary: outlined · danger: destructive actions */
    tone?: Tone;
};

const TONES: Record<Tone, ButtonProps> = {
    primary: {
        vars: () => ({
            root: {
                '--button-bg': 'var(--dp-accent)',
                '--button-hover': 'var(--dp-accent-hover)',
                '--button-color': 'var(--dp-accent-contrast)'
            }
        })
    },
    secondary: { variant: 'default' },
    danger: { color: 'red' }
};

const _Button = forwardRef<HTMLButtonElement, Props>(
    ({ tone = 'primary', children, ...others }, ref) => (
        <MantineButton h={44} px={18} radius={10} fw={600} ref={ref} {...TONES[tone]} {...others}>
            {children}
        </MantineButton>
    )
);

const Button = createPolymorphicComponent<'button', Props>(_Button);

export default Button;

_Button.displayName = 'Button';
