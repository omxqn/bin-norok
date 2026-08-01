"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { siteSettingSchema, SiteSettingFormValues } from "@/schemas/setting";
import { revalidatePath } from "next/cache";

export async function getSettings() {
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

  revalidatePath("/admin/settings");
  return setting;
}
