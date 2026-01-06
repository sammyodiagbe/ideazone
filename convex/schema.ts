import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  ideas: defineTable({
    userId: v.id("users"),
    name: v.string(),
    rawIdea: v.string(),
    clarifiedIdea: v.optional(v.string()),
    prd: v.optional(v.string()),
    mvpScope: v.optional(v.string()),
    competitors: v.optional(v.string()),
    validation: v.optional(v.string()),
    roadmap: v.optional(v.string()),
    timeline: v.optional(v.string()),
    implementationPrompts: v.optional(v.string()),
    generationSettings: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
