import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";


export const storeScrapeResult = internalMutation({
    args: { siteUrl: v.string(), workflowId: v.string(), analysis: v.string() },
    handler: async (ctx, args): Promise<string> => {
        // Find existing entry by workflowId and update it, or create new one
        const existing = await ctx.db
            .query("siteAnalysis")
            .withIndex("by_workflowId", (q) => q.eq("workflowId", args.workflowId))
            .first();

        if (existing) {
            // Update existing placeholder entry
            await ctx.db.patch(existing._id, {
                analysis: args.analysis,
            });
            return existing._id;
        } else {
            // Create new entry if it doesn't exist (shouldn't happen, but safety)
            const result = await ctx.db.insert("siteAnalysis", {
                siteUrl: args.siteUrl,
                workflowId: args.workflowId,
                analysis: args.analysis,
            });
            return result;
        }
    },
})




export const internalUpdateSession = internalMutation({
    args: {
        sessionId: v.id("sessions"),
        updates: v.object({
            status: v.optional(
                v.union(
                    v.literal("initiated"),
                    v.literal("in_progress"),
                    v.literal("completed"),
                    v.literal("failed"),
                    v.literal("expired")
                )
            ),
            step: v.optional(v.string()),

            // Personal info
            first_name: v.optional(v.string()),
            last_name: v.optional(v.string()),
            dob: v.optional(v.string()),
            gender: v.optional(
                v.union(
                    v.literal("male"),
                    v.literal("female"),
                    v.literal("other"),
                    v.literal("unspecified")
                )
            ),
            nationality: v.optional(v.string()),
            issuing_state: v.optional(v.string()),
            address: v.optional(v.string()),
            document_number: v.optional(v.string()),
            document_type: v.optional(v.string()),

            // Files
            front_image: v.optional(v.id("_storage")),
            back_image: v.optional(v.id("_storage")),
            person_image: v.optional(v.id("_storage")),

            // Analytics
            device: v.optional(v.string()),
            browser: v.optional(v.string()),
            os: v.optional(v.string()),
            ipAddress: v.optional(v.string()),
            ip: v.optional(v.string()),
            userAgent: v.optional(v.string()),
            geolocation: v.optional(
                v.object({
                    latitude: v.number(),
                    longitude: v.number(),
                    country: v.optional(v.string()),
                    city: v.optional(v.string()),
                })
            ),
        }),
    },

    handler: async (ctx, { sessionId, updates }) => {
        const session = await ctx.db.get(sessionId);
        if (!session) throw new Error("Session not found");

        await ctx.db.patch(sessionId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});


export const getScrapeResult = query({
    handler: async (ctx) => {
        const result = await ctx.db.query("siteAnalysis").collect();
        return result
    },
})

export const getScrapeResultById = query({
    args: { id: v.id("siteAnalysis") },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result
    },
})

export const deleteAnalysis = mutation({
    args: { id: v.id("siteAnalysis") },
    returns: v.null(),
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return null;
    },
})