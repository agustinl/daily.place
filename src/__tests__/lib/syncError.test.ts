import { ConvexError } from 'convex/values';
import { createTranslator } from 'next-intl';

import { getSyncErrorMessage } from '@/lib/syncError';
import { syncError } from '../../../convex/errors';
import messages from '../../../messages/en.json';

const t = createTranslator({ locale: 'en', messages }) as unknown as Parameters<
    typeof getSyncErrorMessage
>[1];

describe('getSyncErrorMessage', () => {
    it('translates known error codes, including the limit', () => {
        expect(getSyncErrorMessage(syncError('unauthenticated'), t)).toBe(
            'Sign in to sync your tasks'
        );
        expect(getSyncErrorMessage(syncError('tooManyTasks', 500), t)).toBe(
            'A place can have up to 500 tasks'
        );
    });

    it('falls back to a generic message for anything else', () => {
        const generic = 'Something went wrong. Please try again.';
        expect(getSyncErrorMessage(new Error('[Request ID: abc] Server Error'), t)).toBe(generic);
        expect(getSyncErrorMessage(new ConvexError('plain string'), t)).toBe(generic);
        expect(getSyncErrorMessage(new ConvexError({ code: 'notACode' }), t)).toBe(generic);
        expect(getSyncErrorMessage(undefined, t)).toBe(generic);
    });
});
