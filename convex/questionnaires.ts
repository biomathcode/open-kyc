import { v } from "convex/values";

import { mutation, query } from "./_generated/server";




export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("questionnaires", {
            ...args,
            isPublished: false,
            createdAt: Date.now(),
        });
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("questionnaires").collect();
    },
});


export const get = query({
    args: { id: v.id("questionnaires") },
    handler: async (ctx, args) => {
        const questionnaire = await ctx.db.get(args.id);
        if (!questionnaire) throw new Error("Questionnaire not found");
        return { ...questionnaire, id: questionnaire._id };
    },
});

export const update = mutation({
    args: {
        id: v.id("questionnaires"),
        title: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            title: args.title,
            description: args.description,
        });
    },
});



export const remove = mutation({
    args: { id: v.id("questionnaires") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
})
