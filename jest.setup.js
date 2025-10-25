// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-localstorage-mock'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  })),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}))

// Mock Google Analytics
global.gtag = jest.fn()

// Mock window.dispatchEvent for localStorage sync
const originalDispatchEvent = window.dispatchEvent
window.dispatchEvent = jest.fn((event) => {
  return originalDispatchEvent.call(window, event)
})

// Mock Mantine hooks
jest.mock('@mantine/hooks', () => ({
  ...jest.requireActual('@mantine/hooks'),
  useHotkeys: jest.fn(),
}))

// Mock Mantine notifications
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
    hide: jest.fn(),
    clean: jest.fn(),
    cleanQueue: jest.fn(),
  },
  cleanNotifications: jest.fn(),
}))

// Mock confetti
jest.mock('js-confetti', () => {
  return jest.fn().mockImplementation(() => ({
    addConfetti: jest.fn(),
  }))
})

// Mock analytics hook
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
  }),
}))

// Mock confetti hook
jest.mock('@/hooks/useConfetti', () => ({
  useConfetti: () => ({
    celebrate: jest.fn(),
  }),
}))

// Mock pomodoro notifications hook
jest.mock('@/hooks/usePomodoroNotifications', () => ({
  usePomodoroNotifications: () => ({
    showPomodoroEndNotification: jest.fn(),
    showShortBreakEndNotification: jest.fn(),
    showLongBreakEndNotification: jest.fn(),
  }),
}))

