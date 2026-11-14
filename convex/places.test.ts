import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api } from './_generated/api';
import schema from './schema';

const alice = { tokenIdentifier: 'clerk|alice', subject: 'alice', email: 'alice@example.com' };
const bob = { tokenIdentifier: 'clerk|bob', subject: 'bob', email: 'bob@example.com' };

const UNAUTHENTICATED = { data: { code: 'unauthenticated' } };

const task = [{ text: 'Task', ready: false }];

describe('places', () => {
    test('getPlaceNames lists the places of the current user', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: task });
        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'home', tasks: task });
        await t
            .withIdentity(bob)
            .mutation(api.tasks.upsertTasks, { placeName: 'gym', tasks: task });

        expect((await t.withIdentity(alice).query(api.places.getPlaceNames, {})).sort()).toEqual([
            'home',
            'work'
        ]);
        expect(await t.withIdentity(bob).query(api.places.getPlaceNames, {})).toEqual(['gym']);
    });

    test('getPlaceNames returns each place once', async () => {
        const t = convexTest(schema);
        const userId = alice.tokenIdentifier;

        await t.run(async (ctx) => {
            await ctx.db.insert('tasks', {
                userId,
                email: alice.email,
                placeName: 'work',
                tasks: task
            });
            await ctx.db.insert('tasks', {
                userId,
                email: alice.email,
                placeName: 'work',
                tasks: task
            });
            await ctx.db.insert('tasks', {
                userId,
                email: alice.email,
                placeName: '',
                tasks: task
            });
        });

        expect(await t.withIdentity(alice).query(api.places.getPlaceNames, {})).toEqual(['work']);
    });

    test('getPlaceNames returns an empty list without a session', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: task });

        expect(await t.query(api.places.getPlaceNames, {})).toEqual([]);
    });

    test('deletePlace without a session is rejected and deletes nothing', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: task });

        await expect(
            t.mutation(api.places.deletePlace, { placeName: 'work' })
        ).rejects.toMatchObject(UNAUTHENTICATED);
        expect(await t.withIdentity(alice).query(api.places.getPlaceNames, {})).toEqual(['work']);
    });

    test('deletePlace removes the place of the current user only', async () => {
        const t = convexTest(schema);

        await t
            .withIdentity(alice)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: task });
        await t
            .withIdentity(bob)
            .mutation(api.tasks.upsertTasks, { placeName: 'work', tasks: task });
        await t.withIdentity(alice).mutation(api.places.deletePlace, { placeName: 'work' });

        expect(await t.withIdentity(alice).query(api.places.getPlaceNames, {})).toEqual([]);
        expect(await t.withIdentity(bob).query(api.places.getPlaceNames, {})).toEqual(['work']);
    });
});
