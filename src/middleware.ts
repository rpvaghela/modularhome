import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import SHOPIFY_REDIRECTS_DATA from "@/data/shopify_redirects.json";

// Explicit static legacy redirects mapping
const LEGACY_REDIRECTS: Record<string, string> = {
  "/catalog": "/buildings",
  "/catalogue": "/buildings",
  "/floorplans": "/floor-plans",
  "/floor-plan": "/floor-plans",
  "/plans": "/floor-plans",
  "/models": "/buildings",
};

// Imported Matrixify Shopify redirects (472 mapped paths)
const SHOPIFY_REDIRECTS: Record<string, string> = SHOPIFY_REDIRECTS_DATA as Record<string, string>;

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_secure_jwt_session_secret_key_2026_change_in_production"
);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const isPreviewHost =
    host.includes("vercel.app") ||
    host.includes("sg-host.com");

  // Normalize path (strip trailing slash if length > 1)
  const normalizedPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const lowerPath = normalizedPath.toLowerCase();

  // 1. Check exact match 301 Shopify & Legacy Redirects
  const directTarget =
    SHOPIFY_REDIRECTS[lowerPath] ||
    SHOPIFY_REDIRECTS[normalizedPath] ||
    LEGACY_REDIRECTS[lowerPath] ||
    LEGACY_REDIRECTS[normalizedPath];

  if (directTarget && directTarget !== pathname && directTarget !== normalizedPath && directTarget !== lowerPath) {
    const targetUrl = new URL(directTarget + (search || ""), request.url);
    const redirectResponse = NextResponse.redirect(targetUrl, { status: 301 });
    if (isPreviewHost) {
      redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return redirectResponse;
  }

  // 2. Handle /admin/login page
  if (pathname === "/admin/login") {
    const reason = request.nextUrl.searchParams.get("reason");
    if (reason) {
      const response = NextResponse.next();
      response.cookies.delete("admin_session");
      if (isPreviewHost) response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    const sessionCookie = request.cookies.get("admin_session");
    if (sessionCookie && sessionCookie.value) {
      try {
        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
        if (payload && payload.email) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        const response = NextResponse.next();
        response.cookies.delete("admin_session");
        if (isPreviewHost) response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
      }
    }

    const res = NextResponse.next();
    if (isPreviewHost) res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // 3. Protect /admin UI routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "unauthorized");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      if (!payload || !payload.email) {
        throw new Error("Invalid session payload");
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "session_expired");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // 4. Protect /api/admin API routes (except login and logout)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/logout")
  ) {
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || !sessionCookie.value) {
      const response = NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized. Admin session expired or missing.", code: "UNAUTHORIZED" },
        },
        { status: 401 }
      );
      response.cookies.delete("admin_session");
      return response;
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      if (!payload || !payload.email) {
        throw new Error("Invalid session payload");
      }
    } catch {
      const response = NextResponse.json(
        {
          success: false,
          error: { message: "Unauthorized. Admin session expired or invalid.", code: "UNAUTHORIZED" },
        },
        { status: 401 }
      );
      response.cookies.delete("admin_session");
      return response;
    }
  }

  const response = NextResponse.next();
  if (isPreviewHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public asset extensions (svg, png, jpg, jpeg, gif, webp, avif, ico, css, js, map, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|eot|pdf|mp4|webm|SVG|PNG|JPG|JPEG|GIF|WEBP|AVIF|ICO)$).*)",
  ],
};
