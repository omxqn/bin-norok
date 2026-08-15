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

  const title = isAr ? "عن المتحف" : "About the Museum";
  const description = isAr
    ? "قصة متحف بن نوروك في صحار ورسالته في حفظ ذاكرة عُمان وتراث البيت العماني."
    : "The story of Bin Norook Museum in Sohar and its mission to preserve Omani memory and heritage.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        ar: `${siteUrl}/ar/about`,
        en: `${siteUrl}/en/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/about`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="about" locale={locale}>
      {children}
    </PageGate>
  );
}
