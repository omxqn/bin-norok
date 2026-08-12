"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  MANAGEABLE_PAGES,
  PAGE_SLUGS,
  PAGE_TOGGLES_TAG,
  isPageSlug,
  pageToggleKey,
  type PageSlug,
} from "@/lib/page-toggles";
import { revalidatePath, updateTag } from "next/cache";

/** Every entry point here is admin-only. */
async function requirePageAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Immediate, not stale-while-revalidate: taking a page offline should take
 * effect on the next request, not the one after it.
 */
function publishToggleChange() {
  updateTag(PAGE_TOGGLES_TAG);
  revalidatePath("/", "layout");
}

/**
 * Turn a public page on or off. Admin-only.
 *
 * Disabling writes `page.<slug>.enabled = "false"`; enabling writes "true"
 * rather than deleting the row, so the audit trail keeps both directions.
 */
export async function setPageEnabled(slug: string, enabled: boolean) {
  const session = await requirePageAdmin();

  if (!isPageSlug(slug)) {
    throw new Error("Unknown page");
  }

  const key = pageToggleKey(slug);
  const value = enabled ? "true" : "false";

  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { valueAr: value, valueEn: value },
    create: { key, valueAr: value, valueEn: value },
  });

  const page = MANAGEABLE_PAGES.find((p) => p.slug === slug);

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "SiteSetting",
      entityId: setting.id,
      details: `${enabled ? "Enabled" : "Disabled"} public page: ${page?.labelEn ?? slug}`,
    },
  });

  publishToggleChange();

  return { slug: slug as PageSlug, enabled };
}

/**
 * Switch every manageable page at once — the "open the whole site again"
 * button after a closure. Logged as one entry rather than ten.
 */
export async function setAllPagesEnabled(enabled: boolean) {
  const session = await requirePageAdmin();

  const value = enabled ? "true" : "false";

  await prisma.$transaction(
    PAGE_SLUGS.map((slug) =>
      prisma.siteSetting.upsert({
        where: { key: pageToggleKey(slug) },
        update: { valueAr: value, valueEn: value },
        create: { key: pageToggleKey(slug), valueAr: value, valueEn: value },
      })
    )
  );

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "SiteSetting",
      details: `${enabled ? "Enabled" : "Disabled"} all public pages (${PAGE_SLUGS.length})`,
    },
  });

  publishToggleChange();

  return { enabled };
}
