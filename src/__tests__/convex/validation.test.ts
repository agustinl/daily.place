import { ConvexError } from 'convex/values';

import { assertValidPlaceName, assertValidTasks, LIMITS } from '../../../convex/validation';

const task = (text: string) => ({ text, ready: false });

describe('convex/validation', () => {
    describe('assertValidPlaceName', () => {
        it('accepts regular names, including spaces and accents', () => {
            expect(() => assertValidPlaceName('trabajo')).not.toThrow();
            expect(() => assertValidPlaceName('mi place')).not.toThrow();
            expect(() => assertValidPlaceName('café')).not.toThrow();
            expect(() => assertValidPlaceName('a'.repeat(LIMITS.placeNameLength))).not.toThrow();
        });

        it('rejects empty or blank names', () => {
            expect(() => assertValidPlaceName('')).toThrow(ConvexError);
            expect(() => assertValidPlaceName('   ')).toThrow(ConvexError);
        });

        it('rejects names over the limit', () => {
            expect(() => assertValidPlaceName('a'.repeat(LIMITS.placeNameLength + 1))).toThrow(ConvexError);
        });
    });

    describe('assertValidTasks', () => {
        it('accepts an empty list and lists up to the limit', () => {
            expect(() => assertValidTasks([])).not.toThrow();
            expect(() => assertValidTasks(Array.from({ length: LIMITS.tasksPerPlace }, () => task('x')))).not.toThrow();
        });

        it('rejects too many tasks', () => {
            expect(() =>
                assertValidTasks(Array.from({ length: LIMITS.tasksPerPlace + 1 }, () => task('x')))
            ).toThrow(ConvexError);
        });

        it('accepts task text up to the limit and rejects longer text', () => {
            expect(() => assertValidTasks([task('a'.repeat(LIMITS.taskTextLength))])).not.toThrow();
            expect(() => assertValidTasks([task('a'.repeat(LIMITS.taskTextLength + 1))])).toThrow(ConvexError);
        });
    });
});
