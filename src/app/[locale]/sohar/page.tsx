"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function SoharPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const itinerary = [
    {
      time: isAr ? "٠٩:٠٠ صباحاً" : "09:00 AM",
      title: isAr ? "قلعة صحار التاريخية" : "Sohar Historical Fort",
      description: isAr
        ? "ابدأ يومك بزيارة قلعة صحار، الشامخة منذ القرن الثالث عشر. اكتشف الممرات السرية وتعرّف على تاريخ العاصمة القديمة لعُمان."
        : "Start your day visiting Sohar Fort, standing tall since the 13th century. Explore secret passages and learn about Oman's ancient capital.",
    },
    {
      time: isAr ? "١١:٣٠ صباحاً" : "11:30 AM",
      title: isAr ? "كورنيش صحار" : "Sohar Corniche",
      description: isAr
        ? "استمتع بنسيم البحر والمشي على طول كورنيش صحار الجميل. يمكنك التوقف لتناول وجبة بحرية طازجة في أحد المطاعم المطلة على البحر."
        : "Enjoy the sea breeze walking along the beautiful Sohar Corniche. Stop for a fresh seafood meal at one of the seaside restaurants.",
    },
    {
      time: isAr ? "٠٢:٠٠ ظهراً" : "02:00 PM",
      title: isAr ? "سوق الأسماك وسوق صحار التقليدي" : "Fish Market & Traditional Souq",
      description: isAr
        ? "جولة لاكتشاف الحياة اليومية والتبادل التجاري النشط. يعتبر سوق صحار تحفة معمارية حديثة مستوحاة من التراث."
        : "A tour to discover daily life and active trade. Sohar Souq is a modern architectural masterpiece inspired by heritage.",
    },
    {
      time: isAr ? "٠٤:٣٠ عصراً" : "04:30 PM",
      title: isAr ? "متحف بن نوروك" : "Bin Norouk Museum",
      description: isAr
        ? "ختام الرحلة بزيارة متحفنا. استمتع باحتساء القهوة العمانية وتأمل المقتنيات التاريخية التي تربط ماضي صحار العريق بحاضرها المشرق."
        : "Conclude your trip at our museum. Enjoy Omani coffee and admire historical collections that connect Sohar's ancient past with its bright present.",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        label={isAr ? "المدينة العريقة" : "The Ancient City"}
        title={isAr ? "صحار: العاصمة العريقة" : "Sohar: The Ancient Capital"}
        description={
          isAr
            ? "مدينة الأساطير والتاريخ التجاري العظيم، من هنا بدأت حكايات السندباد ورحلات طريق الحرير."
            : "The city of legends and great commercial history — from here began the tales of Sindbad and the Silk Road journeys."
        }
      />

      <div className="max-w-7xl mx-auto px-6 pt-14">

        {/* History intro */}
        <div className="heritage-card p-8 md:p-12 mb-16 text-center max-w-4xl mx-auto">
          <span className="section-label mb-3">
            {isAr ? "عُمانا القديمة" : "Ancient Omana"}
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-wine mb-5">
            {isAr ? "تاريخ يمتد لآلاف السنين" : "A History Spanning Millennia"}
          </h2>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-sm md:text-base text-ink-2 leading-loose mb-8">
            {isAr
              ? "عُرفت صحار تاريخياً باسم 'عُمانا'، وكانت العاصمة القديمة لعُمان وواحدة من أهم المدن في العالم الإسلامي. موقعها الاستراتيجي جعلها مركزاً حيوياً للتجارة البحرية، حيث ربطت شبه الجزيرة العربية بالهند والصين وشرق أفريقيا."
              : "Historically known as 'Omana', Sohar was the ancient capital of Oman and one of the most important cities in the Islamic world. Its strategic location made it a bustling centre for maritime trade, connecting the Arabian Peninsula with India, China, and East Africa."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["3rd Mill. BC", "10th Century", "13th Century"].map((era) => (
              <span key={era} className="px-4 py-2 bg-gold/15 text-gold-dark rounded-full font-bold text-xs">
                {era}
              </span>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="mb-10 text-center">
          <span className="section-label mb-3">{isAr ? "يوم في صحار" : "A Day in Sohar"}</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-ink mb-3">
            {isAr ? "مسار مقترح لرحلتك في صحار" : "Proposed Itinerary in Sohar"}
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="text-sm md:text-base text-ink-3 max-w-2xl mx-auto">
            {isAr
              ? "استكشف جمال صحار عبر هذا الجدول المرتب لقضاء يوم كامل مليء بعبق التاريخ والثقافة."
              : "Explore the beauty of Sohar through this organised schedule for a full day of history and culture."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itinerary.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="heritage-card group flex flex-col p-7 relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 rtl:-left-4 rtl:right-auto text-8xl font-serif font-bold text-gold/10 select-none z-0">
                {index + 1}
              </div>
              <div className="relative z-10">
                <div className="bg-gold/15 text-gold-dark w-fit px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 text-xs mb-5">
                  <Clock className="w-3.5 h-3.5" />
                  <span dir="ltr">{step.time}</span>
                </div>
                <h3 className="text-lg font-bold text-wine mb-3 leading-tight">{step.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
