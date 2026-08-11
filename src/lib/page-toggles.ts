// ===========================================
// Admin-controlled page availability
// ===========================================
// Lets an admin take a public page offline — e.g. disabling the visit page so
// no new bookings can be made during a closure.
//
// Storage reuses the existing SiteSetting table under `page.<slug>.enabled`,
// so this needs no schema migration. A page with no row is ENABLED: rows are
// only written when an admin actually turns something off.

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Revalidation tag — see updateTag() in src/actions/page-toggles.ts. */
export const PAGE_TOGGLES_TAG = "page-toggles";

/** Settings key for a page's on/off flag. */
export function pageToggleKey(slug: PageSlug): string {
  return `page.${slug}.enabled`;
}

export const MANAGEABLE_PAGES = [
  { slug: "visit", path: "/visit", labelAr: "خطط لزيارتك (الحجز)", labelEn: "Visit (Booking)" },
  { slug: "contact", path: "/contact", labelAr: "التواصل", labelEn: "Contact" },
  { slug: "collections", path: "/collections", labelAr: "المقتنيات", labelEn: "Collections" },
  { slug: "halls", path: "/halls", labelAr: "قاعات العرض", labelEn: "Halls" },
  { slug: "visitors", path: "/visitors", labelAr: "الزوّار والأخبار", labelEn: "Visitors & News" },
  { slug: "news", path: "/news", labelAr: "الأخبار", labelEn: "News" },
  { slug: "heritage", path: "/heritage", labelAr: "رحلة التراث", labelEn: "Heritage" },
  { slug: "sohar", path: "/sohar", labelAr: "صحار", labelEn: "Sohar" },
  { slug: "virtual-tour", path: "/virtual-tour", labelAr: "الجولة الافتراضية", labelEn: "Virtual Tour" },
  { slug: "about", path: "/about", labelAr: "عن المتحف", labelEn: "About" },
] as const;

export type PageSlug = (typeof MANAGEABLE_PAGES)[number]["slug"];

export const PAGE_SLUGS = MANAGEABLE_PAGES.map((p) => p.slug) as readonly PageSlug[];

export function isPageSlug(value: string): value is PageSlug {
  return (PAGE_SLUGS as readonly string[]).includes(value);
}

/**
 * Slugs the admin has switched off. Cached so the lookup costs nothing per
 * request, and invalidated immediately when a toggle is saved.
 */
export const getDisabledPages = unstable_cache(
  async (): Promise<PageSlug[]> => {
    try {
      const rows = await prisma.siteSetting.findMany({
        where: { key: { startsWith: "page." } },
        select: { key: true, valueEn: true },
      });

      return rows
        .filter((row) => row.valueEn.trim().toLowerCase() === "false")
        .map((row) => row.key.replace(/^page\./, "").replace(/\.enabled$/, ""))
        .filter(isPageSlug);
    } catch (error) {
      // Fail open: a settings outage should not take the whole site offline.
      console.warn("page-toggles: database unavailable, treating all pages as enabled", error);
      return [];
    }
  },
  ["page-toggles"],
  { tags: [PAGE_TOGGLES_TAG], revalidate: 3600 }
);

export async function isPageEnabled(slug: PageSlug): Promise<boolean> {
  const disabled = await getDisabledPages();
  return !disabled.includes(slug);
}
