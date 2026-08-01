"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BookingWizard } from "@/components/visit/BookingWizard";

export default function VisitPage() {
  const t = useTranslations("Visit");
  const locale = useLocale();
  const isAr = locale === "ar";

  const hours = isAr
    ? [
        { day: "السبت إلى الخميس", from: "٩:٠٠ ص", to: "٥:٠٠ م" },
        { day: "الجمعة", from: "١:٣٠ م", to: "٦:٠٠ م" },
      ]
    : [
        { day: "Sat – Thu", from: "9:00 AM", to: "5:00 PM" },
        { day: "Friday", from: "1:30 PM", to: "6:00 PM" },
      ];

  return (
    <div className="min-h-screen pb-20">
      <PageHero
        label={isAr ? "أهلاً بكم" : "Welcome"}
        title={t("title")}
        description={t("description")}
      />

      <div className="px-6 max-w-6xl mx-auto pt-10">
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Booking wizard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="text-center lg:text-start mb-6">
              <span className="section-label mb-2">{isAr ? "احجز زيارتك" : "Book Your Visit"}</span>
              <h2 className="text-2xl font-semibold text-wine">{t("bookTitle")}</h2>
            </div>
            <BookingWizard />
          </motion.div>

          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Heading matches the wizard column so both cards start level
                (no mb here — the column's gap-6 already spaces it) */}
            <div className="text-center lg:text-start hidden lg:block">
              <span className="section-label mb-2">{isAr ? "معلومات مفيدة" : "Good to Know"}</span>
              <h2 className="text-2xl font-semibold text-wine">{isAr ? "قبل زيارتك" : "Before You Visit"}</h2>
            </div>

            {/* Working hours */}
            <div className="heritage-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{isAr ? "ساعات العمل" : "Working Hours"}</h3>
                  <p className="text-xs text-ink-3">{isAr ? "نستقبلكم في الأوقات التالية" : "We welcome you at these times"}</p>
                </div>
              </div>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="bg-cream rounded-xl px-4 py-3 border border-gold/10">
                    <p className="text-xs font-bold text-ink-3 mb-1.5">{h.day}</p>
                    <div className="flex items-center justify-between text-wine font-bold text-sm" dir="ltr">
                      <span>{h.from}</span>
                      <span className="text-gold-dark">—</span>
                      <span>{h.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <a
              href="https://www.google.com/maps?q=Ben+Norrock,+Sohar"
              target="_blank"
              rel="noopener noreferrer"
              className="heritage-card overflow-hidden block relative group !p-0 flex-1 min-h-[240px]"
            >
              <iframe
                title={isAr ? "موقع المتحف" : "Museum location"}
                src="https://maps.google.com/maps?q=Ben+Norrock,+Sohar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[240px]"
                style={{ border: 0, pointerEvents: "none" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-gold text-[#1a1510] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg translate-y-3 group-hover:translate-y-0 text-sm">
                  <MapPin className="w-4 h-4" />
                  {isAr ? "افتح في خرائط جوجل" : "Open in Google Maps"}
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
