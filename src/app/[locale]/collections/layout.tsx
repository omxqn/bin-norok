import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { PageGate } from "@/components/PageGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr ? "المقتنيات" : "Collections";
  const description = isAr
    ? "مجموعة متحف بن نوروك من الوثائق والصور والعملات والطوابع والمقتنيات العائلية النادرة."
    : "The Bin Norook Museum collection of documents, photographs, coins, stamps and rare family heirlooms.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/collections`,
      languages: {
        ar: `${siteUrl}/ar/collections`,
        en: `${siteUrl}/en/collections`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/collections`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function CollectionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="collections" locale={locale}>
      {children}
    </PageGate>
  );
}
