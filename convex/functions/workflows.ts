import { v } from "convex/values";

import { authComponent } from "../auth";
import { mutation, query } from "./../_generated/server";


export const getWorkflows = query({
    args: {
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("pending"),
                v.literal("archived")
            )
        ),
    },
    handler: async (ctx, args) => {


        const authUser = await authComponent.getAuthUser(ctx);
        if (!authUser._id) {
            throw new Error("User must be authenticated to create a draft");

        }

        const betterAuthUserId = authUser._id;

        const table = ctx.db.query("workflows");

        const status = args.status;
        if (status) {
            return await table
                .withIndex("status", (q) => q.eq("status", status))
                .filter((q) => q.eq(q.field("betterAuthUserId"), betterAuthUserId))
                .collect();
        }

        return await table.collect();
    },
});


export const getWorkflowById = query({
    args: { id: v.id("workflows") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});


export const createWorkflow = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        type: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("pending"),
            v.literal("archived")
        ),
        steps: v.array(
            v.object({
                id: v.string(),
                label: v.string(),
                enabled: v.boolean(),
                type: v.union(
                    v.literal("id_verification"),
                    v.literal("face_match"),
                    v.literal("ip_analysis"),
                    v.literal("address_check"),
                    v.literal("document_validation")
                ),
            })
        ),
    },
    handler: async (ctx, args) => {
        const now = Date.now();


        const authUser = await authComponent.getAuthUser(ctx);
        if (!authUser._id) {
            throw new Error("User must be authenticated to create a draft");
        }

        const betterAuthUserId = authUser._id;

        const id = await ctx.db.insert("workflows", {
            ...args,
            betterAuthUserId: betterAuthUserId,
            createdAt: now,
            updatedAt: now,
        });

        return id;
    },
});

export const updateWorkflow = mutation({
    args: {
        id: v.id("workflows"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        type: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("pending"),
                v.literal("archived")
            )
        ),
        steps: v.optional(
            v.array(
                v.object({
                    id: v.string(),
                    label: v.string(),
                    enabled: v.boolean(),
                    type: v.union(
                        v.literal("id_verification"),
                        v.literal("face_match"),
                        v.literal("ip_analysis"),
                        v.literal("address_check"),
                        v.literal("document_validation")
                    ),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});



export const deleteWorkflow = mutation({
    args: { id: v.id("workflows") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});