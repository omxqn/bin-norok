import Link from "next/link";
import { Icon } from "@/components/Icon";

/**
 * Shown in place of a page an admin has switched off. Deliberately not a 404 —
 * the page exists and will come back, so we say so rather than implying the
 * URL is wrong.
 */
export function PageDisabled({ locale }: { locale: string }) {
  const isAr = locale === "ar";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 pt-28 pb-16">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
          <Icon name="museum" size={36} />
        </div>

        <p className="section-label mb-3">
          {isAr ? "غير متاح حالياً" : "Temporarily Unavailable"}
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-wine mb-4">
          {isAr ? "هذه الصفحة مغلقة مؤقتاً" : "This page is closed for now"}
        </h1>

        <div className="gold-divider mx-auto mb-5" />

        <p className="text-sm md:text-base text-ink-2 leading-relaxed mb-8">
          {isAr
            ? "أوقفت إدارة المتحف هذه الخدمة مؤقتاً. نعتذر عن الإزعاج، ويسعدنا تواصلكم معنا مباشرة."
            : "The museum has paused this service temporarily. We apologise for the inconvenience — please feel free to contact us directly."}
        </p>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 bg-forest text-white hover:bg-[#2a2014] transition-all font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase"
        >
          {isAr ? "العودة إلى الرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
