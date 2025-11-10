import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    questionnaireId: v.id("questionnaires"),
    text: v.string(),
    required: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", args);
  },
});

export const remove = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("questions"),
    text: v.string(),
    required: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      text: args.text,
      required: args.required,
    });
  },
});

export const listByQuestionnaire = query({
  args: { questionnaireId: v.id("questionnaires") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .filter(q => q.eq(q.field("questionnaireId"), args.questionnaireId))
      .order("asc")
      .collect();
    return questions.map((q) => ({ ...q, id: q._id }));
  },
});
