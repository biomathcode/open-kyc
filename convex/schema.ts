import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({

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

  documents: defineTable({
    name: v.string(),
    fileId: v.id("_storage"), // Convex file reference
    createdAt: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    staged: false,
  }),



  questionnaires: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    // createdBy:  v.optional(v.string()),
    isPublished: v.boolean(),
    createdAt: v.number(),
  }),


  questions: defineTable({
    questionnaireId: v.id("questionnaires"),
    text: v.string(),
    required: v.boolean(),
    order: v.number(),
  }),

  feedback: defineTable({
    questionnaireId: v.id("questionnaires"),
    questionId: v.id("questions"),
    value: v.string(), // user’s text input
    submittedAt: v.number(),
  }),

  siteAnalysis: defineTable({
    siteUrl: v.string(),
    workflowId: v.string(),
    analysis: v.string(),
  }).index("by_workflowId", ["workflowId"]),

  sessions: defineTable({
    username: v.optional(v.string()),
    email: v.optional(v.string()),

    workflowId: v.id("workflows"),
    status: v.union(
      v.literal("initiated"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("expired")
    ),
    step: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    dob: v.optional(v.string()), // ISO date
    gender: v.optional(v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("other"),
      v.literal("unspecified")
    )),
    nationality: v.optional(v.string()),
    issuing_state: v.optional(v.string()),
    address: v.optional(v.string()),
    document_number: v.optional(v.string()),

    document_type: v.optional(v.string()),

    phone_number: v.optional(v.string()),


    front_image: v.optional(v.id("_storage")),
    back_image: v.optional(v.id("_storage")),
    person_image: v.optional(v.id("_storage")),


    device: v.optional(v.string()), // e.g., "iPhone 14", "MacBook Pro"
    browser: v.optional(v.string()), // e.g., "Chrome", "Safari"
    os: v.optional(v.string()), // e.g., "iOS", "Windows"
    ipAddress: v.optional(v.string()),
    geolocation: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
        country: v.optional(v.string()),
        city: v.optional(v.string()),
      })
    ),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),

  })

});