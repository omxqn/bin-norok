"use client";

import { useLocale } from "next-intl";
import { FadeIn } from "../FadeIn";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function MuseumStory({ disabledPages = [] }: { disabledPages?: string[] }) {
  const locale = useLocale();
  // The "read more" button lands on /about, which an admin can switch off.
  const aboutEnabled = !disabledPages.includes("about");

  return (
    <section className="pt-28 pb-14 relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center justify-center text-center">

        <FadeIn direction="up">
          <div className="space-y-7 max-w-3xl mx-auto relative flex flex-col items-center">

            <span className="section-label">
              {locale === "ar" ? "قصة المتحف" : "The Museum Story"}
            </span>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-wine leading-snug relative z-10 px-4 md:px-8">
              {locale === "ar"
                ? "إرث يمتد عبر الأجيال، ليحكي قصة حضارة أصيلة."
                : "A legacy that spans generations, telling the story of an authentic civilization."}
            </h2>

            <div className="gold-divider" />

            <p className="text-sm md:text-base text-ink-2 leading-loose relative z-10 px-4 md:px-12 max-w-2xl">
              {locale === "ar"
                ? "متحف بن نوروك ليس مجرد جدران تحتضن مقتنيات قديمة، بل هو نافذة تطل على تاريخ عريق، يروي تفاصيل الحياة اليومية لأجدادنا. أسسه شغف عميق بحفظ التراث ونقله للأجيال القادمة ليبقى حياً في الذاكرة."
                : "Bin Norouk Museum is not just walls holding ancient artifacts; it is a window into a deep history, telling the details of our ancestors' daily lives. It was founded by a deep passion for preserving heritage and passing it on to future generations so it remains alive in memory."}
            </p>

            {aboutEnabled && (
            <div className="pt-4 relative z-10 flex justify-center">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center justify-center gap-2.5 bg-forest text-white hover:bg-[#2a2014] transition-all duration-300 font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <span>{locale === "ar" ? "اقرأ المزيد عن المتحف" : "Read more about the museum"}</span>
                {locale === "ar" ? (
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
            )}

          </div>
        </FadeIn>

      </div>
    </section>
  );
}
