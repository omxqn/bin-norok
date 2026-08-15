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

  const title = isAr ? "تواصل معنا" : "Contact Us";
  const description = isAr
    ? "تواصل مع متحف بن نوروك في صحار — الهاتف والبريد الإلكتروني ونموذج المراسلة للاستفسارات والزيارات المدرسية."
    : "Get in touch with Bin Norook Museum in Sohar — phone, email and a message form for enquiries and school visits.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/contact`,
      languages: {
        ar: `${siteUrl}/ar/contact`,
        en: `${siteUrl}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/contact`,
      images: ["/og-image.png"],
    },
  };
}


// Segment gate — an admin can take this page offline from /admin/pages.
export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="contact" locale={locale}>
      {children}
    </PageGate>
  );
}
