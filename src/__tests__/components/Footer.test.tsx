import { fireEvent, screen, within } from '@testing-library/react';

import Footer from '@/components/layout/Footer';
import { renderWithProviders } from '../utils/renderWithProviders';

const mockSetLocale = jest.fn(() => Promise.resolve());

let mockCloudPlaces: string[] = [];

jest.mock('@/hooks/useConvexPlaces', () => ({
    useConvexPlaces: () => ({ places: mockCloudPlaces, isLoading: false, deletePlace: jest.fn() })
}));

jest.mock('@/contexts/LanguageContext', () => ({
    useLanguageContext: () => ({ locale: 'en', setLocale: mockSetLocale })
}));

describe('Footer', () => {
    beforeEach(() => {
        localStorage.clear();
        mockCloudPlaces = [];
        mockSetLocale.mockClear();
    });

    describe('full variant', () => {
        it('shows the link columns', () => {
            renderWithProviders(<Footer />);

            expect(screen.getByRole('link', { name: 'Tools' })).toHaveAttribute('href', '/#tools');
            expect(screen.getByRole('link', { name: 'Changelog' })).toHaveAttribute(
                'href',
                '/changelog'
            );
            expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
                'href',
                '/contact'
            );
            expect(screen.getByRole('link', { name: 'Report a bug' })).toHaveAttribute(
                'href',
                'https://github.com/agustinl/daily.place/issues'
            );
            expect(screen.getByRole('button', { name: 'Send feedback' })).toBeInTheDocument();
        });

        it('lists the saved places only when asked to', async () => {
            localStorage.setItem('dailyPlaceNames', 'casa,mi place');

            const { unmount } = renderWithProviders(<Footer />);
            expect(screen.queryByText('Your places')).not.toBeInTheDocument();
            unmount();

            renderWithProviders(<Footer showPlaces />);
            expect(await screen.findByText('Your places')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'casa' })).toHaveAttribute('href', '/casa');
            expect(screen.getByRole('link', { name: 'mi place' })).toHaveAttribute(
                'href',
                '/mi%20place'
            );
        });

        it('lists cloud places next to the local ones without repeating them', async () => {
            localStorage.setItem('dailyPlaceNames', 'casa');
            mockCloudPlaces = ['casa', 'trabajo'];
            renderWithProviders(<Footer showPlaces />);

            expect(await screen.findByRole('link', { name: 'trabajo' })).toHaveAttribute(
                'href',
                '/trabajo'
            );
            expect(screen.getAllByRole('link', { name: 'casa' })).toHaveLength(1);
        });

        it('hides the places column when there are no saved places', () => {
            renderWithProviders(<Footer showPlaces />);

            expect(screen.queryByText('Your places')).not.toBeInTheDocument();
        });

        it('marks the current language and switches to another one', () => {
            renderWithProviders(<Footer />);

            const languages = within(screen.getByRole('group', { name: 'Language' }));
            expect(languages.getByRole('button', { name: 'EN' })).toHaveAttribute(
                'aria-pressed',
                'true'
            );
            expect(languages.getByRole('button', { name: 'ES' })).toHaveAttribute(
                'aria-pressed',
                'false'
            );

            fireEvent.click(languages.getByRole('button', { name: 'PT' }));
            expect(mockSetLocale).toHaveBeenCalledWith('pt');
        });
    });

    describe('minimal variant', () => {
        it('shows a single row of links and the language picker', () => {
            localStorage.setItem('dailyPlaceNames', 'casa');
            renderWithProviders(<Footer variant="minimal" showPlaces />);

            expect(screen.getByRole('link', { name: 'Changelog' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Buy me a coffee' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Send feedback' })).toBeInTheDocument();

            expect(screen.queryByText('Product')).not.toBeInTheDocument();
            expect(screen.queryByText('casa')).not.toBeInTheDocument();
            expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
        });
    });
});
