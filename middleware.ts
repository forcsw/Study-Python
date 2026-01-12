/**
 * Middleware (미들웨어)
 *
 * Convex Auth - 클라이언트 사이드 인증으로 변경
 * 미들웨어에서 인증을 체크하지 않고, 각 페이지에서 처리합니다.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 모든 요청을 그대로 통과시킴
  // 인증 체크는 클라이언트 컴포넌트에서 처리
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
