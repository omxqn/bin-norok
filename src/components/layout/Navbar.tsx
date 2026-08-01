"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, ArrowLeft, ArrowRight } from "lucide-react";

export function Navbar() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const isAr = locale === "ar";
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Admin has its own chrome — hide the public navbar there
  const isAdminRoute = pathname?.includes("/admin");

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the full-screen mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: t("home"), href: `/${locale}` },
    { name: t("about"), href: `/${locale}/about` },
    { name: t("halls"), href: `/${locale}/halls` },
    { name: isAr ? "المقتنيات" : "Collections", href: `/${locale}/collections` },
    { name: isAr ? "صحار" : "Sohar", href: `/${locale}/sohar` },
    { name: isAr ? "الجولة الافتراضية" : "Virtual Tour", href: `/${locale}/virtual-tour` },
    { name: isAr ? "الزوّار والأخبار" : "Visitors", href: `/${locale}/visitors` },
    { name: t("contact"), href: `/${locale}/contact` },
  ];

  const solid = isScrolled || isMobileMenuOpen;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out",
          solid
            ? "bg-heritage-header/95 backdrop-blur-lg border-b border-gold/20 py-2.5 shadow-[0_2px_24px_rgba(15,11,6,0.35)]"
            : "bg-transparent border-b border-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-[#F0E8D2] p-2 -ms-2 hover:bg-white/10 rounded-md transition-colors shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={isAr ? "فتح القائمة" : "Open menu"}
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-[#F0E8D2] hover:text-gold-2 transition-colors font-[family-name:var(--font-cormorant)] rtl:font-[family-name:var(--font-amiri)] shrink-0"
          >
            <span className="text-gold text-[9px] leading-none">◆</span>
            {isAr ? "متحف بن نوروك" : "Bin Norouk"}
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-auto justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[13.5px] xl:text-[15px] font-medium tracking-wide transition-all px-2.5 xl:px-3 py-2 rounded-md whitespace-nowrap",
                    isActive
                      ? "text-gold-2 bg-white/10"
                      : "text-[#F0E8D2]/80 hover:text-gold-2 hover:bg-white/10"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster: language + prominent Plan-Visit CTA */}
          <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/visit`}
              className="hidden sm:inline-flex items-center gap-2 bg-gold hover:bg-gold-2 text-[#1a1510] font-bold text-[12px] tracking-[0.06em] uppercase px-4 py-2.5 rounded-md transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(176,141,63,0.35)]"
            >
              {t("visit")}
              <Arrow className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-[60] bg-gradient-to-b from-[#453723] to-[#2b2216] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/15 shrink-0">
              <span className="flex items-center gap-2 text-xl font-bold text-[#F0E8D2] font-[family-name:var(--font-amiri)]">
                <span className="text-gold text-[9px]">◆</span>
                {isAr ? "متحف بن نوروك" : "Bin Norouk"}
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#F0E8D2] p-2 -me-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-6 gap-1 flex-1 overflow-y-auto">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block text-2xl font-semibold py-3 border-b border-white/5 font-[family-name:var(--font-amiri)] transition-colors",
                        isActive ? "text-gold-2" : "text-[#F0E8D2]/85 hover:text-gold-2"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="shrink-0 p-6 border-t border-gold/15">
              <Link
                href={`/${locale}/visit`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-2 text-[#1a1510] font-bold text-sm tracking-[0.06em] uppercase px-6 py-4 rounded-lg transition-colors shadow-lg"
              >
                {t("visit")}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
