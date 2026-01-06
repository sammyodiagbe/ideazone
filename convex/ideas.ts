import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const ideas = await ctx.db
      .query("ideas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return ideas.map((idea) => ({
      _id: idea._id,
      name: idea.name,
      rawIdea: idea.rawIdea,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    }));
  },
});

export const get = query({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) return null;

    return idea;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    rawIdea: v.string(),
    generationSettings: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const id = await ctx.db.insert("ideas", {
      userId,
      name: args.name,
      rawIdea: args.rawIdea,
      generationSettings: args.generationSettings,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("ideas"),
    name: v.optional(v.string()),
    rawIdea: v.optional(v.string()),
    clarifiedIdea: v.optional(v.string()),
    prd: v.optional(v.string()),
    mvpScope: v.optional(v.string()),
    competitors: v.optional(v.string()),
    validation: v.optional(v.string()),
    roadmap: v.optional(v.string()),
    timeline: v.optional(v.string()),
    implementationPrompts: v.optional(v.string()),
    generationSettings: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) {
      throw new Error("Idea not found");
    }

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

export const updateSection = mutation({
  args: {
    id: v.id("ideas"),
    section: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) {
      throw new Error("Idea not found");
    }

    const validSections = [
      "clarifiedIdea",
      "prd",
      "mvpScope",
      "competitors",
      "validation",
      "roadmap",
      "timeline",
      "implementationPrompts",
    ];

    if (!validSections.includes(args.section)) {
      throw new Error("Invalid section");
    }

    await ctx.db.patch(args.id, {
      [args.section]: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) {
      throw new Error("Idea not found");
    }

    await ctx.db.delete(args.id);
  },
});
