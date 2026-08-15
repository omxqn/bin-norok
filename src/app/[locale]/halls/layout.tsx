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

  const title = isAr ? "قاعات العرض" : "Exhibition Halls";
  const description = isAr
    ? "تعرّف على قاعات متحف بن نوروك، وكل قاعة تروي فصلاً من فصول التراث العماني وذاكرة صحار."
    : "Explore the halls of Bin Norook Museum — each telling a chapter of Omani heritage and the memory of Sohar.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/halls`,
      languages: {
        ar: `${siteUrl}/ar/halls`,
        en: `${siteUrl}/en/halls`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/halls`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function HallsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="halls" locale={locale}>
      {children}
    </PageGate>
  );
}
