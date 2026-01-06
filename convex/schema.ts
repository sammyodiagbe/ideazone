import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // You can add additional tables here as needed
  // For example, to store user-specific data:
  ideas: defineTable({
    userId: v.id("users"),
    rawIdea: v.string(),
    clarifiedIdea: v.optional(v.string()),
    prd: v.optional(v.string()),
    mvpScope: v.optional(v.string()),
    roadmap: v.optional(v.string()),
    timeline: v.optional(v.string()),
    prompts: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
