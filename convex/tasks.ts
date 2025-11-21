import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/*
 * Get tasks for a specific user and place
 */
export const getTasks = query({
  args: {
    placeName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    // Search for the tasks document for this user and place
    const tasksDoc = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_place", (q) =>
        q.eq("userId", userId).eq("placeName", args.placeName)
      )
      .first();

    return tasksDoc?.tasks ?? [];
  },
});

/*
 * Upsert tasks for a specific user and place
 */
export const upsertTasks = mutation({
  args: {
    placeName: v.string(),
    tasks: v.array(
      v.object({
        text: v.string(),
        ready: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return;
    }

    const userId = identity.tokenIdentifier;
    const email = identity.email ?? "";

    // Search for the document for this user and place
    const existingDoc = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_place", (q) =>
        q.eq("userId", userId).eq("placeName", args.placeName)
      )
      .first();

    if (existingDoc) {
      // Update the existing document
      await ctx.db.patch(existingDoc._id, {
        tasks: args.tasks,
      });
      return existingDoc._id;
    } else {
      // Create a new document
      const newId = await ctx.db.insert("tasks", {
        userId,
        email,
        placeName: args.placeName,
        tasks: args.tasks,
      });
      return newId;
    }
  },
});

/*
 * Delete tasks for a specific user and place
 */
export const deleteTasks = mutation({
  args: {
    placeName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
		return;
    }

    const userId = identity.tokenIdentifier;

    // Search for the document
    const existingDoc = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_place", (q) =>
        q.eq("userId", userId).eq("placeName", args.placeName)
      )
      .first();

    if (existingDoc) {
      // Update with empty array
      await ctx.db.patch(existingDoc._id, {
        tasks: [],
      });
    }
  },
});
