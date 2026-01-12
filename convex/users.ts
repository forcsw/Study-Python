import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// 현재 인증된 사용자 정보 가져오기
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

// 사용자 프로필 생성 또는 업데이트
export const upsertProfile = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        image: args.image,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        name: args.name,
        image: args.image,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// 사용자 프로필 업데이트
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("프로필을 찾을 수 없습니다.");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.image !== undefined) updates.image = args.image;

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});
