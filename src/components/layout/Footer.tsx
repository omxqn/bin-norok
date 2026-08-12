"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { SiteContact } from "@/lib/site-settings";

export function Footer({
  contact,
  disabledPages = [],
}: {
  contact: SiteContact;
  disabledPages?: string[];
}) {
  const locale = useLocale();
  const pathname = usePathname();

  // Admin has its own chrome — hide the public footer there
  if (pathname?.includes("/admin")) return null;

  // `slug` maps to the admin page toggles; links for disabled pages are hidden.
  const allLinks = [
    { name: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}`, slug: null },
    { name: locale === "ar" ? "عن المتحف" : "About", href: `/${locale}/about`, slug: "about" },
    { name: locale === "ar" ? "قاعات العرض" : "Halls", href: `/${locale}/halls`, slug: "halls" },
    { name: locale === "ar" ? "المقتنيات" : "Collections", href: `/${locale}/collections`, slug: "collections" },
    { name: locale === "ar" ? "رحلة التراث" : "Heritage", href: `/${locale}/heritage`, slug: "heritage" },
    { name: locale === "ar" ? "صحار" : "Sohar", href: `/${locale}/sohar`, slug: "sohar" },
    { name: locale === "ar" ? "الجولة الافتراضية" : "Virtual Tour", href: `/${locale}/virtual-tour`, slug: "virtual-tour" },
    { name: locale === "ar" ? "الزوّار والأخبار" : "Visitors", href: `/${locale}/visitors`, slug: "visitors" },
    { name: locale === "ar" ? "خطط لزيارتك" : "Visit", href: `/${locale}/visit`, slug: "visit" },
    { name: locale === "ar" ? "التواصل" : "Contact", href: `/${locale}/contact`, slug: "contact" },
  ].filter((link) => !link.slug || !disabledPages.includes(link.slug));

  return (
    <footer className="bg-heritage-header text-[#EDE6D8] pt-10 pb-6 border-t border-gold/20 mt-auto">
      <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-5">

        {/* Museum name with heritage mark */}
        <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight">
          <span className="text-gold text-[9px] leading-none">◆</span>
          {locale === "ar" ? "متحف بن نوروك" : "Bin Norouk Museum"}
          <span className="text-gold text-[9px] leading-none">◆</span>
        </h3>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[#B8A892]">
          {allLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              // py-2 on a 16px line gives a ~36px touch target on a phone
              // without changing the desktop look — gap-y-2 absorbs it.
              className="hover:text-gold-2 transition-colors text-xs md:text-sm font-medium py-2 md:py-0"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Contact Info & Socials */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-[#B8A892] text-xs md:text-sm" dir="ltr">
          {/* Phone, mail and the social icons are the smallest things on the
              page — padded to a thumb-sized target rather than resized. */}
          <a href={`tel:${contact.phoneHref}`} className="flex items-center gap-1.5 hover:text-gold-2 transition-colors py-2">
            <Icon name="phone" size={14} className="text-gold-dark" />
            {contact.phone}
          </a>
          <span className="hidden md:inline text-gold/30">·</span>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-gold-2 transition-colors py-2">
            <Icon name="email" size={14} className="text-gold-dark" />
            {contact.email}
          </a>
          <span className="hidden md:inline text-gold/30">·</span>
          <div className="flex gap-1">
            <a href={contact.instagram} aria-label="Instagram" className="hover:text-gold-2 transition-colors inline-flex items-center justify-center w-11 h-11">
              <Icon name="instagram" size={15} />
            </a>
            <a href="#" aria-label="X" className="hover:text-gold-2 transition-colors inline-flex items-center justify-center w-11 h-11">
              <Icon name="x" size={15} />
            </a>
            <a href={`https://wa.me/${contact.whatsapp}`} aria-label="WhatsApp" className="hover:text-gold-2 transition-colors inline-flex items-center justify-center w-11 h-11">
              <Icon name="whatsapp" size={15} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full pt-5 mt-1 border-t border-gold/15 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-[11px] md:text-xs text-[#B8A892]/80">
          <p>
            {locale === "ar"
              ? `© ${new Date().getFullYear()} متحف بن نوروك. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Bin Norouk Museum. All rights reserved.`}
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gold-2 transition-colors py-2">
              {locale === "ar" ? "الشروط والأحكام" : "Terms"}
            </Link>
            <Link href="#" className="hover:text-gold-2 transition-colors py-2">
              {locale === "ar" ? "الخصوصية" : "Privacy"}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
