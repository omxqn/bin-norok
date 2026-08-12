"use server";

// Image upload for admin forms.
//
// Storage depends on the host. On Vercel the filesystem is read-only outside
// /tmp, so writing into public/uploads threw on every upload and the failure
// surfaced as a full-page server error; there, uploads go to Vercel Blob
// (BLOB_READ_WRITE_TOKEN). With a writable disk — the Docker + persistent disk
// setup in DEPLOY.md, or local development — they still go to UPLOADS_DIR /
// public/uploads, so existing images keep working either way.

import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import {
  isAllowedImageType,
  extensionForImageType,
  sniffImageType,
  MAX_FILE_SIZE,
} from "@/lib/sanitize";

export type UploadResult =
  | { success: true; path: string }
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  if (!isAllowedImageType(file.type)) {
    return { success: false, error: "Only JPG, PNG, WebP and AVIF images are allowed" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Image must be smaller than 5MB" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // file.type is just a header the client wrote — confirm the bytes agree
  // before we store anything.
  const actualType = sniffImageType(buffer);
  const extension = actualType ? extensionForImageType(actualType) : null;

  if (!actualType || !extension) {
    return { success: false, error: "Only JPG, PNG, WebP and AVIF images are allowed" };
  }

  // The stored name is generated entirely server-side. Deriving it from
  // file.name let an uploader choose the extension — an .html or .svg in
  // public/uploads is served from our own origin and runs as script.
  const fileName = `${randomUUID()}${extension}`;

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    try {
      const blob = await put(`museum/${fileName}`, buffer, {
        access: "public",
        token: blobToken,
        // The name is already a UUID, so no suffix is needed and no existing
        // blob can collide with it.
        addRandomSuffix: false,
        // Trust the sniffed type, not the client's header.
        contentType: actualType,
        cacheControlMaxAge: 31536000,
      });

      return { success: true, path: blob.url };
    } catch (error) {
      console.error("uploadImage: Vercel Blob upload failed", error);
      return {
        success: false,
        error: "Could not save the image to storage. Please try again.",
      };
    }
  }

  // No blob store configured — fall back to the disk.
  const uploadsDir =
    process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");

  // A write failure used to escape as an unhandled server action error, which
  // the browser renders as a full-page "server error occurred" screen at
  // whatever admin URL the form happened to be on. On a read-only host
  // (Vercel's filesystem is read-only outside /tmp) that is every upload, so
  // the failure is reported as a message instead.
  try {
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, fileName), buffer);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    console.error("uploadImage: could not write to", uploadsDir, code, error);

    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return {
        success: false,
        error:
          "Image storage is read-only on this server. Set BLOB_READ_WRITE_TOKEN for Vercel Blob, or point UPLOADS_DIR at a writable disk — see DEPLOY.md.",
      };
    }

    return { success: false, error: "Could not save the image. Please try again." };
  }

  return { success: true, path: `/uploads/${fileName}` };
}
