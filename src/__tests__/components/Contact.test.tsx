import { screen } from '@testing-library/react';

import Contact from '@/pages/contact';
import messages from '../../../messages/en.json';
import { renderWithProviders } from '../utils/renderWithProviders';

describe('<Contact />', () => {
    it('links to X, GitHub issues and Buy Me a Coffee', () => {
        renderWithProviders(<Contact />);

        expect(
            screen.getByRole('link', { name: new RegExp(messages.contact.xTitle) })
        ).toHaveAttribute('href', 'https://x.com/agustinlautaro');
        expect(
            screen.getByRole('link', { name: new RegExp(messages.contact.bugTitle) })
        ).toHaveAttribute('href', 'https://github.com/agustinl/daily.place/issues');
        expect(
            screen.getByRole('link', { name: new RegExp(messages.contact.coffeeTitle) })
        ).toHaveAttribute('href', 'https://www.buymeacoffee.com/daily.place');
    });

    it('opens external links in a new tab without passing the opener', () => {
        renderWithProviders(<Contact />);

        for (const link of screen.getAllByRole('link')) {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });

    it('offers the feedback widget instead of a form', () => {
        renderWithProviders(<Contact />);

        expect(
            screen.getByRole('button', { name: new RegExp(messages.contact.feedbackTitle) })
        ).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
});
