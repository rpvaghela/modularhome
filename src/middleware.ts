import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Standard 301 SEO redirects mapping (e.g. from Shopify legacy paths)
const LEGACY_REDIRECTS: Record<string, string> = {
  "/collections/all": "/buildings",
  "/collections": "/buildings",
  "/catalog": "/buildings",
  "/floorplans": "/floor-plans",
  "/floor-plan": "/floor-plans",
  "/plans": "/floor-plans",
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_secure_jwt_session_secret_key_2026_change_in_production"
);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Check exact match 301 SEO Redirects
  if (LEGACY_REDIRECTS[pathname]) {
    const redirectUrl = new URL(LEGACY_REDIRECTS[pathname], request.url);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // 2. Handle Shopify pattern 301 redirects
  if (pathname.startsWith("/products/")) {
    const handle = pathname.replace("/products/", "");
    const redirectUrl = new URL(`/buildings/${handle}`, request.url);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  if (pathname.startsWith("/blogs/news/")) {
    const handle = pathname.replace("/blogs/news/", "");
    const redirectUrl = new URL(`/resources/${handle}`, request.url);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  if (pathname.startsWith("/collections/")) {
    const handle = pathname.replace("/collections/", "");
    const redirectUrl = new URL(`/buildings?category=${encodeURIComponent(handle)}`, request.url);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // 3. Handle /admin/login page
  if (pathname === "/admin/login") {
    const reason = searchParams.get("reason");
    // If an explicit logout/expiry reason is present, clear stale cookies and allow login form
    if (reason) {
      const response = NextResponse.next();
      response.cookies.delete("admin_session");
      return response;
    }

    // Only redirect to /admin if session token exists AND is actively valid
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
        return response;
      }
    }

    return NextResponse.next();
  }

  // 4. Protect /admin UI routes (except /admin/login)
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

    // Validate cryptographic signature & expiration time
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

  // 5. Protect /api/admin API routes (except login and logout)
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/products/:path*",
    "/blogs/news/:path*",
    "/collections/:path*",
    "/floorplans",
    "/floor-plan",
    "/plans",
  ],
};
