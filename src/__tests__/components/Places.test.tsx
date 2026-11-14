/**
 * Characterization tests for the places menu (<Places />).
 */
import { act, fireEvent, renderHook, screen, waitFor } from '@testing-library/react';

import Places, { getShareUrl } from '@/components/common/Places';
import { usePlaceNames } from '@/hooks/usePlaceNames';

import { PRODUCTION_STORAGE, seedProductionStorage } from '../fixtures/productionStorage';
import { createMockRouter, renderWithProviders } from '../utils/renderWithProviders';

let mockRouter = createMockRouter();

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

const mockDeletePlace = jest.fn((_name: string) => Promise.resolve());

jest.mock('@/hooks/useConvexPlaces', () => ({
    useConvexPlaces: () => ({ places: [], isLoading: false, deletePlace: mockDeletePlace })
}));

let mockSignedIn = true;

jest.mock('@clerk/nextjs', () => ({
    useUser: () => ({ isSignedIn: mockSignedIn, isLoaded: true })
}));

const mockShowNotification = jest.fn();

jest.mock('@mantine/notifications', () => ({
    notifications: { show: (...args: unknown[]) => mockShowNotification(...args) }
}));

const openMenu = async () => {
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Menu' }));
    await screen.findByText('My places');
};

const setup = async (name: string, query: Record<string, unknown> = {}) => {
    mockRouter = createMockRouter({ pathname: '/[name]', query: { name, ...query } });
    renderWithProviders(<Places name={name} />);
    await screen.findByRole('button', { name: 'Menu' });
    await openMenu();
};

describe('<Places />', () => {
    beforeEach(() => {
        seedProductionStorage();
        jest.clearAllMocks();
        mockSignedIn = true;
    });

    it('links each place to its page', async () => {
        await setup('trabajo');
        expect(screen.getByRole('menuitem', { name: /casa/ })).toHaveAttribute('href', '/casa');
        expect(screen.getByRole('menuitem', { name: /mi place/ })).toHaveAttribute(
            'href',
            '/mi%20place'
        );
    });

    it('lists a newly visited place without a router change', async () => {
        await setup('trabajo');
        renderHook(() => usePlaceNames('nuevo'));
        expect(await screen.findByText('nuevo')).toBeInTheDocument();
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,casa,mi place,nuevo');
    });

    it('builds an encoded share link', async () => {
        await setup('mi place');
        const href = screen.getByText('Share place').closest('a')!.getAttribute('href')!;
        const url = new URL(href);
        expect(url.origin + url.pathname).toBe('https://x.com/intent/tweet');
        expect(url.searchParams.get('text')).toBe("mi place's place by");
        expect(url.searchParams.get('url')).toBe('https://daily.place/mi%20place');
        expect(new URL(getShareUrl('a&b=c#d')).searchParams.get('url')).toBe(
            'https://daily.place/a%26b%3Dc%23d'
        );
    });

    it('signed-out users delete the place locally without calling the cloud', async () => {
        mockSignedIn = false;
        await setup('casa');
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,mi place');
        expect(mockDeletePlace).not.toHaveBeenCalled();
    });

    it('a failed cloud delete shows an error but keeps the local deletion', async () => {
        mockDeletePlace.mockRejectedValueOnce(new Error('network'));
        await setup('casa');
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,mi place');
        expect(mockShowNotification).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Could not delete the place from the cloud',
                color: 'red'
            })
        );
    });

    it('renders nothing when the user has no places', () => {
        localStorage.clear();
        mockRouter = createMockRouter();
        renderWithProviders(<Places name="" />);
        expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument();
    });

    it('lists every place from dailyPlaceNames', async () => {
        await setup('trabajo');
        expect(screen.getByText('trabajo')).toBeInTheDocument();
        expect(screen.getByText('casa')).toBeInTheDocument();
        expect(screen.getByText('mi place')).toBeInTheDocument();
    });

    it('toggling confetti writes the JSON boolean', async () => {
        await setup('trabajo');
        // fixture has confettiEnabled=false → menu offers to enable it
        fireEvent.click(await screen.findByText('Enable confetti'));
        expect(localStorage.getItem('confettiEnabled')).toBe('true');
    });

    it('deleting a place (opened from the menu, with idx) removes it locally and in the cloud', async () => {
        await setup('casa', { idx: '1' });
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,mi place');
        expect(mockDeletePlace).toHaveBeenCalledWith('casa');
    });

    it('deleting a place opened by direct URL (no idx) removes that place', async () => {
        await setup('casa');
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,mi place');
    });

    it('ignores a stale idx pointing to another place', async () => {
        await setup('casa', { idx: '0' });
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        expect(localStorage.getItem('dailyPlaceNames')).toBe('trabajo,mi place');
    });

    it('deleting the only place leaves an empty list', async () => {
        localStorage.setItem('dailyPlaceNames', 'casa');
        await setup('casa');
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
        // jest-localstorage-mock returns null for '' (browsers return '')
        expect(localStorage.getItem('dailyPlaceNames') ?? '').toBe('');
        expect(mockDeletePlace).toHaveBeenCalledWith('casa');
    });

    it('does not touch tasks or pomodoro keys of other places', async () => {
        await setup('casa', { idx: '1' });
        await act(async () => {
            fireEvent.click(screen.getByText('Delete this place'));
        });
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalled());
        expect(localStorage.getItem('dailyTodo_trabajo')).toBe(
            PRODUCTION_STORAGE.dailyTodo_trabajo
        );
        expect(localStorage.getItem('dailyPomodoro_trabajo')).toBe(
            PRODUCTION_STORAGE.dailyPomodoro_trabajo
        );
    });
});
