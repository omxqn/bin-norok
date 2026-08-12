"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Clock, LayoutGrid, MapPin, CalendarCheck, ChevronDown } from "lucide-react";

const HERO_IMAGES = [
  "/images/museum/halls/sultan room1.jpeg",
  "/images/museum/halls/world room1.jpeg",
  "/images/museum/halls/Living room.jpeg",
];

export function Hero({ disabledPages = [] }: { disabledPages?: string[] }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isAr = locale === "ar";
  // Both CTAs point at pages an admin can switch off — see /admin/pages.
  const visitEnabled = !disabledPages.includes("visit");
  const hallsEnabled = !disabledPages.includes("halls");
  const reduceMotion = useReducedMotion();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const quickInfo = [
    { icon: Clock, label: isAr ? "ساعات العمل" : "Open", value: isAr ? "٩ص – ٥م" : "9AM – 5PM" },
    { icon: LayoutGrid, label: isAr ? "قاعات العرض" : "Halls", value: isAr ? "٦ قاعات" : "6 Halls" },
    { icon: MapPin, label: isAr ? "الموقع" : "Location", value: isAr ? "صحار، عُمان" : "Sohar, Oman" },
    { icon: CalendarCheck, label: isAr ? "الزيارة" : "Visit", value: isAr ? "بالحجز المسبق" : "By booking" },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGES[currentImage]}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lighter, warmer overlay — readable but not murky.
            Stronger toward the start-side where the text sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241c11]/85 via-[#241c11]/35 to-[#241c11]/50" />
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#241c11]/55 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="max-w-2xl text-center md:text-start mx-auto md:mx-0 flex flex-col items-center md:items-start"
        >
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-gold-2 mb-5"
          >
            <span className="text-gold text-[7px]">◆</span>
            {isAr ? "متحف تراثي خاص · صحار، سلطنة عُمان" : "Private Heritage Museum · Sohar, Oman"}
          </motion.p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#FAF4E6] leading-[1.06] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {t("title")}
          </h1>

          {/* Animated gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="h-0.5 w-16 my-6 bg-gradient-to-r from-gold via-gold-2 to-transparent rtl:bg-gradient-to-l origin-[inline-start]"
          />

          <p className="text-sm md:text-base text-[#F0E8D8]/90 leading-loose max-w-xl mb-8">
            {isAr
              ? "أرشيف حيّ لذاكرة العائلة والتراث العماني والتقاليد البلوشية — رحلة عبر الزمن بين المقتنيات والوثائق والقصص."
              : "A living archive of family memory, Omani heritage, and Baluchi tradition — a journey through time among artifacts, documents, and stories."}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            {visitEnabled && (
              <Button className="group bg-gold hover:bg-gold-2 text-[#1a1510] rounded-md px-8 py-6 text-[12px] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(176,141,63,0.4)]" asChild>
                <Link href={`/${locale}/visit`}>{t("cta")}</Link>
              </Button>
            )}
            {hallsEnabled && (
              <Button variant="outline" className="text-[#F0E8D8] border-[#F0E8D8]/40 bg-white/5 hover:bg-white/12 hover:border-[#F0E8D8]/70 hover:text-white rounded-md px-8 py-6 text-[12px] font-bold tracking-[0.08em] uppercase backdrop-blur-md transition-all duration-300" asChild>
                <Link href={`/${locale}/halls`}>{t("secondaryCta")}</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick-info strip — glass panel */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="relative z-10 w-full mt-auto"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/15 backdrop-blur-md">
            {quickInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-[#241c11]/40 px-4 py-3.5">
                <item.icon className="w-5 h-5 text-gold-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#F0E8D8]/60 truncate">{item.label}</p>
                  <p className="text-sm font-bold text-[#FAF4E6] truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1], y: [0, 6, 0] }}
          transition={{ delay: 1.2, duration: 1.8, repeat: Infinity, repeatDelay: 0.3 }}
          className="hidden md:block absolute bottom-28 start-1/2 -translate-x-1/2 z-10 text-[#F0E8D8]/50"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      )}
    </section>
  );
}
