"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();

  // Admin has its own chrome — hide the public footer there
  if (pathname?.includes("/admin")) return null;

  const allLinks = [
    { name: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
    { name: locale === "ar" ? "عن المتحف" : "About", href: `/${locale}/about` },
    { name: locale === "ar" ? "قاعات العرض" : "Halls", href: `/${locale}/halls` },
    { name: locale === "ar" ? "المقتنيات" : "Collections", href: `/${locale}/collections` },
    { name: locale === "ar" ? "رحلة التراث" : "Heritage", href: `/${locale}/heritage` },
    { name: locale === "ar" ? "صحار" : "Sohar", href: `/${locale}/sohar` },
    { name: locale === "ar" ? "الجولة الافتراضية" : "Virtual Tour", href: `/${locale}/virtual-tour` },
    { name: locale === "ar" ? "الزوّار والأخبار" : "Visitors", href: `/${locale}/visitors` },
    { name: locale === "ar" ? "خطط لزيارتك" : "Visit", href: `/${locale}/visit` },
    { name: locale === "ar" ? "التواصل" : "Contact", href: `/${locale}/contact` },
  ];

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
              className="hover:text-gold-2 transition-colors text-xs md:text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Contact Info & Socials */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-[#B8A892] text-xs md:text-sm" dir="ltr">
          <a href="tel:+96899339323" className="flex items-center gap-1.5 hover:text-gold-2 transition-colors">
            <Icon name="phone" size={14} className="text-gold-dark" />
            +968 99339323
          </a>
          <span className="hidden md:inline text-gold/30">·</span>
          <a href="mailto:zak.norocinvest@gmail.com" className="flex items-center gap-1.5 hover:text-gold-2 transition-colors">
            <Icon name="email" size={14} className="text-gold-dark" />
            zak.norocinvest@gmail.com
          </a>
          <span className="hidden md:inline text-gold/30">·</span>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="hover:text-gold-2 transition-colors">
              <Icon name="instagram" size={15} />
            </a>
            <a href="#" aria-label="X" className="hover:text-gold-2 transition-colors">
              <Icon name="x" size={15} />
            </a>
            <a href="https://wa.me/96899339323" aria-label="WhatsApp" className="hover:text-gold-2 transition-colors">
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
            <Link href="#" className="hover:text-gold-2 transition-colors">
              {locale === "ar" ? "الشروط والأحكام" : "Terms"}
            </Link>
            <Link href="#" className="hover:text-gold-2 transition-colors">
              {locale === "ar" ? "الخصوصية" : "Privacy"}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
