"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Landmark, Layers, Compass, Users } from "lucide-react";
import { CountUp } from "@/components/CountUp";

export function Stats() {
  const t = useTranslations("Stats");

  const stats = [
    { value: 1000, suffix: "+", label: t("artifactsLabel"), icon: Landmark },
    { value: 3, suffix: "", label: t("erasLabel"), icon: Compass },
    { value: 6, suffix: "", label: t("hallsLabel"), icon: Layers },
    { value: 5000, suffix: "+", label: t("visitorsLabel"), icon: Users },
  ];

  return (
    <section className="py-16 md:py-20 bg-heritage-dark relative overflow-hidden">
      {/* Faint gold lattice */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23f0d890' stroke-width='.5'/%3E%3C/svg%3E\")",
          backgroundSize: "60px",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 divide-gold/15">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center flex flex-col items-center md:border-e md:last:border-e-0 md:[&:nth-child(2)]:border-e-0 lg:[&:nth-child(2)]:border-e md:border-gold/15 px-2"
            >
              <stat.icon className="w-7 h-7 md:w-9 md:h-9 text-gold-2 mb-4" strokeWidth={1.5} />
              <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#F5ECD8] mb-2 font-[family-name:var(--font-cormorant)]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="gold-divider mb-3 opacity-60" />
              <div className="text-xs md:text-sm font-medium text-[#F0E8D8]/70 tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
