import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get all documents uploaded by a user
export const listDocuments = query({
    args: {},
    handler: async (ctx) => {
        const docs = await ctx.db.query("documents").collect();

        return Promise.all(
            docs.map(async (doc) => ({
                ...doc,
                url: await ctx.storage.getUrl(doc.fileId),
            }))
        );
    },
});
// Generate upload URL
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    }
});

// Save document info after upload
export const saveDocument = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
    },
    handler: async (ctx, { name, fileId }) => {
        await ctx.db.insert("documents", {
            name,
            fileId,
            createdAt: Date.now(),
        });
    },
});

// Get a temporary URL for viewing/downloading a document
export const getDocumentUrl = query({
    args: { fileId: v.id("_storage") },
    handler: async (ctx, { fileId }) => {
        return await ctx.storage.getUrl(fileId);
    },
});

export const searchDocuments = query({
    args: { term: v.string() },
    handler: async (ctx, { term }) => {
        if (!term.trim()) return [];
        return await ctx.db
            .query("documents")
            .withSearchIndex("search_name", (q) => q.search("name", term))
            .collect();
    },
});


export const deleteDocument = mutation({
    args: { id: v.id("documents"), fileId: v.id("_storage") },
    handler: async (ctx, { id, fileId }) => {
        await ctx.db.delete(id);
        await ctx.storage.delete(fileId);
    },
});
