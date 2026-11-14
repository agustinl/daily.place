import { canStorePlaceName, validatePlaceName } from '@/helpers/placeName';

describe('validatePlaceName', () => {
    it('accepts the names people already use', () => {
        for (const name of ['trabajo', 'mi place', 'café', 'Work-2024', 'a'.repeat(100)]) {
            expect(validatePlaceName(name)).toBeNull();
        }
    });

    it('requires a non-blank name', () => {
        expect(validatePlaceName('')).toBe('required');
        expect(validatePlaceName('   ')).toBe('required');
    });

    it('rejects characters that break the places list or the URL', () => {
        for (const name of ['a,b', 'a/b', 'a\\b', 'a?b', 'a#b', '100%']) {
            expect(validatePlaceName(name)).toBe('invalidCharacters');
        }
    });

    it('rejects names over the length limit, ignoring surrounding spaces', () => {
        expect(validatePlaceName('a'.repeat(101))).toBe('tooLong');
        expect(validatePlaceName(` ${'a'.repeat(100)} `)).toBeNull();
    });
});

describe('canStorePlaceName', () => {
    it('only rejects empty names and names with commas', () => {
        expect(canStorePlaceName('mi place')).toBe(true);
        expect(canStorePlaceName('')).toBe(false);
        expect(canStorePlaceName('a,b')).toBe(false);
    });
});
