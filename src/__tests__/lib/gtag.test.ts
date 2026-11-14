// lib/gtag is plain JS, so its inferred parameter types are too strict for these calls
type GtagModule = {
    pageview: (url: string) => void;
    event: (params: { action: string; category?: string; label?: string; value?: number }) => void;
};

const loadGtag = (trackingId: string | undefined): GtagModule => {
    if (trackingId === undefined) {
        delete process.env.NEXT_PUBLIC_GA_ID;
    } else {
        process.env.NEXT_PUBLIC_GA_ID = trackingId;
    }
    let mod: GtagModule | undefined;
    jest.isolateModules(() => {
        mod = jest.requireActual<GtagModule>('@/lib/gtag');
    });
    return mod!;
};

describe('lib/gtag', () => {
    const originalId = process.env.NEXT_PUBLIC_GA_ID;
    const mockGtag = jest.fn();

    beforeEach(() => {
        mockGtag.mockClear();
        (window as unknown as { gtag?: unknown }).gtag = mockGtag;
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_GA_ID = originalId;
    });

    it('sends events and page views when a tracking ID is set', () => {
        const gtag = loadGtag('G-TEST');
        gtag.pageview('/work');
        gtag.event({ action: 'task_added', category: 'todo', label: 'New task' });
        expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST', { page_path: '/work' });
        expect(mockGtag).toHaveBeenCalledWith('event', 'task_added', expect.objectContaining({ event_category: 'todo' }));
    });

    it('does nothing without a tracking ID', () => {
        const gtag = loadGtag(undefined);
        gtag.pageview('/work');
        gtag.event({ action: 'task_added' });
        expect(mockGtag).not.toHaveBeenCalled();
    });

    it('does not throw when the gtag script was blocked', () => {
        delete (window as unknown as { gtag?: unknown }).gtag;
        const gtag = loadGtag('G-TEST');
        expect(() => gtag.pageview('/work')).not.toThrow();
        expect(() => gtag.event({ action: 'task_added' })).not.toThrow();
    });
});
