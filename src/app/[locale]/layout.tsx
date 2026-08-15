import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, localeDirection, type Locale } from "@/i18n/config";
import { Amiri, Cormorant_Garamond, Outfit, Noto_Sans_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSiteContact } from "@/lib/site-settings";
import { getDisabledPages } from "@/lib/page-toggles";
import { siteUrl } from "@/lib/site-url";
import { StructuredData } from "@/components/StructuredData";
import type { Metadata } from "next";
import "../globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
});
// Modern Arabic body/UI font — clean, highly readable, wide weight range
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "متحف بن نوروك | ذاكرة صحار وتراث البيت العماني"
    : "Bin Norook Museum | Memory of Sohar and Omani Heritage";

  const description = isAr
    ? "متحف بن نوروك في صحار، سلطنة عُمان — مجموعة من الوثائق والصور والعملات والطوابع والمقتنيات التي تحفظ ذاكرة صحار وتراث البيت العماني. خطط لزيارتك واحجز جولتك."
    : "Bin Norook Museum in Sohar, Oman — documents, photographs, coins, stamps and heirlooms preserving the memory of Sohar and the heritage of the Omani home. Plan your visit and book a tour.";

  return {
    metadataBase: new URL(siteUrl),
    // Per-page titles fill the template; the home page uses `default`.
    title: {
      default: title,
      template: isAr ? "%s | متحف بن نوروك" : "%s | Bin Norook Museum",
    },
    description,
    applicationName: isAr ? "متحف بن نوروك" : "Bin Norook Museum",
    // hreflang: tells search engines these are translations of one another
    // rather than duplicate content competing with each other.
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/${locale}`,
      locale: isAr ? "ar_OM" : "en_OM",
      alternateLocale: isAr ? "en_OM" : "ar_OM",
      siteName: isAr ? "متحف بن نوروك" : "Bin Norook Museum",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isAr ? "متحف بن نوروك" : "Bin Norook Museum",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: { telephone: true, address: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  // Both cached (1h, tag-invalidated on save) so they add no per-request query.
  const [contact, disabledPages] = await Promise.all([
    getSiteContact(),
    getDisabledPages(),
  ]);

  return (
    <html lang={locale} dir={dir} className={`${amiri.variable} ${cormorant.variable} ${outfit.variable} ${notoArabic.variable} ${plexArabic.variable}`}>
      <body>
        <StructuredData locale={locale} contact={contact} />
        <NextIntlClientProvider messages={messages}>
          <Navbar disabledPages={disabledPages} />
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
          <Footer contact={contact} disabledPages={disabledPages} />
          <WhatsAppButton number={contact.whatsapp} />
          <Toaster richColors position={dir === "rtl" ? "top-left" : "top-right"} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
