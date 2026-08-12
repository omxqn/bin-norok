"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { siteSettingSchema, SiteSettingFormValues } from "@/schemas/setting";
import { SITE_SETTINGS_TAG } from "@/lib/site-settings";
// updateTag (not revalidateTag) for read-your-own-writes: it expires the entry
// immediately so the admin sees their change on the public site right away,
// instead of the next visitor getting stale content.
import { revalidatePath, updateTag } from "next/cache";

// Every export in a "use server" file is a public POST endpoint, so a read
// with no session check is an open API — not just an internal helper. The
// public site reads what it needs through the cached helpers in
// src/lib/site-settings.ts instead.
async function requireAdmin(roles: string[] = ["ADMIN", "SUPER_ADMIN"]) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !roles.includes(role)) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getSettings() {
  await requireAdmin();

  return await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });
}

export async function updateSetting(id: string, data: SiteSettingFormValues) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = siteSettingSchema.parse(data);

  const setting = await prisma.siteSetting.update({
    where: { id },
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "SiteSetting",
      entityId: setting.id,
      details: `Updated setting: ${setting.key}`,
    },
  });

  // Drop the cached public contact details so the change shows on the live
  // site immediately instead of waiting out the 1-hour revalidate window.
  updateTag(SITE_SETTINGS_TAG);
  revalidatePath("/admin/settings");
  return setting;
}

export async function createSetting(data: SiteSettingFormValues) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = siteSettingSchema.parse(data);

  const setting = await prisma.siteSetting.create({
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "SiteSetting",
      entityId: setting.id,
      details: `Created setting: ${setting.key}`,
    },
  });

  updateTag(SITE_SETTINGS_TAG);
  revalidatePath("/admin/settings");
  return setting;
}
