import { ReactElement, ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { theme } from '@/constants/theme';
import messages from '../../../messages/en.json';

const Providers = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        {/* env="test" disables transitions and portals so modals/menus render synchronously */}
        <MantineProvider theme={theme} env="test">
            {children}
        </MantineProvider>
    </NextIntlClientProvider>
);

/**
 * Render a component wrapped with the same providers used in `_app.tsx`
 * (Mantine + next-intl with English messages).
 */
export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: Providers, ...options });

/**
 * Stable router mock. `useLocalStorage` re-reads storage whenever `router.query`
 * changes identity, so the mock must return the same object across renders.
 */
export const createMockRouter = (overrides: Record<string, unknown> = {}) => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    beforePopState: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides
});
