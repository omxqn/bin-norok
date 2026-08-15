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

  const title = isAr ? "الأخبار والفعاليات" : "News & Events";
  const description = isAr
    ? "آخر أخبار وفعاليات متحف بن نوروك في صحار، سلطنة عُمان."
    : "The latest news and events from Bin Norook Museum in Sohar, Oman.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/news`,
      languages: {
        ar: `${siteUrl}/ar/news`,
        en: `${siteUrl}/en/news`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/news`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function NewsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="news" locale={locale}>
      {children}
    </PageGate>
  );
}
