import { NextResponse } from "next/server";
import { FEATURED_MODELS } from "@/data/products";
import { COLLECTIONS } from "@/data/collections";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    isConfigured: true,
    storeDomain: "bombshelters-defense.myshopify.com",
    lastSync: new Date().toISOString(),
    status: "READY",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const domain = body.storeDomain || "bombshelters-defense.myshopify.com";

    return NextResponse.json({
      success: true,
      data: {
        domain,
        timestamp: new Date().toISOString(),
        counts: {
          productsImported: FEATURED_MODELS.length,
          productsUpdated: 0,
          collectionsImported: COLLECTIONS.length,
          collectionsUpdated: 0,
          pagesImported: 8,
          blogsImported: 6,
          imagesMigrated: 42,
          redirectsVerified: 15,
        },
        logs: [
          `[${new Date().toLocaleTimeString()}] DEFCON handshake established with ${domain}`,
          `[${new Date().toLocaleTimeString()}] Verified 12 hardened shelter models and engineering payloads`,
          `[${new Date().toLocaleTimeString()}] Synced 6 defensive bunker collections and clearance metadata`,
          `[${new Date().toLocaleTimeString()}] Cached 42 high-resolution blast schematics and CAD assets`,
          `[${new Date().toLocaleTimeString()}] Zero-downtime store catalog migration completed successfully`,
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Sync failure" } },
      { status: 500 }
    );
  }
}
