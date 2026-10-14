import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import SHOPIFY_REDIRECTS_DATA from "@/data/shopify_redirects.json";
import { resolveSimilarCategoryPath, isCategorySlug } from "@/utils/productUrls";

// Explicit static legacy redirects mapping
const LEGACY_REDIRECTS: Record<string, string> = {
  "/catalog": "/buildings",
  "/catalogue": "/buildings",
  "/floorplans": "/floor-plans",
  "/floor-plan": "/floor-plans",
  "/plans": "/floor-plans",
  "/models": "/buildings",
  "/commercial-buildings": "/commercial-modular-buildings",
};

// Imported Matrixify Shopify & Product category redirects (2,748 mapped paths)
const SHOPIFY_REDIRECTS: Record<string, string> = SHOPIFY_REDIRECTS_DATA as Record<string, string>;

function getAdminJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // In production, reject authentication if secret is unconfigured
      return new TextEncoder().encode("");
    }
    return new TextEncoder().encode("dev_isolated_session_secret_modularhome");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Host and Protocol Normalization (www to non-www and http to https)
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host ||
    "";
  const proto =
    request.headers.get("x-forwarded-proto") ||
    request.nextUrl.protocol.replace(":", "") ||
    "https";

  const hostWithoutPort = rawHost.split(":")[0].toLowerCase();
  const isWww = hostWithoutPort.startsWith("www.");
  const isProdHost =
    hostWithoutPort === "modularhome.com" ||
    hostWithoutPort === "www.modularhome.com";
  const isHttpUpgradeNeeded = isProdHost && proto === "http";

  // Determine canonical hostname
  let canonicalHost = hostWithoutPort;
  let domainNeedsRedirect = false;

  if (isWww) {
    canonicalHost = hostWithoutPort.slice(4); // strip "www."
    domainNeedsRedirect = true;
  }

  if (isHttpUpgradeNeeded) {
    domainNeedsRedirect = true;
  }

  // Normalize path (strip trailing slash if length > 1)
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const lowerPath = normalizedPath.toLowerCase();

  // 2. Resolve destination path (Check exact match 301 Shopify & Legacy Redirects)
  let destinationPath =
    SHOPIFY_REDIRECTS[lowerPath] ||
    SHOPIFY_REDIRECTS[normalizedPath] ||
    LEGACY_REDIRECTS[lowerPath] ||
    LEGACY_REDIRECTS[normalizedPath] ||
    normalizedPath;

  let preserveSearch = search || "";

  // 2a. Category Query Redirect: /buildings?category=Barndominiums -> /barndominiums (301)
  const categoryParam = request.nextUrl.searchParams.get("category");
  if (categoryParam && (lowerPath === "/buildings" || lowerPath === "/models" || lowerPath === "/floor-plans")) {
    const cleanCat = categoryParam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    let targetCat = cleanCat;
    if (cleanCat.includes("barndo")) targetCat = "barndominiums";
    else if (cleanCat.includes("cabin")) targetCat = "cabins";
    else if (cleanCat.includes("modular")) targetCat = "modular-homes";
    else if (cleanCat.includes("prefab")) targetCat = "prefab-homes";
    else if (cleanCat.includes("tiny")) targetCat = "tiny-homes";
    else if (cleanCat.includes("park-model") || cleanCat.includes("parkmodel")) targetCat = "park-models";
    else if (cleanCat.includes("adu") || cleanCat.includes("granny")) targetCat = "adus";
    else if (cleanCat.includes("a-frame") || cleanCat.includes("aframe")) targetCat = "a-frame-homes";
    else if (cleanCat.includes("kit") || cleanCat.includes("sip")) targetCat = "house-kits";
    else if (cleanCat.includes("commercial")) targetCat = "commercial-modular-buildings";
    else if (cleanCat.includes("custom")) targetCat = "custom-homes";

    destinationPath = `/${targetCat}`;
    preserveSearch = ""; // strip query parameter for clean canonical URL
  }


  // 2c. Pages Redirect: legacy Shopify /pages/* URLs redirect to target or similar category
  if (destinationPath === normalizedPath && lowerPath.startsWith("/pages/")) {
    const pageSlug = lowerPath.replace(/^\/pages\//, "").replace(/\/+$/, "");
    if (pageSlug && !pageSlug.includes("/")) {
      if (pageSlug === "contact") destinationPath = "/quote";
      else if (pageSlug.includes("finance")) destinationPath = "/financing";
      else if (pageSlug.includes("pricing") || pageSlug.includes("cost")) destinationPath = "/pricing";
      else if (pageSlug.includes("privacy")) destinationPath = "/privacy-policy";
      else if (pageSlug.includes("about")) destinationPath = "/how-it-works";
      else destinationPath = resolveSimilarCategoryPath(pageSlug);
    }
  }

  // 2d. Direct /commercial-buildings/* to /commercial-modular-buildings/* redirect (301)
  if (lowerPath.startsWith("/commercial-buildings/")) {
    const sub = lowerPath.replace(/^\/commercial-buildings\//, "");
    destinationPath = `/commercial-modular-buildings/${sub}`;
  }

  // 2e. Dynamic category redirect for any remaining /buildings/, /models/, or /products/ paths
  if (
    destinationPath === normalizedPath &&
    (lowerPath.startsWith("/buildings/") ||
      lowerPath.startsWith("/models/") ||
      lowerPath.startsWith("/products/"))
  ) {
    const slug = lowerPath
      .replace(/^\/(?:buildings|models|products)\//i, "")
      .replace(/\/+$/, "");

    if (slug && !slug.includes("/")) {
      destinationPath = resolveSimilarCategoryPath(slug);
    }
  }

  // 2f. Dynamic Video 301 Redirects (/videos/*)
  // Ensure that older video slugs and legacy YouTube IDs return a permanent 301 redirect in one hop
  if (destinationPath === normalizedPath && lowerPath.startsWith("/videos/")) {
    const videoParam = lowerPath.replace(/^\/videos\//i, "").replace(/\/+$/, "");
    if (videoParam) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
          // 1. Check dynamic redirects table for historical or replaced slugs
          const redirUrl = `${supabaseUrl}/rest/v1/redirects?from_path=eq.${encodeURIComponent(lowerPath)}&select=to_path&limit=1`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);

          const rRes = await fetch(redirUrl, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            signal: controller.signal,
          });
        clearTimeout(timeoutId);

        if (rRes.ok) {
          const rData = await rRes.json();
          if (Array.isArray(rData) && rData.length > 0 && rData[0].to_path) {
            let candidate = rData[0].to_path;
            // Prevent redirect loop: ignore redirect if candidate matches current path
            if (candidate.toLowerCase() !== lowerPath) {
              // Flatten redirect chain (prevent 2-hop redirects like A -> B -> C)
              if (candidate.toLowerCase().startsWith("/videos/")) {
                try {
                  const chainUrl = `${supabaseUrl}/rest/v1/redirects?from_path=eq.${encodeURIComponent(candidate.toLowerCase())}&select=to_path&limit=1`;
                  const cController = new AbortController();
                  const cTimeout = setTimeout(() => cController.abort(), 600);
                  const cRes = await fetch(chainUrl, {
                    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
                    signal: cController.signal,
                  });
                  clearTimeout(cTimeout);
                  if (cRes.ok) {
                    const cData = await cRes.json();
                    if (Array.isArray(cData) && cData.length > 0 && cData[0].to_path) {
                      const secondHop = cData[0].to_path;
                      // Guard against loop back to current lowerPath
                      if (secondHop.toLowerCase() !== lowerPath) {
                        candidate = secondHop;
                      }
                    }
                  }
                } catch (e) {}
              }
              destinationPath = candidate;
            }
          }
        }

        // 2. If not matched and videoParam looks like a YouTube ID or vid- ID
        if (destinationPath === normalizedPath && (/^[a-zA-Z0-9_-]{11}$/.test(videoParam) || videoParam.startsWith("vid-"))) {
          const cleanId = videoParam.replace(/^vid-/, "");
          const vUrl = `${supabaseUrl}/rest/v1/videos?or=(youtube_video_id.ilike.${cleanId},id.ilike.vid-${cleanId})&select=slug&limit=1`;
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 1200);

          const vRes = await fetch(vUrl, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            signal: controller2.signal,
          });
          clearTimeout(timeoutId2);

          if (vRes.ok) {
            const vData = await vRes.json();
            if (Array.isArray(vData) && vData.length > 0 && vData[0].slug) {
              const targetCandidate = `/videos/${vData[0].slug}`;
              if (targetCandidate.toLowerCase() !== lowerPath) {
                destinationPath = targetCandidate;
              }
            }
          }
        }
      }
    } catch (e) {
      // Fallback gracefully on network timeout
    }
  }
}

  // 3. Execute Single-Hop 301 Permanent Redirect (Consolidates WWW, HTTP, and Path Changes)
  const pathNeedsRedirect = destinationPath !== pathname || (categoryParam && preserveSearch !== search);

  if (domainNeedsRedirect || pathNeedsRedirect) {
    // Retain port for local test environments (e.g. www.localhost:3000 -> localhost:3000)
    const port = rawHost.includes(":") ? `:${rawHost.split(":")[1]}` : "";
    const targetProtocol = isProdHost ? "https" : proto;
    const targetOrigin = `${targetProtocol}://${canonicalHost}${port}`;
    const targetUrl = `${targetOrigin}${destinationPath}${preserveSearch}`;

    return NextResponse.redirect(new URL(targetUrl), { status: 301 });
  }

  // 4. Handle /admin/login page
  if (pathname === "/admin/login") {
    const reason = request.nextUrl.searchParams.get("reason");
    if (reason) {
      const response = NextResponse.next();
      response.cookies.delete("admin_session");
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    const sessionCookie = request.cookies.get("admin_session");
    if (sessionCookie && sessionCookie.value) {
      try {
        const { payload } = await jwtVerify(sessionCookie.value, getAdminJwtSecret());
        if (payload && payload.email) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        const response = NextResponse.next();
        response.cookies.delete("admin_session");
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
      }
    }

    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // 5. Protect /admin UI routes (except /admin/login)
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
      const { payload } = await jwtVerify(sessionCookie.value, getAdminJwtSecret());
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

  // 6. Protect /api/admin API routes (except login and logout)
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
      const { payload } = await jwtVerify(sessionCookie.value, getAdminJwtSecret());
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
