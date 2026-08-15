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

  const title = isAr ? "رحلة التراث" : "Heritage Journey";
  const description = isAr
    ? "رحلة عبر التراث العماني وتاريخ البيت العماني كما يرويه متحف بن نوروك."
    : "A journey through Omani heritage and the story of the Omani home at Bin Norook Museum.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/heritage`,
      languages: {
        ar: `${siteUrl}/ar/heritage`,
        en: `${siteUrl}/en/heritage`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/heritage`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function HeritageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="heritage" locale={locale}>
      {children}
    </PageGate>
  );
}
