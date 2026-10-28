import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase, isSupabaseConfigured } from "@/lib/supabase";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const assets: { name: string; url: string; size?: number; createdAt?: string }[] = [];

    // 1. Supabase Storage under folder 'bombshelters'
    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured() && client?.storage) {
      try {
        const { data, error } = await client.storage
          .from("media")
          .list("bombshelters", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

        if (!error && Array.isArray(data)) {
          for (const item of data) {
            if (item.name && !item.name.startsWith(".")) {
              const { data: urlData } = client.storage
                .from("media")
                .getPublicUrl(`bombshelters/${item.name}`);

              if (urlData?.publicUrl) {
                assets.push({
                  name: item.name,
                  url: urlData.publicUrl,
                  size: item.metadata?.size,
                  createdAt: item.created_at || undefined,
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn("Supabase storage list note:", err);
      }
    }

    // 2. Local uploads folder
    const localDir = path.join(process.cwd(), "public", "uploads", "bombshelters");
    if (fs.existsSync(localDir)) {
      try {
        const files = fs.readdirSync(localDir);
        for (const file of files) {
          if (!assets.some((a) => a.name === file)) {
            const stat = fs.statSync(path.join(localDir, file));
            assets.push({
              name: file,
              url: `/uploads/bombshelters/${file}`,
              size: stat.size,
              createdAt: stat.birthtime.toISOString(),
            });
          }
        }
      } catch {}
    }

    // 3. Fallback to existing public images if empty
    if (assets.length === 0) {
      const publicImages = [
        { name: "hillside-bunker.png", url: "/images/hillside-bunker.png" },
        { name: "hero-bunker.png", url: "/images/hero-bunker.png" },
        { name: "cat-bomb-shelters.png", url: "/images/cat-bomb-shelters.png" },
        { name: "cat-storm-shelters.png", url: "/images/cat-storm-shelters.png" },
        { name: "cat-safe-rooms.png", url: "/images/cat-safe-rooms.png" },
        { name: "cat-luxury-bunkers.png", url: "/images/cat-luxury-bunkers.png" },
        { name: "cat-steel-framed-homes.png", url: "/images/cat-steel-framed-homes.png" },
        { name: "cat-cabins.png", url: "/images/cat-cabins.png" },
      ];
      assets.push(...publicImages);
    }

    return NextResponse.json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to list media." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: "File name is required." },
        { status: 400 }
      );
    }

    // Sanitize file name to prevent directory traversal
    const safeName = path.basename(fileName);

    // 1. Delete from Supabase storage if configured
    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured() && client?.storage) {
      try {
        await client.storage.from("media").remove([`bombshelters/${safeName}`]);
      } catch {}
    }

    // 2. Delete from local storage
    const localPath = path.join(process.cwd(), "public", "uploads", "bombshelters", safeName);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `File '${safeName}' deleted.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete file." },
      { status: 500 }
    );
  }
}
