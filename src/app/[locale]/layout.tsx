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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Bin Norouk Museum | متحف بن نوروك",
  description: "Memory of Sohar and Omani Heritage | ذاكرة صحار وتراث البيت العماني",
  openGraph: {
    title: "Bin Norouk Museum | متحف بن نوروك",
    description: "Memory of Sohar and Omani Heritage | ذاكرة صحار وتراث البيت العماني",
    type: "website",
    locale: "ar_OM",
    siteName: "Bin Norouk Museum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bin Norouk Museum | متحف بن نوروك",
    description: "Memory of Sohar and Omani Heritage",
  },
};

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

  // Cached (1h, tag-invalidated on save) so this adds no per-request query.
  const contact = await getSiteContact();

  return (
    <html lang={locale} dir={dir} className={`${amiri.variable} ${cormorant.variable} ${outfit.variable} ${notoArabic.variable} ${plexArabic.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
          <Footer contact={contact} />
          <WhatsAppButton number={contact.whatsapp} />
          <Toaster richColors position={dir === "rtl" ? "top-left" : "top-right"} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
