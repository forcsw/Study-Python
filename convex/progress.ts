import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// LevelStatus validator
const levelStatusValidator = v.object({
  levelId: v.number(),
  completed: v.boolean(),
  attempts: v.number(),
  completedAt: v.optional(v.number()),
  timeSpent: v.optional(v.number()),
});

// 현재 사용자의 진행률 가져오기
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // 진행률이 없으면 기본값 반환
    if (!progress) {
      return {
        userId,
        completedLevels: [],
        currentLevel: 1,
        streak: 0,
        bestStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        totalTimeSpent: 0,
        levelStatuses: [],
        updatedAt: Date.now(),
      };
    }

    return progress;
  },
});

// 진행률 초기화 (새 사용자용)
export const initProgress = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    // 이미 존재하는지 확인
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    // 새 진행률 생성
    return await ctx.db.insert("progress", {
      userId,
      completedLevels: [],
      currentLevel: 1,
      streak: 0,
      bestStreak: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
      totalTimeSpent: 0,
      levelStatuses: [],
      updatedAt: Date.now(),
    });
  },
});

// 레벨 완료 처리
export const completeLevel = mutation({
  args: {
    levelId: v.number(),
    timeSpent: v.optional(v.number()), // seconds
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    let progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    if (!progress) {
      // 진행률이 없으면 생성
      const progressId = await ctx.db.insert("progress", {
        userId,
        completedLevels: [args.levelId],
        currentLevel: args.levelId + 1,
        streak: 1,
        bestStreak: 1,
        lastActiveDate: today,
        totalTimeSpent: args.timeSpent ? Math.floor(args.timeSpent / 60) : 0,
        levelStatuses: [
          {
            levelId: args.levelId,
            completed: true,
            attempts: 1,
            completedAt: now,
            timeSpent: args.timeSpent,
          },
        ],
        updatedAt: now,
      });
      return progressId;
    }

    // 이미 완료한 레벨인지 확인
    if (progress.completedLevels.includes(args.levelId)) {
      return progress._id;
    }

    // 스트릭 계산
    let newStreak = progress.streak;
    let newBestStreak = progress.bestStreak;

    if (progress.lastActiveDate === today) {
      // 오늘 이미 활동함 - 스트릭 유지
    } else {
      const lastDate = new Date(progress.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // 연속 활동
        newStreak = progress.streak + 1;
      } else {
        // 연속 끊김
        newStreak = 1;
      }
    }

    if (newStreak > newBestStreak) {
      newBestStreak = newStreak;
    }

    // 레벨 상태 업데이트
    const existingStatusIndex = progress.levelStatuses.findIndex(
      (s) => s.levelId === args.levelId
    );

    const newLevelStatuses = [...progress.levelStatuses];
    if (existingStatusIndex >= 0) {
      newLevelStatuses[existingStatusIndex] = {
        ...newLevelStatuses[existingStatusIndex],
        completed: true,
        completedAt: now,
        timeSpent: args.timeSpent,
      };
    } else {
      newLevelStatuses.push({
        levelId: args.levelId,
        completed: true,
        attempts: 1,
        completedAt: now,
        timeSpent: args.timeSpent,
      });
    }

    // 진행률 업데이트
    await ctx.db.patch(progress._id, {
      completedLevels: [...progress.completedLevels, args.levelId],
      currentLevel: Math.max(progress.currentLevel, args.levelId + 1),
      streak: newStreak,
      bestStreak: newBestStreak,
      lastActiveDate: today,
      totalTimeSpent:
        progress.totalTimeSpent + (args.timeSpent ? Math.floor(args.timeSpent / 60) : 0),
      levelStatuses: newLevelStatuses,
      updatedAt: now,
    });

    return progress._id;
  },
});

// 시도 횟수 증가
export const incrementAttempt = mutation({
  args: {
    levelId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    let progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!progress) {
      // 진행률이 없으면 생성
      return await ctx.db.insert("progress", {
        userId,
        completedLevels: [],
        currentLevel: 1,
        streak: 0,
        bestStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        totalTimeSpent: 0,
        levelStatuses: [
          {
            levelId: args.levelId,
            completed: false,
            attempts: 1,
          },
        ],
        updatedAt: Date.now(),
      });
    }

    const existingStatusIndex = progress.levelStatuses.findIndex(
      (s) => s.levelId === args.levelId
    );

    const newLevelStatuses = [...progress.levelStatuses];
    if (existingStatusIndex >= 0) {
      newLevelStatuses[existingStatusIndex] = {
        ...newLevelStatuses[existingStatusIndex],
        attempts: newLevelStatuses[existingStatusIndex].attempts + 1,
      };
    } else {
      newLevelStatuses.push({
        levelId: args.levelId,
        completed: false,
        attempts: 1,
      });
    }

    await ctx.db.patch(progress._id, {
      levelStatuses: newLevelStatuses,
      updatedAt: Date.now(),
    });

    return progress._id;
  },
});

// 현재 레벨 설정
export const setCurrentLevel = mutation({
  args: {
    levelId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("인증이 필요합니다.");

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!progress) {
      return await ctx.db.insert("progress", {
        userId,
        completedLevels: [],
        currentLevel: args.levelId,
        streak: 0,
        bestStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        totalTimeSpent: 0,
        levelStatuses: [],
        updatedAt: Date.now(),
      });
    }

    await ctx.db.patch(progress._id, {
      currentLevel: args.levelId,
      updatedAt: Date.now(),
    });

    return progress._id;
  },
});
