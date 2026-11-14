import { fireEvent, screen, within } from '@testing-library/react';

import Shortcuts from '@/components/modals/Shortcuts';
import messages from '../../../messages/en.json';
import { renderWithProviders } from '../utils/renderWithProviders';

describe('<Shortcuts />', () => {
    it('lists every shortcut with its keys', () => {
        renderWithProviders(<Shortcuts />);

        fireEvent.click(screen.getByRole('button', { name: messages.shortcuts.title }));
        const dialog = within(screen.getByRole('dialog'));

        const expected: Array<[string, string[]]> = [
            [messages.shortcuts.playPause, ['Ctrl/⌘', 'P']],
            [messages.shortcuts.changePomodoro, ['Ctrl/⌘', 'Alt', '1']],
            [messages.shortcuts.changeShort, ['Ctrl/⌘', 'Alt', '2']],
            [messages.shortcuts.changeLong, ['Ctrl/⌘', 'Alt', '3']],
            [messages.shortcuts.toggleTheme, ['Ctrl/⌘', 'J']]
        ];

        const terms = dialog.getAllByRole('term');
        expect(terms.map((term) => term.textContent)).toEqual(expected.map(([text]) => text));

        const keys = dialog
            .getAllByRole('definition')
            .map((definition) =>
                Array.from(definition.querySelectorAll('kbd'), (kbd) => kbd.textContent)
            );
        expect(keys).toEqual(expected.map(([, combo]) => combo));
    });
});
