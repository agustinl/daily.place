import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/*
 * Get all placenames for a specific user
 */
export const getPlaceNames = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    // Get all task documents for this user
    const allDocs = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Extract unique placenames
    const placeNames = allDocs
      .map((doc) => doc.placeName)
      .filter((name) => name); // Filter out any empty names

    return placeNames;
  },
});

/*
 * Delete a place (entire row) for a specific user
 */
export const deletePlace = mutation({
  args: {
    placeName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return;
    }

    const userId = identity.tokenIdentifier;

    // Search for the document for this user and place
    const existingDoc = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_place", (q) =>
        q.eq("userId", userId).eq("placeName", args.placeName)
      )
      .first();

    if (existingDoc) {
      // Delete the entire document
      await ctx.db.delete(existingDoc._id);
    }
  },
});
