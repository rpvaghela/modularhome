import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase, isSupabaseConfigured } from "@/lib/supabase";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireBombShelterAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: "No file provided in request." } },
        { status: 400 }
      );
    }

    const fileType = file.type || "application/octet-stream";
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";

    if (
      !ALLOWED_MIME_TYPES.has(fileType) &&
      !["jpg", "jpeg", "png", "webp", "avif", "svg", "pdf"].includes(extension)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `File type '${fileType}' is not supported. Please upload an image or blueprint PDF.`,
          },
        },
        { status: 400 }
      );
    }

    // Size limit 30MB
    const MAX_SIZE = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: { message: "File exceeds 30MB maximum limit." } },
        { status: 400 }
      );
    }

    // Strictly enforce bombshelters storage folder isolation
    const folder = "bombshelters";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);
    const fileNameWithExt = `${baseName}-${Date.now()}.${extension}`;
    const storagePath = `${folder}/${fileNameWithExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalPublicUrl = "";
    let uploadStorageType: "SUPABASE_CDN" | "LOCAL_STORAGE" = "LOCAL_STORAGE";

    // 1. Attempt upload to Supabase Storage 'media' bucket in folder 'bombshelters'
    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured() && client?.storage) {
      try {
        const uploadRes = await client.storage
          .from("media")
          .upload(storagePath, buffer, {
            contentType: fileType,
            upsert: true,
          });

        if (!uploadRes.error && uploadRes.data) {
          const { data: publicUrlData } = client.storage
            .from("media")
            .getPublicUrl(uploadRes.data.path);

          if (publicUrlData?.publicUrl) {
            finalPublicUrl = publicUrlData.publicUrl;
            uploadStorageType = "SUPABASE_CDN";
          }
        }
      } catch (storageErr) {
        console.warn("Supabase storage upload note, using local fallback:", storageErr);
      }
    }

    // 2. Local storage fallback in bombshelters-app/public/uploads/bombshelters
    if (!finalPublicUrl) {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads", "bombshelters");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const localFilePath = path.join(publicUploadsDir, fileNameWithExt);
      fs.writeFileSync(localFilePath, buffer);

      finalPublicUrl = `/uploads/bombshelters/${fileNameWithExt}`;
      uploadStorageType = "LOCAL_STORAGE";
    }

    return NextResponse.json({
      success: true,
      url: finalPublicUrl,
      path: storagePath,
      storageType: uploadStorageType,
      fileName: file.name,
      size: file.size,
      mimeType: fileType,
    });
  } catch (err: any) {
    console.error("BombShelter upload API exception:", err);
    return NextResponse.json(
      { success: false, error: { message: err.message || "Internal server error during upload." } },
      { status: 500 }
    );
  }
}

