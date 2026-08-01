"use server";

// Visitor guestbook: public submissions are held for admin approval
// before appearing on the Visitors page.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type GuestbookResult = { success: true } | { success: false; error: string };

export async function getApprovedGuestbookEntries() {
  return prisma.guestbookEntry.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, origin: true, message: true, createdAt: true },
  });
}

export async function submitGuestbookEntry(formData: FormData): Promise<GuestbookResult> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rate = checkRateLimit(ip, "contact");
  if (!rate.success) {
    return { success: false, error: "rateLimit" };
  }

  const name = sanitizeString(String(formData.get("name") ?? ""), 100);
  const origin = sanitizeString(String(formData.get("origin") ?? ""), 100);
  const message = sanitizeString(String(formData.get("message") ?? ""), 1000);

  if (name.length < 2 || message.length < 5) {
    return { success: false, error: "validation" };
  }

  try {
    await prisma.guestbookEntry.create({
      data: { name, origin: origin || null, message, approved: false },
    });
    return { success: true };
  } catch {
    return { success: false, error: "server" };
  }
}

export async function setGuestbookApproval(id: string, approved: boolean) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Unauthorized");
  }

  await prisma.guestbookEntry.update({ where: { id }, data: { approved } });
  revalidatePath("/", "layout");
}

export async function deleteGuestbookEntry(id: string) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized");
  }

  await prisma.guestbookEntry.delete({ where: { id } });
  revalidatePath("/", "layout");
}
