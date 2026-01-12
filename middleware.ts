/**
 * Middleware (미들웨어)
 *
 * Convex Auth를 사용한 라우트 보호
 *
 * 참고: Convex Auth는 클라이언트 사이드에서 인증 상태를 관리합니다.
 * 미들웨어에서는 기본적인 라우트 패턴만 처리하고,
 * 실제 인증 체크는 각 페이지 컴포넌트에서 수행합니다.
 */

import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// 로그인 페이지 매칭
const isSignInPage = createRouteMatcher(["/login", "/signup"]);

// 보호된 라우트 매칭 (프로필 페이지)
const isProtectedRoute = createRouteMatcher(["/profile(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // 로그인 페이지에서 이미 인증된 사용자는 /learn으로 리다이렉트
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/learn");
  }

  // 보호된 라우트에서 인증되지 않은 사용자는 /login으로 리다이렉트
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
