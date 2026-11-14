import { fireEvent, screen } from '@testing-library/react';

import ForkPlace from '@/components/modals/ForkPlace';

import { PRODUCTION_STORAGE, seedProductionStorage } from '../fixtures/productionStorage';
import { createMockRouter, renderWithProviders } from '../utils/renderWithProviders';

const mockRouter = createMockRouter({ pathname: '/[name]', query: { name: 'trabajo' } });

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

const setup = () => {
    const onClose = jest.fn();
    renderWithProviders(<ForkPlace name="trabajo" open onClose={onClose} />);
    const input = screen.getByLabelText('New place name');
    const submit = (value: string) => {
        fireEvent.change(input, { target: { value } });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    };
    return { onClose, submit };
};

describe('<ForkPlace />', () => {
    beforeEach(() => {
        seedProductionStorage();
        jest.clearAllMocks();
    });

    it('rejects a place name that already exists', () => {
        const { onClose, submit } = setup();
        submit('casa');
        expect(screen.getByText('Place casa already exist')).toBeInTheDocument();
        expect(mockRouter.push).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(localStorage.getItem('dailyTodo_casa')).toBe(PRODUCTION_STORAGE.dailyTodo_casa);
    });

    it('copies todo + pomodoro to the new place keys and navigates', () => {
        const { onClose, submit } = setup();
        submit('copia');
        expect(localStorage.getItem('dailyTodo_copia')).toBe(PRODUCTION_STORAGE.dailyTodo_trabajo);
        expect(localStorage.getItem('dailyPomodoro_copia')).toBe(PRODUCTION_STORAGE.dailyPomodoro_trabajo);
        // Source place is untouched
        expect(localStorage.getItem('dailyTodo_trabajo')).toBe(PRODUCTION_STORAGE.dailyTodo_trabajo);
        expect(onClose).toHaveBeenCalledWith(false);
        expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/copia' });
    });
});
