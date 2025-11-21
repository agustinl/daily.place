import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    tasks: defineTable({
        userId: v.string(),
        email: v.string(),
        placeName: v.string(),
        tasks: v.array(
            v.object({
                text: v.string(),
                ready: v.boolean()
            })
        )
    })
        .index('by_user', ['userId'])
        .index('by_user_and_place', ['userId', 'placeName'])
});
