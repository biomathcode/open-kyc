import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

export const storeScrapeResult = internalMutation({
    args: v.object({
        siteUrl: v.string(),
        workflowId: v.string(),
        analysis: v.any(),

        companyName: v.string(),
        incorporationNumber: v.string(),
        jurisdiction: v.string(),

        registeredAddress: v.string(),
        operationalAddresses: v.array(v.string()),

        emails: v.array(v.string()),
        phones: v.array(v.string()),
        websites: v.array(v.string()),

        directors: v.array(
            v.object({
                name: v.string(),
                role: v.string(),
            })
        ),

        ownership: v.string(),
        businessActivities: v.array(v.string()),
        paymentMethods: v.array(v.string()),

        privacyPolicyText: v.string(),
        termsText: v.string(),
        socialLinks: v.array(v.string()),

        registrationDates: v.object({
            incorporationDate: v.string(),
        }),


        amlRiskScore: v.number(),
        amlRiskCategory: v.string(),      // low | medium | high
        amlRecommendedState: v.string(),  // safe | review | flagged

        detectedIssues: v.array(
            v.object({
                issue: v.string(),
                confidence: v.number(),
                evidence: v.string(),
            })
        ),

        suggestedNextSteps: v.array(v.string()),
        amlNotes: v.string(),
        status: v.optional(v.string()),
    }),
    handler: async (ctx, args): Promise<string> => {
        // Find existing entry by workflowId and update it, or create new one
        const existing = await ctx.db
            .query("siteAnalysis")
            .withIndex("by_workflowId", (q) => q.eq("workflowId", args.workflowId))
            .first();

        if (existing) {
            // Update existing placeholder entry
            await ctx.db.patch(existing._id, {
                ...args,
                analysis: args.analysis,

            });
            return existing._id;
        } else {
            // Create new entry if it doesn't exist (shouldn't happen, but safety)
            const result = await ctx.db.insert("siteAnalysis", {
                ...args,
                status: args.status ?? "pending",
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

            nationality: v.optional(v.string()),
            issuing_state: v.optional(v.string()),
            address: v.optional(v.string()),
            document_number: v.optional(v.string()),
            document_type: v.optional(v.string()),

            gender: v.optional(v.string()),

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

            news_results: v.optional(
                v.array(
                    v.object({
                        url: v.string(),
                        title: v.string(),
                        description: v.string(),
                        position: v.number(),
                    })
                )
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