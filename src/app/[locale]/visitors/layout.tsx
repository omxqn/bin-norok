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

  const title = isAr ? "الزوّار والأخبار" : "Visitors & News";
  const description = isAr
    ? "زيارات رسمية وسجل الزوّار وأحدث أخبار متحف بن نوروك."
    : "Official visits, the visitors book, and the latest from Bin Norook Museum.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/visitors`,
      languages: {
        ar: `${siteUrl}/ar/visitors`,
        en: `${siteUrl}/en/visitors`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/visitors`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function VisitorsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="visitors" locale={locale}>
      {children}
    </PageGate>
  );
}
