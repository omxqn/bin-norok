"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface FeaturedHallData {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imagePath: string;
}

export function FeaturedHalls({ halls }: { halls: FeaturedHallData[] }) {
  const t = useTranslations("FeaturedHalls");
  const locale = useLocale();
  const isAr = locale === "ar";
  
  // By default, expand the first card
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-28 bg-cream-alt/60 relative border-y border-gold/15">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="max-w-3xl w-full">
            <span className="section-label mb-3">
              {isAr ? "جولة في المتحف" : "Museum Tour"}
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-ink mb-3">
              {t("title")}
            </h3>
            <div className="gold-divider mx-auto mb-5" />

            {/* Hidden on mobile — the same button appears after the cards instead */}
            <Link
              href={`/${locale}/halls`}
              className="hidden md:inline-flex items-center justify-center gap-2 bg-transparent text-wine border border-wine/60 hover:bg-wine/10 transition-all font-bold px-6 py-3 rounded text-[12px] tracking-[0.08em] uppercase"
            >
              <span>{isAr ? "عرض جميع القاعات" : "View All Halls"}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>

        {/* Expanding Cards Layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 h-[640px] md:h-[500px] w-full">
          {halls.map((hall, idx) => {
            const isActive = activeIdx === idx;
            
            return (
              <motion.div
                key={hall.id}
                layout
                onHoverStart={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  layout: { duration: 0.5, ease: "circOut" }
                }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-md border transition-colors duration-500 ${
                  isActive ? "md:flex-[3] border-primary/20" : "md:flex-[1] border-transparent"
                } flex-1`}
              >
                <Image 
                  src={hall.imagePath || "/images/museum/placeholders/hall-default.jpg"}
                  alt={isAr ? hall.titleAr : hall.titleEn}
                  fill
                  className={`object-cover transition-transform duration-1000 ${isActive ? 'scale-105' : 'scale-100 grayscale-[30%]'}`}
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent' : 'bg-black/40'}`} />

                {/* Content Container */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div className="max-w-lg">
                      {/* Number Badge */}
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center text-white font-mono font-bold text-sm md:text-base mb-3 md:mb-4 backdrop-blur-md transition-all duration-500 ${isActive ? 'bg-primary border-primary' : 'bg-white/10'}`}>
                        0{idx + 1}
                      </div>

                      <h4 className={`text-lg md:text-2xl font-bold text-white mb-2 drop-shadow-md transition-all duration-500 ${!isActive && 'md:truncate md:w-[150px]'}`}>
                        {isAr ? hall.titleAr : hall.titleEn}
                      </h4>
                      
                      {/* Description only shows when active */}
                      <motion.div 
                        initial={false}
                        animate={{ 
                          opacity: isActive ? 1 : 0,
                          height: isActive ? "auto" : 0,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium line-clamp-3 mb-6">
                          {isAr ? hall.descriptionAr : hall.descriptionEn}
                        </p>

                        <Link
                          href={`/${locale}/halls/${hall.slug}`}
                          className="inline-flex items-center gap-2 bg-white text-black hover:bg-primary hover:text-white transition-colors font-bold px-5 py-2.5 rounded-lg text-sm"
                        >
                          <span>{isAr ? "اكتشف القاعة" : "Explore Hall"}</span>
                          {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link
            href={`/${locale}/halls`}
            className="inline-flex items-center justify-center gap-2 bg-transparent text-wine border border-wine/60 hover:bg-wine/10 transition-all font-bold px-6 py-3 rounded w-full text-[12px] tracking-[0.08em] uppercase"
          >
            <span>{isAr ? "عرض جميع القاعات" : "View All Halls"}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
