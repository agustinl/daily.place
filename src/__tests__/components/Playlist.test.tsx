import { fireEvent, screen } from '@testing-library/react';

import Playlist from '@/components/Playlist';
import { renderWithProviders } from '../utils/renderWithProviders';

jest.mock('react-player/youtube', () => ({
    __esModule: true,
    default: () => null
}));

describe('<Playlist />', () => {
    it('starts with every sound off', () => {
        renderWithProviders(<Playlist />);

        expect(screen.getByText('Nothing playing')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rain' })).toHaveAttribute(
            'aria-pressed',
            'false'
        );
        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    it('lists the sounds that are playing and shows their volume', () => {
        renderWithProviders(<Playlist />);

        fireEvent.click(screen.getByRole('button', { name: 'Lofi' }));
        fireEvent.click(screen.getByRole('button', { name: 'Rain' }));

        expect(screen.getByText('Playing: Lofi + Rain')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rain' })).toHaveAttribute(
            'aria-pressed',
            'true'
        );
        expect(screen.getByRole('slider', { name: 'Rain volume' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Lofi' }));

        expect(screen.getByText('Playing: Rain')).toBeInTheDocument();
        expect(screen.queryByRole('slider', { name: 'Lofi volume' })).not.toBeInTheDocument();
    });
});
