import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api } from './_generated/api';
import schema from './schema';
import { LIMITS } from './validation';

const alice = { tokenIdentifier: 'clerk|alice', subject: 'alice', email: 'alice@example.com' };
const bob = { tokenIdentifier: 'clerk|bob', subject: 'bob', email: 'bob@example.com' };

const UNAUTHENTICATED = { data: { code: 'unauthenticated' } };

const someTasks = [
    { text: 'Write tests', ready: false },
    { text: 'Ship it', ready: true }
];

describe('tasks', () => {
    test('upsert creates the document and getTasks returns it', async () => {
        const t = convexTest(schema).withIdentity(alice);

        await t.mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });

        expect(await t.query(api.tasks.getTasks, { placeName: 'work' })).toEqual(someTasks);
    });

    test('upsert updates the existing document instead of creating another one', async () => {
        const t = convexTest(schema);
        const asAlice = t.withIdentity(alice);

        await asAlice.mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });
        await asAlice.mutation(api.tasks.upsertTasks, {
            placeName: 'work',
            tasks: [{ text: 'Only one', ready: false }]
        });

        const docs = await t.run((ctx) => ctx.db.query('tasks').collect());
        expect(docs).toHaveLength(1);
        expect(docs[0].tasks).toEqual([{ text: 'Only one', ready: false }]);
    });

    test('users only see their own tasks', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });

        expect(await t.withIdentity(bob).query(api.tasks.getTasks, { placeName: 'work' })).toEqual(
            []
        );
    });

    test('getTasks returns an empty list without a session', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });

        expect(await t.query(api.tasks.getTasks, { placeName: 'work' })).toEqual([]);
    });

    test('deleteTasks empties the place of the current user only', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });
        await t
            .withIdentity(bob)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks });
        await t.withIdentity(alice).mutation(api.tasks.deleteTasks, { placeName: 'work' });

        expect(
            await t.withIdentity(alice).query(api.tasks.getTasks, { placeName: 'work' })
        ).toEqual([]);
        expect(await t.withIdentity(bob).query(api.tasks.getTasks, { placeName: 'work' })).toEqual(
            someTasks
        );
    });

    test('mutations without a session are rejected with an error code', async () => {
        const t = convexTest(schema);

        await expect(
            t.mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: someTasks })
        ).rejects.toMatchObject(UNAUTHENTICATED);
        await expect(
            t.mutation(api.tasks.deleteTasks, { placeName: 'work' })
        ).rejects.toMatchObject(UNAUTHENTICATED);
        expect(await t.run((ctx) => ctx.db.query('tasks').collect())).toEqual([]);
    });

    test('upsert rejects payloads over the size limits', async () => {
        const t = convexTest(schema).withIdentity(alice);

        await expect(
            t.mutation(api.tasks.upsertTasks, {
                placeName: 'x'.repeat(LIMITS.placeNameLength + 1),
                tasks: []
            })
        ).rejects.toThrow();
        await expect(
            t.mutation(api.tasks.upsertTasks, {
                placeName: 'work',
                tasks: [{ text: 'x'.repeat(LIMITS.taskTextLength + 1), ready: false }]
            })
        ).rejects.toThrow();
        await expect(
            t.mutation(api.tasks.upsertTasks, {
                placeName: 'work',
                tasks: Array.from({ length: LIMITS.tasksPerPlace + 1 }, () => ({
                    text: 'a',
                    ready: false
                }))
            })
        ).rejects.toThrow();
    });
});
