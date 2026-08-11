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

  // Next decodes each catch-all segment before it lands here, so %2F and %2E
  // arrive as real separators — reject anything that could climb a level.
  const hasBadSegment = segments.some(
    (segment) =>
      segment === ".." ||
      segment.includes("/") ||
      segment.includes("\\") ||
      segment.includes("\0")
  );

  if (hasBadSegment) {
    return new Response("Not found", { status: 404 });
  }

  // Resolve, then require a trailing separator on the prefix match. A bare
  // startsWith would also accept siblings sharing the base's string prefix —
  // with UPLOADS_DIR=/data/uploads, that let /data/uploads.bak/prod.db through.
  const base = path.resolve(uploadsDir);
  const target = path.resolve(base, ...segments);

  if (target !== base && !target.startsWith(base + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        // Defence in depth: even if a scriptable type were ever served from
        // here, sandbox strips script execution and same-origin access.
        "Content-Security-Policy": "sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
