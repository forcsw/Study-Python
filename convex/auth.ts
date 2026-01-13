import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { MutationCtx } from "./_generated/server";
import { DataModel, Id } from "./_generated/dataModel";

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
    // Google OAuth - 환경변수 AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET 자동 사용
    Google,
  ],
  callbacks: {
    // OAuth 리다이렉트 처리
    async redirect({ redirectTo }) {
      // SITE_URL 기반으로 리다이렉트 URL 생성
      const siteUrl = process.env.SITE_URL || "http://localhost:3000";

      // 절대 URL인 경우 그대로 반환
      if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
        return redirectTo;
      }

      // 상대 경로인 경우 SITE_URL과 결합
      return `${siteUrl}${redirectTo.startsWith("/") ? "" : "/"}${redirectTo}`;
    },
    // 사용자 생성/업데이트 후 프로필과 진행률 초기화
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId, existingUserId }) {
      const now = Date.now();

      // users 테이블에서 사용자 정보 가져오기 (Google OAuth에서 저장된 이름/이미지)
      const user = await ctx.db.get(userId as Id<"users">);
      const userName = user?.name || "사용자";
      const userImage = user?.image;

      // 프로필 조회
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      if (existingProfile) {
        // 기존 프로필이 "사용자"로 되어 있으면 업데이트
        if (existingProfile.name === "사용자" && userName !== "사용자") {
          await ctx.db.patch(existingProfile._id, {
            name: userName,
            image: userImage,
            updatedAt: now,
          });
        }
      } else {
        // 신규 프로필 생성
        await ctx.db.insert("profiles", {
          userId,
          name: userName,
          image: userImage,
          createdAt: now,
          updatedAt: now,
        });
      }

      // 신규 사용자인 경우에만 진행률 초기화
      if (!existingUserId) {
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
