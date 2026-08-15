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

  const title = isAr ? "خطط لزيارتك واحجز" : "Plan Your Visit & Book";
  const description = isAr
    ? "احجز زيارتك لمتحف بن نوروك في صحار: مواعيد العمل، أسعار التذاكر، والحجز الإلكتروني للأفراد والمجموعات والمدارس."
    : "Book your visit to Bin Norook Museum in Sohar: opening hours, ticket prices, and online booking for individuals, groups and schools.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/visit`,
      languages: {
        ar: `${siteUrl}/ar/visit`,
        en: `${siteUrl}/en/visit`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/visit`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function VisitLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="visit" locale={locale}>
      {children}
    </PageGate>
  );
}
