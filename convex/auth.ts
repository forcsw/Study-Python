import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { MutationCtx } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    // 이메일/비밀번호 인증
    Password<DataModel>({
      // 비밀번호 유효성 검사 (최소 6자)
      validatePasswordRequirements: (password: string) => {
        if (password.length < 6) {
          throw new Error("비밀번호는 최소 6자 이상이어야 합니다.");
        }
      },
      // 프로필에 name 필드 추가
      profile(params) {
        return {
          email: params.email as string,
          name: (params.name as string) || (params.email as string).split("@")[0],
        };
      },
    }),
    // Google OAuth
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // 사용자 생성/업데이트 후 프로필과 진행률 초기화
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId, existingUserId }) {
      // 신규 사용자인 경우에만 프로필과 진행률 생성
      if (!existingUserId) {
        const now = Date.now();

        // 프로필 생성
        const existingProfile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .first();

        if (!existingProfile) {
          await ctx.db.insert("profiles", {
            userId,
            name: "사용자",
            createdAt: now,
            updatedAt: now,
          });
        }

        // 진행률 초기화
        const existingProgress = await ctx.db
          .query("progress")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .first();

        if (!existingProgress) {
          await ctx.db.insert("progress", {
            userId,
            completedLevels: [],
            currentLevel: 1,
            streak: 0,
            bestStreak: 0,
            lastActiveDate: new Date().toISOString().split("T")[0],
            totalTimeSpent: 0,
            levelStatuses: [],
            updatedAt: now,
          });
        }
      }
    },
  },
});
