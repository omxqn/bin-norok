// Admin-only database backup download.
// Streams the SQLite file so the admin can keep offline copies.

import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const file = await readFile(dbPath);
    const stamp = new Date().toISOString().split("T")[0];

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="binnorouk-backup-${stamp}.db"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Backup failed", { status: 500 });
  }
}
