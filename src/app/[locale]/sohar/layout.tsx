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

  const title = isAr ? "صحار" : "Sohar";
  const description = isAr
    ? "صحار عاصمة عُمان التاريخية وميناء التجارة القديم — تاريخها وذاكرتها في متحف بن نوروك."
    : "Sohar, Oman historic capital and ancient trading port — its history and memory at Bin Norook Museum.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/sohar`,
      languages: {
        ar: `${siteUrl}/ar/sohar`,
        en: `${siteUrl}/en/sohar`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/sohar`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function SoharLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="sohar" locale={locale}>
      {children}
    </PageGate>
  );
}
