import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// ✅ Create a new session
export const createSession = mutation({
    args: {
        workflowId: v.id("workflows"),
        username: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const sessionId = await ctx.db.insert("sessions", {
            ...args,
            status: "initiated",
            step: "start",
            createdAt: now,
            updatedAt: now,
        });

        return { sessionId };
    },
});

// ✅ Get all sessions (optionally filtered)
export const getSessions = query({
    args: {
        workflowId: v.optional(v.id("workflows")),
        status: v.optional(
            v.union(
                v.literal("initiated"),
                v.literal("in_progress"),
                v.literal("completed"),
                v.literal("failed"),
                v.literal("expired")
            )
        ),
    },
    handler: async (ctx) => {
        const sessions = await ctx.db.query("sessions").collect();

        return sessions;
    },
});

// ✅ Get single session by ID
export const getSessionById = query({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, { sessionId }) => {
        const session = await ctx.db.get(sessionId);

        if (!session) throw new Error("Session not found");

        // Get storage URLs (if IDs exist)
        const frontImageUrl = session.front_image
            ? await ctx.storage.getUrl(session.front_image)
            : undefined;

        const backImageUrl = session.back_image
            ? await ctx.storage.getUrl(session.back_image)
            : undefined;

        const personImageUrl = session.person_image
            ? await ctx.storage.getUrl(session.person_image)
            : undefined;

        return {
            ...session,
            front_image: frontImageUrl,
            back_image: backImageUrl,
            person_image: personImageUrl,
        };
    },
});

// ✅ Update session (progressively)
export const updateSession = mutation({
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

// ✅ Delete session
export const deleteSession = mutation({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, { sessionId }) => {
        await ctx.db.delete(sessionId);
        return { success: true };
    },
});



