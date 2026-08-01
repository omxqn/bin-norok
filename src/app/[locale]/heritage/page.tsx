"use client";

// Heritage Journey — vertical timeline ported from the reference design.

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";

const timeline = [
  {
    icon: "family",
    yearAr: "الجذور",
    yearEn: "Roots",
    titleAr: "إرث العائلة",
    titleEn: "Family Heritage",
    descAr: "تغرس عائلة أحمد نوروك البلوشي تقليداً حياً للذاكرة تكرّم الجذور البلوشية والعمانية عبر الأجيال.",
    descEn: "The Ahmed Norok Al-Balushi family cultivates a living tradition of memory, honouring Baluchi and Omani roots across generations.",
  },
  {
    icon: "stamps",
    yearAr: "التجميع",
    yearEn: "Collection",
    titleAr: "الطوابع والعملات",
    titleEn: "Stamps & Coins",
    descAr: "عقود من الشغف بالتجميع تُكوّن أرشيفاً متميزاً للفيلاتيليا والنميات في بيت العائلة.",
    descEn: "Decades of passionate collecting assemble a distinguished archive of philately and numismatics within the family home.",
  },
  {
    icon: "documents",
    yearAr: "الحفظ",
    yearEn: "Preservation",
    titleAr: "الوثائق والصور",
    titleEn: "Documents & Photographs",
    descAr: "تُحفظ الوثائق والصور الحساسة عبر نسخ دقيقة وعرض أرشيفي للدراسة المستقبلية.",
    descEn: "Critical papers and images are conserved through careful reproduction and archival presentation for future study.",
  },
  {
    icon: "museum",
    yearAr: "عقد ٢٠٢٠",
    yearEn: "2020s",
    titleAr: "تأسيس المتحف",
    titleEn: "Establishment of the Museum",
    descAr: "يُفتتح متحف بن نوروك كمؤسسة ثقافية خاصة — قاعات مُنتقاة تستقبل الزيارات المنسقة.",
    descEn: "Bin Norouk Museum opens as a private cultural institution — curated rooms welcoming coordinated visits.",
  },
  {
    icon: "heritage-mark",
    yearAr: "الرؤية",
    yearEn: "Vision",
    titleAr: "استمرار الإرث",
    titleEn: "Continuing the Legacy",
    descAr: "الزيارات التعليمية والعناية الأرشيفية والاقتناء الجديد يمدّ إرث العائلة للأجيال القادمة.",
    descEn: "Educational visits, archival care, and new acquisitions extend family heritage for future generations.",
  },
];

export default function HeritagePage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        label={isAr ? "الرحلة" : "Journey"}
        title={isAr ? "رحلة التراث" : "Heritage Journey"}
        description={
          isAr
            ? "من جذور العائلة إلى متحف مكرّس لحفظ ذاكرة الأجيال."
            : "From family roots to a museum devoted to preserving generations of memory."
        }
      />

      <div className="px-6 max-w-3xl mx-auto pt-14 relative">
        {/* Vertical gold line */}
        <div className="absolute top-14 bottom-0 start-[27px] md:start-1/2 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent md:-translate-x-1/2 rtl:md:translate-x-1/2" />

        <div className="space-y-12">
          {timeline.map((item, idx) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className={`relative flex items-start gap-6 md:gap-0 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Marker */}
              <div className="relative z-10 shrink-0 md:absolute md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2">
                <div className="w-14 h-14 rounded-full bg-cream border-2 border-gold flex items-center justify-center text-gold-dark shadow-md">
                  <Icon name={item.icon} size={24} />
                </div>
              </div>

              {/* Card */}
              <div className={`flex-1 md:w-1/2 md:flex-none ${idx % 2 === 0 ? "md:pe-14" : "md:ps-14"}`}>
                <div className="heritage-card p-6">
                  <span className="section-label !text-[0.6rem]">
                    {isAr ? item.yearAr : item.yearEn}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-wine mt-1 mb-2">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    {isAr ? item.descAr : item.descEn}
                  </p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="text-center mt-16">
          <Link
            href={`/${locale}/visit`}
            className="inline-flex items-center gap-2.5 bg-forest text-white hover:bg-[#2a2014] transition-all duration-300 font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase shadow-md hover:-translate-y-0.5"
          >
            {isAr ? "كن جزءاً من الحكاية — خطط لزيارتك" : "Be part of the story — plan your visit"}
          </Link>
        </div>
      </div>
    </div>
  );
}
