"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
          <Icon name="map" size={36} />
        </div>

        <p className="section-label mb-3">{isAr ? "الصفحة غير موجودة" : "Page Not Found"}</p>

        <h1 className="text-6xl font-bold text-wine mb-4">404</h1>

        <div className="gold-divider mx-auto mb-5" />

        <p className="text-sm md:text-base text-ink-2 leading-relaxed mb-8">
          {isAr
            ? "يبدو أنك ضللت الطريق بين أروقة المتحف — الصفحة التي تبحث عنها غير موجودة."
            : "It seems you've wandered off between the museum corridors — the page you're looking for doesn't exist."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-forest text-white hover:bg-[#2a2014] transition-all font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase"
          >
            {isAr ? "العودة إلى الرئيسية" : "Back to Home"}
          </Link>
          <Link
            href={`/${locale}/halls`}
            className="inline-flex items-center gap-2 text-wine border border-wine/60 hover:bg-wine/10 transition-all font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase"
          >
            {isAr ? "استكشف القاعات" : "Explore the Halls"}
          </Link>
        </div>
      </div>
    </div>
  );
}
