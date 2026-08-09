"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { Guestbook } from "@/components/visitors/Guestbook";

const visitorsContent = {
  en: {
    title: "Visitors & News",
    description: "Official visits, testimonials, and media coverage of Bin Norok Museum.",
    govTitle: "Government & Official Delegations",
    newsTitle: "Official News",
    visitorsTitle: "From the Visitors' Register",
    govVisits: [
      {
        name: "H.E. the Governor of North Al Batinah",
        title: "Governor of North Al Batinah Governorate",
        date: "2023",
        note: "An official visit to the museum, during which the Governor expressed his appreciation for the cultural and heritage value of the collection and its role in preserving Omani memory.",
        image: "/images/museum/halls/sultan room1.jpeg"
      },
      {
        name: "Sheikh Wali of Sohar",
        title: "Wali of Sohar",
        date: "2023",
        note: "A courtesy visit accompanied by a delegation of officials, commending the exceptional effort in preserving Omani heritage within a distinguished private setting.",
        image: "/images/museum/halls/Ahmed norok 1.jpeg"
      },
      {
        name: "Military Delegation",
        title: "Royal Army of Oman",
        date: "2024",
        note: "A delegation of senior officers visited the Ahmad Norok Room and the Documents Section, showing particular interest in the historical correspondences.",
        image: "/images/museum/halls/Living room.jpeg"
      }
    ],
    news: [
      {
        headline: "Bin Norok Museum: A Private Heritage Institution Preserving Omani Memory",
        source: "Oman Daily",
        date: "2024",
        body: "A feature on the museum's unique collections and its role in preserving stamps, coins, documents, and family heirlooms that tell the story of Oman across generations.",
        link: "https://www.omandaily.om"
      },
      {
        headline: "Bin Norok Museum Officially Recognized by Ministry of Heritage",
        source: "Ministry of Heritage and Tourism",
        date: "2021",
        body: "The museum was officially opened and licensed as a private heritage house, documenting the biography of its founder and preserving national heritage.",
        link: "https://mht.gov.om"
      }
    ],
    testimonials: [
      {
        quote: "A truly unique experience — the museum breathes history and family pride in every corner. The collections are extraordinary and the warm welcome made our visit unforgettable.",
        author: "Mohammed Al-Rashidi",
        origin: "Kuwait"
      },
      {
        quote: "Walking through Bin Norok Museum felt like stepping into a living chapter of Omani history. The dedication to preserving this heritage is deeply inspiring.",
        author: "Dr. Sara Al-Balushi",
        origin: "Muscat, Oman"
      },
      {
        quote: "An intimate and beautifully curated museum. Each room tells a story that connects the past to the present. A must-visit for anyone who values culture and memory.",
        author: "Ahmed Al-Farsi",
        origin: "Dubai, UAE"
      }
    ]
  },
  ar: {
    title: "الزوّار والأخبار",
    description: "الزيارات الرسمية والتغطيات الإعلامية وشهادات ضيوف متحف بن نوروك.",
    govTitle: "الشخصيات الحكومية والوفود الرسمية",
    newsTitle: "أخبار رسمية",
    visitorsTitle: "من سجلّ الزوّار",
    govVisits: [
      {
        name: "سعادة محافظ شمال الباطنة",
        title: "محافظ شمال الباطنة",
        date: "2023",
        note: "زيارة رسمية للمتحف أبدى خلالها سعادته تقديره العالي للقيمة الثقافية والتراثية للمجموعة ودورها في حفظ الذاكرة العمانية.",
        image: "/images/museum/halls/sultan room1.jpeg"
      },
      {
        name: "الشيخ والي صحار",
        title: "والي صحار",
        date: "2023",
        note: "زيارة مجاملة برفقة وفد من المسؤولين، أثنى خلالها على الجهود الاستثنائية في الحفاظ على التراث العماني في إطار خاص متميز.",
        image: "/images/museum/halls/Ahmed norok 1.jpeg"
      },
      {
        name: "وفد عسكري",
        title: "الجيش السلطاني العماني",
        date: "2024",
        note: "زيارة وفد من كبار الضباط، أبدوا اهتمامًا خاصًا بغرفة أحمد نوروك وقسم الوثائق والمراسلات التاريخية.",
        image: "/images/museum/halls/Living room.jpeg"
      }
    ],
    news: [
      {
        headline: "متحف بن نوروك: مؤسسة تراثية خاصة تحفظ الذاكرة العمانية",
        source: "جريدة عُمان",
        date: "2024",
        body: "تقرير مميز عن مجموعات المتحف الفريدة ودوره في الحفاظ على الطوابع والعملات والوثائق والمقتنيات التي تروي قصة عُمان عبر الأجيال.",
        link: "https://www.omandaily.om"
      },
      {
        headline: "افتتاح متحف بن نوروك بصحار رسمياً",
        source: "وزارة التراث والسياحة",
        date: "2021",
        body: "تم افتتاح المتحف رسمياً وترخيصه كبيت تراثي خاص، حيث يعرض سيرة مؤسسه ويضم مقتنيات وطنية وعائلية نادرة.",
        link: "https://mht.gov.om"
      }
    ],
    testimonials: [
      {
        quote: "تجربة فريدة حقاً — يتنفس المتحف التاريخ والفخر العائلي في كل زاوية. المجموعات استثنائية والترحيب الحار جعل زيارتنا لا تُنسى.",
        author: "محمد الرشيدي",
        origin: "الكويت"
      },
      {
        quote: "التجول في متحف بن نوروك كان كالخوض في فصل حي من تاريخ عُمان. التفاني في حفظ هذا التراث ملهم بعمق.",
        author: "د. سارة البلوشية",
        origin: "مسقط، عُمان"
      },
      {
        quote: "متحف حميمي ومُنتقى بجمال. كل غرفة تروي قصة تربط الماضي بالحاضر. لا يُفوَّت لكل من يُقدّر الثقافة والذاكرة.",
        author: "أحمد الفارسي",
        origin: "دبي، الإمارات"
      }
    ]
  }
};

export default function VisitorsPage() {
  const locale = useLocale();
  const content = locale === "ar" ? visitorsContent.ar : visitorsContent.en;

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
          {content.govVisits.map((visit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col"
            >
                <div className="w-full h-56 relative overflow-hidden shrink-0 bg-gray-300">
                  <div className="w-full h-full bg-gray-400/50 group-hover:bg-gray-400/80 transition-colors duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 start-4 end-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{visit.name}</h3>
                  </div>
                </div>
              <div className="p-6 flex-1 flex flex-col relative bg-white">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors"></div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-primary font-bold">{visit.title}</p>
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">{visit.date}</div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{visit.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="mb-24">
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-[#111] mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{content.newsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {content.news.map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {news.source}
                </span>
                <span className="text-gray-500 text-xs font-bold">{news.date}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground leading-snug">
                {news.headline}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">{news.body}</p>
              {news.link && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <a 
                    href={news.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
                  >
                    {locale === "ar" ? "تصفح الخبر" : "Read More"}
                    <span className="rtl:-scale-x-100">&#8594;</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-gold mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{content.visitorsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {content.testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-heritage-dark text-white rounded-2xl border border-gold/20 p-6 relative hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-gold-2 text-4xl font-serif absolute top-3 left-5 opacity-30">"</div>
              <p className="text-sm md:text-base leading-relaxed mb-6 relative z-10 text-gray-300 mt-5">
                {test.quote}
              </p>
              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-sm text-gold-2">{test.author}</h4>
                <p className="text-xs text-gray-500">{test.origin}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Guestbook />
      </section>

      </div>
    </div>
  );
}
