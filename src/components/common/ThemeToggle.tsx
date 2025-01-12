import { useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';

import Action from '../common/Action';

const ThemeToggle = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
		keepTransitions: true,
	});
    const dark = colorScheme === 'dark';

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <Action onClick={() => toggleColorScheme()} aria-label="Toggle theme">
            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </Action>
    );
};

export default ThemeToggle;
