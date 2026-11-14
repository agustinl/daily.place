import { screen } from '@testing-library/react';

import Home from '@/pages/index';

import messages from '../../../messages/en.json';
import { createMockRouter, renderWithProviders } from '../utils/renderWithProviders';

const mockRouter = createMockRouter();

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

jest.mock('@/hooks/useConvexPlaces', () => ({
    useConvexPlaces: () => ({ places: [], isLoading: false, deletePlace: jest.fn() })
}));

describe('<Home />', () => {
    it('lists every tool with its description', () => {
        renderWithProviders(<Home />);
        const home: Record<string, string> = messages.home;
        for (const n of [1, 2, 3, 4, 5, 6, 7]) {
            expect(screen.getByText(home[`tool${n}Title`])).toBeInTheDocument();
            expect(
                screen.getByText(home[`tool${n}Description`], { exact: false })
            ).toBeInTheDocument();
        }
    });
});
