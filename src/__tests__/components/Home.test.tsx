import { fireEvent, screen, within } from '@testing-library/react';

import Home from '@/pages/index';

import messages from '../../../messages/en.json';
import { createMockRouter, renderWithProviders } from '../utils/renderWithProviders';

const mockRouter = createMockRouter();

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

let mockCloudPlaces: string[] = [];

jest.mock('@/hooks/useConvexPlaces', () => ({
    useConvexPlaces: () => ({ places: mockCloudPlaces, isLoading: false, deletePlace: jest.fn() })
}));

describe('<Home />', () => {
    beforeEach(() => {
        localStorage.clear();
        mockCloudPlaces = [];
    });

    it('lists every tool with its description', () => {
        renderWithProviders(<Home />);
        // The hero preview repeats some tool names, so look inside the tools section only
        const tools = within(screen.getByRole('region', { name: messages.home.toolsTitle }));
        const home: Record<string, unknown> = messages.home;
        for (const n of [1, 2, 3, 4, 5, 6, 7]) {
            expect(tools.getByText(home[`tool${n}Title`] as string)).toBeInTheDocument();
            expect(
                tools.getByText(home[`tool${n}Description`] as string, { exact: false })
            ).toBeInTheDocument();
        }
    });

    it('opens the place typed in the form', () => {
        renderWithProviders(<Home />);

        fireEvent.change(screen.getByLabelText(messages.home.createLabel), {
            target: { value: ' casa ' }
        });
        fireEvent.click(screen.getByRole('button', { name: messages.home.createButton }));

        expect(mockRouter.push).toHaveBeenCalledWith('/casa');
    });

    it('shows an error instead of opening a place with an invalid name', () => {
        mockRouter.push.mockClear();
        renderWithProviders(<Home />);

        const input = screen.getByLabelText(messages.home.createLabel);
        fireEvent.change(input, { target: { value: 'a/b' } });
        fireEvent.click(screen.getByRole('button', { name: messages.home.createButton }));

        expect(screen.getByRole('alert')).toHaveTextContent(
            messages.places.nameErrors.invalidCharacters
        );
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('moves focus to the name field from the closing call to action', () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        renderWithProviders(<Home />);

        fireEvent.click(screen.getByRole('link', { name: messages.home.ctaButton }));

        expect(screen.getByLabelText(messages.home.createLabel)).toHaveFocus();
    });

    describe('my places', () => {
        it('hides the list when there are no places', () => {
            renderWithProviders(<Home />);

            expect(screen.queryByText(messages.home.myPlaces)).not.toBeInTheDocument();
        });

        it('lists the places saved in this browser without an account', async () => {
            localStorage.setItem('dailyPlaceNames', 'casa,mi place');
            renderWithProviders(<Home />);

            expect(await screen.findByText(messages.home.myPlaces)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'casa' })).toHaveAttribute('href', '/casa');
            expect(screen.getByRole('link', { name: 'mi place' })).toHaveAttribute(
                'href',
                '/mi%20place'
            );
        });

        it('adds the cloud places without repeating the local ones', async () => {
            localStorage.setItem('dailyPlaceNames', 'casa');
            mockCloudPlaces = ['casa', 'trabajo'];
            renderWithProviders(<Home />);

            await screen.findByRole('link', { name: 'trabajo' });
            expect(screen.getAllByRole('link', { name: 'casa' })).toHaveLength(1);
        });
    });
});
