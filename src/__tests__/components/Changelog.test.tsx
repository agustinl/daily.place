import { screen, within } from '@testing-library/react';

import Changelog from '@/pages/changelog';
import messages from '../../../messages/en.json';
import { renderWithProviders } from '../utils/renderWithProviders';

let mockLocale = 'en';

jest.mock('@/contexts/LanguageContext', () => ({
    useLanguageContext: () => ({ locale: mockLocale, setLocale: jest.fn() })
}));

const paragraph = (text: string) => ({
    schema: 'dast',
    document: {
        type: 'root',
        children: [{ type: 'paragraph', children: [{ type: 'span', value: text }] }]
    }
});

const entries = [
    {
        id: '2',
        version: 'v7.1.0',
        title: 'Cloud sync',
        date: '2025-11-22',
        content: { value: paragraph('Sync your tasks.') },
        items: null
    },
    {
        id: '1',
        version: 'v7.0.0',
        title: 'Major update',
        date: '2025-10-22',
        content: null,
        items: { value: paragraph('Refactored the code.') }
    }
];

describe('<Changelog />', () => {
    beforeEach(() => {
        mockLocale = 'en';
    });

    it('lists every release with its content', () => {
        renderWithProviders(<Changelog data={entries} />);

        const releases = screen.getAllByRole('article');
        expect(releases).toHaveLength(2);
        expect(within(releases[0]).getByRole('heading', { name: 'Cloud sync' })).toBeVisible();
        expect(within(releases[0]).getByText('Sync your tasks.')).toBeInTheDocument();
        expect(within(releases[1]).getByText('Refactored the code.')).toBeInTheDocument();
    });

    it('marks only the first release as the latest one', () => {
        renderWithProviders(<Changelog data={entries} />);

        const [latest, previous] = screen.getAllByRole('article');
        expect(within(latest).getByText(messages.changelog.latest)).toBeInTheDocument();
        expect(within(previous).queryByText(messages.changelog.latest)).not.toBeInTheDocument();
    });

    it('formats the date in the reader language without shifting the day', () => {
        const { unmount } = renderWithProviders(<Changelog data={entries} />);
        expect(screen.getByText('November 22, 2025')).toHaveAttribute('datetime', '2025-11-22');
        unmount();

        mockLocale = 'es';
        renderWithProviders(<Changelog data={entries} />);
        expect(screen.getByText('22 de noviembre, 2025')).toBeInTheDocument();
    });

    it('shows a message when there are no releases', () => {
        renderWithProviders(<Changelog data={[]} />);

        expect(screen.getByText(messages.changelog.empty)).toBeInTheDocument();
        expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });
});
