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

// [임시] 모든 프로필 삭제 (데이터 정리용)
export const deleteAllProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }
    return { deleted: profiles.length };
  },
});

// [디버그] 모든 데이터 확인
export const debugAllData = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    const progress = await ctx.db.query("progress").collect();
    const authAccounts = await ctx.db.query("authAccounts").collect();
    const users = await ctx.db.query("users").collect();
    return {
      profileCount: profiles.length,
      progressCount: progress.length,
      authAccountsCount: authAccounts.length,
      usersCount: users.length,
      profiles,
      progress,
      authAccounts,
      users,
    };
  },
});

// [임시] 모든 데이터 완전 삭제 - 모든 인증 및 사용자 관련 데이터 삭제
export const deleteAllData = mutation({
  args: {},
  handler: async (ctx) => {
    let result = {
      users: 0,
      authAccounts: 0,
      authSessions: 0,
      authRefreshTokens: 0,
      authVerifiers: 0,
      authVerificationCodes: 0,
      authRateLimits: 0,
      profiles: 0,
      progress: 0,
    };

    // 1. authRefreshTokens 삭제
    const authRefreshTokens = await ctx.db.query("authRefreshTokens").collect();
    for (const token of authRefreshTokens) {
      await ctx.db.delete(token._id);
      result.authRefreshTokens++;
    }

    // 2. authSessions 삭제
    const authSessions = await ctx.db.query("authSessions").collect();
    for (const session of authSessions) {
      await ctx.db.delete(session._id);
      result.authSessions++;
    }

    // 3. authAccounts 삭제
    const authAccounts = await ctx.db.query("authAccounts").collect();
    for (const account of authAccounts) {
      await ctx.db.delete(account._id);
      result.authAccounts++;
    }

    // 4. authVerifiers 삭제 (OAuth PKCE)
    const authVerifiers = await ctx.db.query("authVerifiers").collect();
    for (const verifier of authVerifiers) {
      await ctx.db.delete(verifier._id);
      result.authVerifiers++;
    }

    // 5. authVerificationCodes 삭제
    const authVerificationCodes = await ctx.db.query("authVerificationCodes").collect();
    for (const code of authVerificationCodes) {
      await ctx.db.delete(code._id);
      result.authVerificationCodes++;
    }

    // 6. authRateLimits 삭제
    const authRateLimits = await ctx.db.query("authRateLimits").collect();
    for (const limit of authRateLimits) {
      await ctx.db.delete(limit._id);
      result.authRateLimits++;
    }

    // 7. profiles 삭제
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
      result.profiles++;
    }

    // 8. progress 삭제
    const progress = await ctx.db.query("progress").collect();
    for (const prog of progress) {
      await ctx.db.delete(prog._id);
      result.progress++;
    }

    // 9. users 삭제 (마지막에)
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
      result.users++;
    }

    return result;
  },
});

// [임시] 모든 고아 데이터 정리 - users 테이블에 없는 모든 관련 데이터 삭제
export const cleanupAllOrphanData = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const validUserIds = new Set(users.map((u) => u._id));

    let result = {
      authAccounts: 0,
      authSessions: 0,
      authRefreshTokens: 0,
      profiles: 0,
      progress: 0,
    };

    // authAccounts 정리
    const authAccounts = await ctx.db.query("authAccounts").collect();
    for (const account of authAccounts) {
      if (!validUserIds.has(account.userId)) {
        await ctx.db.delete(account._id);
        result.authAccounts++;
      }
    }

    // authSessions 정리
    const authSessions = await ctx.db.query("authSessions").collect();
    for (const session of authSessions) {
      if (!validUserIds.has(session.userId)) {
        await ctx.db.delete(session._id);
        result.authSessions++;
      }
    }

    // authRefreshTokens 정리 (sessionId로 연결됨)
    const authRefreshTokens = await ctx.db.query("authRefreshTokens").collect();
    const validSessionIds = new Set(authSessions.filter(s => validUserIds.has(s.userId)).map(s => s._id));
    for (const token of authRefreshTokens) {
      if (!validSessionIds.has(token.sessionId)) {
        await ctx.db.delete(token._id);
        result.authRefreshTokens++;
      }
    }

    // profiles 정리
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      if (!validUserIds.has(profile.userId as any)) {
        await ctx.db.delete(profile._id);
        result.profiles++;
      }
    }

    // progress 정리
    const progressRecords = await ctx.db.query("progress").collect();
    for (const prog of progressRecords) {
      if (!validUserIds.has(prog.userId as any)) {
        await ctx.db.delete(prog._id);
        result.progress++;
      }
    }

    return result;
  },
});
