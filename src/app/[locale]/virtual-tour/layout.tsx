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

  const title = isAr ? "الجولة الافتراضية" : "Virtual Tour";
  const description = isAr
    ? "جولة افتراضية بزاوية 360 درجة داخل قاعات متحف بن نوروك في صحار."
    : "A 360-degree virtual tour inside the halls of Bin Norook Museum in Sohar.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/virtual-tour`,
      languages: {
        ar: `${siteUrl}/ar/virtual-tour`,
        en: `${siteUrl}/en/virtual-tour`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/virtual-tour`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function VirtualTourLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="virtual-tour" locale={locale}>
      {children}
    </PageGate>
  );
}
