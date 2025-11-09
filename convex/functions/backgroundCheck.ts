import { v } from 'convex/values'
import { action, mutation, query } from '../_generated/server'

export const createCandidate = mutation({
    args: {
        name: v.string(),
        emails: v.array(v.string()),
        profiles: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        // const candidateId = await ctx.db.insert("candidates", {
        //     name: args.name,
        //     emails: args.emails,
        //     profiles: args.profiles,
        //     createdAt: new Date().toISOString(),
        // })
        // return candidateId
    },
})

export const saveBackgroundReport = mutation({
    args: {
        candidateId: v.id("candidates"),
        summary: v.object({
            reputationScore: v.number(),
            flags: v.array(v.string()),
            highlights: v.array(v.string()),
        }),
        rawResults: v.array(
            v.object({
                url: v.string(),
                title: v.optional(v.string()),
                snippet: v.optional(v.string()),
                source: v.string(),
                fetchedAt: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // const reportId = await ctx.db.insert("reports", {
        //     candidateId: args.candidateId,
        //     summary: args.summary,
        //     rawResults: args.rawResults,
        //     createdAt: new Date().toISOString(),
        // })
        // return reportId
    },
})