import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Serves admin-uploaded images from the persistent disk (UPLOADS_DIR) in
// production. Locally, files in public/uploads are served statically by Next
// and never reach this handler. Path traversal is blocked.

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const uploadsDir =
    process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");

  // Join and normalise, then ensure the result stays inside uploadsDir.
  const target = path.normalize(path.join(uploadsDir, ...segments));
  if (!target.startsWith(path.resolve(uploadsDir))) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
