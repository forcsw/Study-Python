import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// 이미지 서빙 HTTP 라우트
// Cross-Origin-Resource-Policy 헤더를 추가하여 COEP 정책 호환
http.route({
  path: "/image",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.searchParams.get("id");

    if (!storageId) {
      return new Response("Storage ID required", { status: 400 });
    }

    try {
      const blob = await ctx.storage.get(storageId as Id<"_storage">);

      if (!blob) {
        return new Response("File not found", { status: 404 });
      }

      return new Response(blob, {
        headers: {
          "Content-Type": blob.type || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
          "Cross-Origin-Resource-Policy": "cross-origin",
        },
      });
    } catch (error) {
      console.error("Image serving error:", error);
      return new Response("Failed to retrieve file", { status: 500 });
    }
  }),
});

// 외부 이미지 프록시 HTTP 라우트 (Google OAuth 등)
// Cross-Origin-Resource-Policy 헤더를 추가하여 COEP 정책 호환
http.route({
  path: "/proxy-image",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Image URL required", { status: 400 });
    }

    try {
      // 외부 이미지 fetch
      const response = await fetch(imageUrl);

      if (!response.ok) {
        return new Response("Failed to fetch image", { status: 404 });
      }

      const blob = await response.blob();

      return new Response(blob, {
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
          "Cross-Origin-Resource-Policy": "cross-origin",
        },
      });
    } catch (error) {
      console.error("Proxy image error:", error);
      return new Response("Failed to proxy image", { status: 500 });
    }
  }),
});

// Convex Auth HTTP 라우트 등록
auth.addHttpRoutes(http);

export default http;
