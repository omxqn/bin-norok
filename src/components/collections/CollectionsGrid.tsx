"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface CategoryData {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface ItemData {
  id: string;
  titleAr: string;
  titleEn: string;
  period?: string | null;
  imagePath?: string | null;
  categoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
}

interface CollectionsGridProps {
  locale: string;
  categories: CategoryData[];
  items: ItemData[];
  allLabel: string;
}

export function CollectionsGrid({ locale, categories, items, allLabel }: CollectionsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const isAr = locale === "ar";

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const inCategory = activeCategory === "all" || item.categoryId === activeCategory;
    if (!inCategory) return false;
    if (!normalizedQuery) return true;
    return (
      item.titleAr.toLowerCase().includes(normalizedQuery) ||
      item.titleEn.toLowerCase().includes(normalizedQuery) ||
      item.categoryNameAr.toLowerCase().includes(normalizedQuery) ||
      item.categoryNameEn.toLowerCase().includes(normalizedQuery)
    );
  });

  const chip = (active: boolean) =>
    `px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 ${
      active
        ? "bg-wine text-white shadow-md"
        : "bg-cream text-ink-2 border border-gold/30 hover:border-gold hover:text-wine"
    }`;

  return (
    <>
      {/* Search box */}
      <div className="max-w-md mx-auto mb-7 relative">
        <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-gold-dark pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? "ابحث في المقتنيات..." : "Search the collection..."}
          className="w-full ps-12 pe-4 py-3 rounded-full border border-gold/30 bg-cream focus:outline-none focus:ring-2 focus:ring-gold/40 text-ink placeholder:text-ink-3"
          aria-label={isAr ? "بحث" : "Search"}
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button onClick={() => setActiveCategory("all")} className={chip(activeCategory === "all")}>
          {allLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={chip(activeCategory === cat.id)}
          >
            {isAr ? cat.nameAr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-center text-xs text-ink-3 mb-6">
        {new Intl.NumberFormat(isAr ? "ar-OM" : "en-US").format(filteredItems.length)}{" "}
        {isAr ? "قطعة معروضة" : "items shown"}
      </p>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
            >
              <Link href={`/${locale}/collections/${item.id}`} className="group block h-full">
                <div className="heritage-card overflow-hidden h-full !p-0">
                  <div className="relative h-60 overflow-hidden">
                    {item.imagePath && !item.imagePath.includes("/placeholders/") ? (
                      <Image
                        src={item.imagePath}
                        alt={isAr ? item.titleAr : item.titleEn}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <ImagePlaceholder text={item.titleEn} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    )}
                    {/* Category ribbon */}
                    <span className="absolute bottom-3 start-3 bg-[#1a1006]/70 backdrop-blur-sm text-gold-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {isAr ? item.categoryNameAr : item.categoryNameEn}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base md:text-lg font-bold text-ink mb-1 group-hover:text-wine transition-colors line-clamp-1">
                      {isAr ? item.titleAr : item.titleEn}
                    </h3>
                    {item.period && (
                      <p className="text-xs text-ink-3">{item.period}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <p className="text-center text-ink-3 text-lg py-16">
          {isAr ? "لا توجد قطع مطابقة." : "No matching items."}
        </p>
      )}
    </>
  );
}
