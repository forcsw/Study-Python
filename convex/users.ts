import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { auth } from "./auth";
import {
  getAuthUserId,
  retrieveAccount,
  modifyAccountCredentials,
} from "@convex-dev/auth/server";

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

// 현재 사용자의 계정 정보 가져오기 (로그인 방식, 이메일 포함)
export const getCurrentUserWithAccount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    // profiles 테이블에서 프로필 정보
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // users 테이블에서 사용자 기본 정보 (Google OAuth에서 저장된 이름, 이메일, 이미지)
    const user = await ctx.db.get(userId);

    // authAccounts 테이블에서 로그인 방식 확인
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .first();

    const provider = authAccount?.provider || "unknown";
    const providerAccountId = authAccount?.providerAccountId; // 이메일 로그인의 경우 이메일

    return {
      userId: String(userId),
      name: user?.name || profile?.name || "사용자",
      email: user?.email || providerAccountId || null,
      image: user?.image || profile?.image || null,
      provider: provider, // "google" 또는 "password"
      createdAt: profile?.createdAt,
    };
  },
});

// 회원탈퇴 - 사용자 관련 모든 데이터 삭제
export const deleteMyAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    // 1. profiles 삭제
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // 2. progress 삭제
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (progress) {
      await ctx.db.delete(progress._id);
    }

    // 3. authSessions 삭제
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      // 관련 refreshTokens도 삭제
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of refreshTokens) {
        await ctx.db.delete(token._id);
      }
      await ctx.db.delete(session._id);
    }

    // 4. authAccounts 삭제
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // 5. users 테이블에서 사용자 삭제
    await ctx.db.delete(userId);

    return { success: true };
  },
});

// 비밀번호 변경 (이메일 로그인 사용자만)
export const changePassword = action({
  args: {
    email: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { email, currentPassword, newPassword }) => {
    // 인증 확인
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("인증이 필요합니다.");
    }

    // 새 비밀번호 유효성 검사 (최소 6자)
    if (newPassword.length < 6) {
      throw new Error("새 비밀번호는 최소 6자 이상이어야 합니다.");
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (currentPassword === newPassword) {
      throw new Error("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
    }

    // 현재 비밀번호 확인
    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: currentPassword },
      });
    } catch {
      throw new Error("현재 비밀번호가 올바르지 않습니다.");
    }

    // 새 비밀번호로 변경
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: newPassword },
    });

    return { success: true };
  },
});
