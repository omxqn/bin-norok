"use server";

// Image upload for admin forms — saves into /public/uploads.

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { isAllowedImageType, sanitizeFilename, MAX_FILE_SIZE } from "@/lib/sanitize";

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

  // In production the uploads live on a persistent disk (UPLOADS_DIR),
  // served back through the /uploads/[...path] route. Locally they default
  // to public/uploads which Next serves statically.
  const uploadsDir =
    process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const safeName = sanitizeFilename(file.name) || "image";
  const fileName = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return { success: true, path: `/uploads/${fileName}` };
}
