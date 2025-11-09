import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  users: defineTable({
    email: v.string(),
    authId: v.optional(v.string()),
  }).index('email', ['email']),

  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('userId', ['userId']),

  workflows: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // e.g., "kyc", "onboarding"
    status: v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("archived")
    ),
    steps: v.array(
      v.object({
        id: v.string(), // unique ID per step
        label: v.string(), // e.g., "Face Match"
        enabled: v.boolean(), // toggle per step
        type: v.union(
          v.literal("id_verification"),
          v.literal("face_match"),
          v.literal("ip_analysis"),
          v.literal("address_check"),
          v.literal("document_validation")
        ),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("status", ["status"]),
});


