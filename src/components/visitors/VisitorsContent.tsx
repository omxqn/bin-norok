"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { Guestbook } from "@/components/visitors/Guestbook";
import { getLocalized, formatDate } from "@/lib/utils";

interface OfficialVisit {
  [key: string]: any;
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  date: string;
  noteAr: string;
  noteEn: string;
  imagePath: string | null;
}

interface NewsEvent {
  [key: string]: any;
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string | null;
  excerptEn: string | null;
  contentAr: string;
  contentEn: string;
  type: "NEWS" | "EVENT";
  link: string | null;
  createdAt: Date;
  eventDate: Date | null;
}

interface GuestbookEntry {
  [key: string]: any;
  id: string;
  nameAr: string;
  nameEn: string;
  originAr: string | null;
  originEn: string | null;
  messageAr: string;
  messageEn: string;
  createdAt: Date;
}

export function VisitorsContent({
  govVisits,
  newsEvents,
  guestbookEntries,
}: {
  govVisits: OfficialVisit[];
  newsEvents: NewsEvent[];
  guestbookEntries: GuestbookEntry[];
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const content = {
    title: isAr ? "الزوّار والأخبار" : "Visitors & News",
    description: isAr 
      ? "الزيارات الرسمية والتغطيات الإعلامية وشهادات ضيوف متحف بن نوروك." 
      : "Official visits, testimonials, and media coverage of Bin Norok Museum.",
    govTitle: isAr ? "الشخصيات الحكومية والوفود الرسمية" : "Government & Official Delegations",
    newsTitle: isAr ? "أخبار رسمية" : "Official News",
    visitorsTitle: isAr ? "من سجلّ الزوّار" : "From the Visitors' Register",
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHero
        label={locale === "ar" ? "سجل المتحف" : "Museum Register"}
        title={content.title}
        description={content.description}
      />

      <div className="px-6 max-w-7xl mx-auto pt-10">

      {/* Official Visits */}
      <section className="mb-24">
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-primary mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{content.govTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {govVisits.map((visit, idx) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col"
            >
              <div className="w-full h-56 relative overflow-hidden shrink-0 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full opacity-50"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 start-4 end-4">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{getLocalized(visit, "name", locale)}</h3>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col relative bg-white">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors"></div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-primary font-bold">{getLocalized(visit, "title", locale)}</p>
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">{visit.date}</div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{getLocalized(visit, "note", locale)}</p>
              </div>
            </motion.div>
          ))}
          {govVisits.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              {isAr ? "لا توجد زيارات مسجلة بعد" : "No visits recorded yet"}
            </div>
          )}
        </div>
      </section>

      {/* News */}
      <section className="mb-24">
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-[#111] mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{content.newsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {newsEvents.map((news, idx) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${news.type === 'EVENT' ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary'}`}>
                  {news.type === 'EVENT' ? (isAr ? "فعالية" : "Event") : (isAr ? "خبر" : "News")}
                </span>
                <span className="text-gray-500 text-xs font-bold">{formatDate(news.eventDate ?? news.createdAt, locale)}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground leading-snug">
                {getLocalized(news, "title", locale)}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-5 flex-1">
                {getLocalized(news, "excerpt", locale) || getLocalized(news, "content", locale).substring(0, 150) + "..."}
              </p>
              {news.link && (
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="inline-flex text-primary text-sm font-bold hover:underline">
                  {isAr ? "اقرأ المزيد" : "Read more"} &rarr;
                </a>
              )}
            </motion.div>
          ))}
          {newsEvents.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              {isAr ? "لا توجد أخبار بعد" : "No news yet"}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-gold mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{content.visitorsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {guestbookEntries.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#fcfaf7] text-gray-800 rounded-2xl border border-gold/40 p-6 relative hover:-translate-y-1 shadow-sm transition-transform duration-300"
            >
              <div className="text-gold-2 text-4xl font-serif absolute top-3 left-5 opacity-40">"</div>
              <p className="text-sm md:text-base leading-relaxed mb-6 relative z-10 text-gray-700 mt-5 whitespace-pre-line">
                {getLocalized(test, "message", locale)}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-sm text-gold-dark">{getLocalized(test, "name", locale)}</h4>
                {test.originAr && <p className="text-xs text-gray-500">{getLocalized(test, "origin", locale)}</p>}
              </div>
            </motion.div>
          ))}
          {guestbookEntries.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              {isAr ? "سجل الزوار فارغ حالياً" : "The guestbook is currently empty"}
            </div>
          )}
        </div>

        <Guestbook />
      </section>

      </div>
    </div>
  );
}
