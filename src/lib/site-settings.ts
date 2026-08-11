// ===========================================
// Public site settings (admin-managed)
// ===========================================
// The contact details shown across the public site used to be hardcoded in
// Footer.tsx and WhatsAppButton.tsx, so /admin/settings controlled nothing.
// These read the SiteSetting table instead, cached so the lookup does not add
// a database round-trip to every page render.

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Revalidation tag — see revalidateTag() in src/actions/settings.ts. */
export const SITE_SETTINGS_TAG = "site-settings";

export type SiteContact = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  instagram: string;
};

// Used when the database is unreachable, the key is missing, or the admin has
// not replaced the seeded placeholder yet.
const FALLBACK: SiteContact = {
  phone: "+968 99339323",
  phoneHref: "+96899339323",
  whatsapp: "96899339323",
  email: "zak.norocinvest@gmail.com",
  instagram: "#",
};

/** Seeded placeholders should behave as "not configured". */
function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  return (
    trimmed === "" ||
    trimmed === "#" ||
    trimmed.includes("XXXX") ||
    trimmed.includes("example.com")
  );
}

function pick(
  rows: { key: string; valueEn: string | null; valueAr: string | null }[],
  key: string,
  fallback: string
): string {
  const row = rows.find((r) => r.key === key);
  const value = !isPlaceholder(row?.valueEn) ? row?.valueEn : row?.valueAr;
  return isPlaceholder(value) ? fallback : (value as string).trim();
}

/** Strip everything but digits — required by tel: and wa.me links. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export const getSiteContact = unstable_cache(
  async (): Promise<SiteContact> => {
    try {
      const rows = await prisma.siteSetting.findMany({
        where: { key: { in: ["phone", "whatsapp", "email", "instagram"] } },
        select: { key: true, valueEn: true, valueAr: true },
      });

      const phone = pick(rows, "phone", FALLBACK.phone);
      const whatsapp = pick(rows, "whatsapp", FALLBACK.whatsapp);

      return {
        phone,
        phoneHref: `+${digitsOnly(phone)}`,
        whatsapp: digitsOnly(whatsapp) || FALLBACK.whatsapp,
        email: pick(rows, "email", FALLBACK.email),
        instagram: pick(rows, "instagram", FALLBACK.instagram),
      };
    } catch (error) {
      // Never let a settings lookup take down a public page.
      console.warn("site-settings: database unavailable, using defaults", error);
      return FALLBACK;
    }
  },
  ["site-contact"],
  { tags: [SITE_SETTINGS_TAG], revalidate: 3600 }
);
