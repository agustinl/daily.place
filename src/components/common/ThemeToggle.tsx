import { Box, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';

import { useTranslations } from 'next-intl';

import Action from '../common/Action';

const ThemeToggle = () => {
    const { toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true
    });

    const t = useTranslations();

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <Action
            onClick={() => toggleColorScheme()}
            aria-label={t('common.toggleTheme')}
            variant="default"
            size={44}
        >
            {/* Both icons are rendered and toggled with CSS: the stored color scheme is only
                known in the browser, so picking one in JS breaks hydration */}
            <Box component="span" lh={0} lightHidden>
                <IconSun size={18} />
            </Box>
            <Box component="span" lh={0} darkHidden>
                <IconMoon size={18} />
            </Box>
        </Action>
    );
};

export default ThemeToggle;
