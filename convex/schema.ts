import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// LevelStatus 객체 validator
const levelStatusValidator = v.object({
  levelId: v.number(),
  completed: v.boolean(),
  attempts: v.number(),
  completedAt: v.optional(v.number()), // timestamp
  timeSpent: v.optional(v.number()), // seconds
});

export default defineSchema({
  // Convex Auth 테이블 (users, sessions, accounts 등)
  ...authTables,

  // 사용자 프로필 (Auth와 별도로 추가 정보 저장)
  profiles: defineTable({
    userId: v.string(), // Convex Auth user ID
    name: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  }).index("by_userId", ["userId"]),

  // 학습 진행률
  progress: defineTable({
    userId: v.string(), // Convex Auth user ID
    completedLevels: v.array(v.number()),
    currentLevel: v.number(),
    streak: v.number(),
    bestStreak: v.number(),
    lastActiveDate: v.string(), // YYYY-MM-DD
    totalTimeSpent: v.number(), // minutes
    levelStatuses: v.array(levelStatusValidator),
    updatedAt: v.number(), // timestamp
  }).index("by_userId", ["userId"]),
});
