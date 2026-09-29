import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase, isSupabaseConfigured } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";
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
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);

let mediaBucketCreated = false;

async function ensureMediaBucketExists(client: any): Promise<boolean> {
  if (mediaBucketCreated) return true;
  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (!error && buckets && buckets.some((b: any) => b.name === "media")) {
      mediaBucketCreated = true;
      return true;
    }
    // Attempt bucket creation
    const { error: createError } = await client.storage.createBucket("media", {
      public: true,
      fileSizeLimit: 31457280, // 30MB
    });
    if (!createError || createError.message?.includes("already exists")) {
      mediaBucketCreated = true;
      return true;
    }
    return false;
  } catch (err) {
    console.warn("Could not check/create Supabase media bucket:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: "No file provided in request." } },
        { status: 400 }
      );
    }

    // MIME type check
    const fileType = file.type || "application/octet-stream";
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";

    if (
      !ALLOWED_MIME_TYPES.has(fileType) &&
      !["jpg", "jpeg", "png", "webp", "avif", "svg", "pdf", "zip", "ico"].includes(extension)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `File type '${fileType}' is not supported. Please upload an image, PDF, or ZIP package.`,
          },
        },
        { status: 400 }
      );
    }

    // Size limit check (30MB max)
    const MAX_SIZE = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: { message: "File exceeds the 30MB maximum upload size limit." } },
        { status: 400 }
      );
    }

    // Sanitize folder and filename
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/^\/+|\/+$/g, "");
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);
    const fileNameWithExt = `${baseName}-${Date.now()}.${extension}`;
    const uniqueStoragePath = `${cleanFolder ? `${cleanFolder}/` : ""}${fileNameWithExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalPublicUrl = "";
    let uploadStorageType: "SUPABASE_CDN" | "LOCAL_STORAGE" = "LOCAL_STORAGE";

    // 1. Attempt upload to Supabase Storage 'media' bucket
    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured() && client?.storage) {
      try {
        await ensureMediaBucketExists(client);

        let uploadRes = await client.storage
          .from("media")
          .upload(uniqueStoragePath, buffer, {
            contentType: fileType,
            upsert: true,
          });

        // If bucket not found, try creating it and retry once
        if (uploadRes.error && uploadRes.error.message?.toLowerCase().includes("bucket not found")) {
          try {
            await client.storage.createBucket("media", { public: true });
            uploadRes = await client.storage
              .from("media")
              .upload(uniqueStoragePath, buffer, {
                contentType: fileType,
                upsert: true,
              });
          } catch {}
        }

        if (!uploadRes.error && uploadRes.data) {
          const { data: publicUrlData } = client.storage
            .from("media")
            .getPublicUrl(uploadRes.data.path);

          if (publicUrlData?.publicUrl) {
            finalPublicUrl = publicUrlData.publicUrl;
            uploadStorageType = "SUPABASE_CDN";
          }
        } else {
          console.warn("Supabase storage upload note, falling back to local storage:", uploadRes.error);
        }
      } catch (storageErr) {
        console.warn("Supabase storage exception, falling back to local storage:", storageErr);
      }
    }

    // 2. Reliable Local Storage Fallback if Supabase upload was not used or failed
    if (!finalPublicUrl) {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const localFilePath = path.join(publicUploadsDir, fileNameWithExt);
      fs.writeFileSync(localFilePath, buffer);

      finalPublicUrl = `/uploads/${cleanFolder ? `${cleanFolder}/` : ""}${fileNameWithExt}`;
      uploadStorageType = "LOCAL_STORAGE";
    }

    // Audit log upload action
    await logActivity({
      action: "UPLOAD",
      entityType: "MEDIA",
      entityId: uniqueStoragePath,
      details: {
        url: finalPublicUrl,
        storageType: uploadStorageType,
        fileName: file.name,
        fileSize: file.size,
      },
    });


    return NextResponse.json({
      success: true,
      url: finalPublicUrl,
      path: uniqueStoragePath,
      storageType: uploadStorageType,
      fileName: file.name,
      size: file.size,
      mimeType: fileType,
    });
  } catch (err: any) {
    console.error("Admin upload API exception:", err);
    return NextResponse.json(
      { success: false, error: { message: err.message || "Internal server error during upload." } },
      { status: 500 }
    );
  }
}
