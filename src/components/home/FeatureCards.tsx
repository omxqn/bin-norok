"use client";

// Three creative feature cards — each with its own accent, a stat,
// an animated arrow, and a hover lift. Shared design system, distinct personality.

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Icon } from "@/components/Icon";

export function FeatureCards({ disabledPages = [] }: { disabledPages?: string[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // `slug` maps to the admin page toggles; a card for a disabled page is
  // dropped rather than linking visitors into a closed page.
  const cards = [
    {
      slug: "halls",
      icon: "sections",
      accent: "var(--color-wine)",
      stat: isAr ? "٦" : "6",
      statLabel: isAr ? "قاعات" : "Halls",
      title: isAr ? "قاعات المتحف" : "Museum Rooms",
      desc: isAr
        ? "ست قاعات، كل واحدة منها تروي فصلاً خاصاً من فصول التراث العماني."
        : "Six rooms, each telling its own chapter of Omani heritage.",
      href: `/${locale}/halls`,
    },
    {
      slug: "visit",
      icon: "visit",
      accent: "var(--color-gold-dark)",
      stat: isAr ? "٩–٥" : "9–5",
      statLabel: isAr ? "يومياً" : "Daily",
      title: isAr ? "خطط لزيارتك" : "Plan Your Visit",
      desc: isAr
        ? "الزيارات بموعد مسبق — احجز زيارتك ونستقبلك بحفاوة الضيافة العمانية."
        : "Visits by prior appointment — book yours and be welcomed.",
      href: `/${locale}/visit`,
    },
    {
      slug: "visitors",
      icon: "family",
      accent: "var(--color-forest)",
      stat: "★",
      statLabel: isAr ? "شهادات" : "Reviews",
      title: isAr ? "الزوّار والأخبار" : "Visitors & News",
      desc: isAr
        ? "الزيارات الرسمية والتغطيات الإعلامية وانطباعات ضيوف المتحف."
        : "Official visits, media coverage, and guest testimonials.",
      href: `/${locale}/visitors`,
    },
  ].filter((card) => !disabledPages.includes(card.slug));

  if (cards.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.icon}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.25, 0, 0.15, 1] }}
            >
              <Link href={card.href} className="group block h-full">
                <article
                  className="heritage-card relative p-7 flex flex-col gap-3 h-full text-start overflow-hidden"
                  style={{ borderTopColor: card.accent }}
                >
                  {/* Watermark stat, top corner */}
                  <div className="absolute top-4 end-5 text-end leading-none opacity-90">
                    <div className="text-3xl font-bold font-[family-name:var(--font-cormorant)]" style={{ color: card.accent }}>
                      {card.stat}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-3 mt-0.5">
                      {card.statLabel}
                    </div>
                  </div>

                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.accent }}
                  >
                    <Icon name={card.icon} size={24} />
                  </div>

                  <h3 className="text-xl font-semibold text-ink mt-1">{card.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed flex-1">{card.desc}</p>

                  <span className="inline-flex items-center gap-2 mt-2 text-[11px] font-bold tracking-[0.1em] uppercase text-wine">
                    {isAr ? "اعرف المزيد" : "Learn more"}
                    <Arrow className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>

                  {/* Bottom accent line grows on hover */}
                  <span
                    className="absolute bottom-0 inset-x-0 h-0.5 origin-[inline-start] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: card.accent }}
                  />
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
