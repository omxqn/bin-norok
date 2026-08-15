import type { SiteContact } from "@/lib/site-settings";
import { siteUrl } from "@/lib/site-url";

/**
 * schema.org JSON-LD describing the museum.
 *
 * This is what lets Google show the opening hours, address, phone number and
 * logo in a knowledge panel and in local results, rather than just a blue
 * link. The Museum type inherits from LocalBusiness, so the address and
 * geo fields are the ones that matter most for "museum in Sohar" searches.
 */
export function StructuredData({
  locale,
  contact,
}: {
  locale: string;
  contact: SiteContact;
}) {
  const isAr = locale === "ar";

  const data = {
    "@context": "https://schema.org",
    "@type": "Museum",
    "@id": `${siteUrl}/#museum`,
    name: isAr ? "متحف بن نوروك" : "Bin Norook Museum",
    alternateName: isAr ? "Bin Norook Museum" : "متحف بن نوروك",
    description: isAr
      ? "متحف يحفظ ذاكرة صحار وتراث البيت العماني من وثائق وصور وعملات وطوابع ومقتنيات عائلية."
      : "A museum preserving the memory of Sohar and the heritage of the Omani home through documents, photographs, coins, stamps and family heirlooms.",
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og-image.png`,
    telephone: contact.phoneHref,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: isAr ? "صحار" : "Sohar",
      addressRegion: isAr ? "شمال الباطنة" : "North Al Batinah",
      addressCountry: "OM",
    },
    // Mirrors the hours published on the visit page.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "13:30",
        closes: "18:00",
      },
    ],
    sameAs: [contact.instagram, `https://wa.me/${contact.whatsapp}`].filter(
      (url) => url && url !== "#"
    ),
    inLanguage: ["ar", "en"],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape "<", which could otherwise close this
      // script tag early if a value ever contained markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
