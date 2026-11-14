import en from '../../../messages/en.json';
import es from '../../../messages/es.json';
import pt from '../../../messages/pt.json';

type Messages = { [key: string]: string | Messages };

const placeholders = (text: string): string[] =>
    Array.from(text.matchAll(/\{(\w+)/g), (match) => match[1]).sort();

const flatten = (messages: Messages, prefix = ''): Record<string, string> =>
    Object.entries(messages).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[`${prefix}${key}`] = value;
            return acc;
        }
        return { ...acc, ...flatten(value, `${prefix}${key}.`) };
    }, {});

describe('translation messages', () => {
    const reference = Object.keys(flatten(en)).sort();

    it.each([
        ['es', es],
        ['pt', pt]
    ])('%s has the same keys as en', (_locale, messages) => {
        expect(Object.keys(flatten(messages)).sort()).toEqual(reference);
    });

    it.each([
        ['en', en],
        ['es', es],
        ['pt', pt]
    ])('%s has no empty messages', (_locale, messages) => {
        const empty = Object.entries(flatten(messages))
            .filter(([, text]) => text.trim() === '')
            .map(([key]) => key);
        expect(empty).toEqual([]);
    });

    it.each([
        ['es', es],
        ['pt', pt]
    ])('%s uses the same placeholders as en', (_locale, messages) => {
        const source = flatten(en);
        const target = flatten(messages);
        const mismatched = Object.keys(source).filter(
            (key) =>
                key in target &&
                placeholders(source[key]).join() !== placeholders(target[key]).join()
        );
        expect(mismatched).toEqual([]);
    });
});
