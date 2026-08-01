"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Landmark,
  Heart,
  User,
  ScrollText,
  Coins,
  Package,
  Crown,
  Award,
  Newspaper,
  Users,
  Quote,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function AboutPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const btnPrimary =
    "inline-flex items-center justify-center gap-2 bg-wine text-white hover:bg-wine/90 transition-all font-bold px-7 py-3 rounded-full text-[12px] tracking-[0.08em] uppercase shadow-md";
  const btnOutline =
    "inline-flex items-center justify-center gap-2 bg-transparent text-wine border border-wine/60 hover:bg-wine/10 transition-all font-bold px-7 py-3 rounded-full text-[12px] tracking-[0.08em] uppercase";

  const founders = [
    {
      icon: Landmark,
      name: isAr ? "أحمد نوروك البلوشي" : "Ahmad Norok Al-Balushi",
      role: isAr
        ? "رحمه الله · أمين جمركي · مجمِّع · رب العائلة"
        : "May God rest his soul · Customs Officer · Collector · Patriarch",
      bio: isAr
        ? "رجل من أهل الواجب والوقار الهادئ، خدم وطنه ببسالة وبنى علاقات مع شخصيات مؤثرة، وكرّس حياته لعائلته. روحه الحافظة وفخره بأصوله هي الأساس الذي يقوم عليه هذا المتحف."
        : "A man of duty and quiet dignity who served his nation, built relationships with figures of influence, and devoted his life to his family. His spirit of preservation and pride in heritage is the foundation upon which this museum stands.",
    },
    {
      icon: Heart,
      name: isAr ? "عزة مبارك" : "Azza Mubarak",
      role: isAr
        ? "رحمها الله · زوجة · أم · قلب البيت"
        : "May God rest her soul · Wife · Mother · The Heart of the Home",
      bio: isAr
        ? "الزوجة الوفية لأحمد نوروك وروح البيت العائلي. تُكرَّم ذكراها ضمن رسالة المتحف في الاحتفاء بالمرأة العمانية عبر الأجيال — قوتها الصامتة وحياتها اليومية ومكانتها الدائمة في تاريخ الوطن."
        : "The devoted wife of Ahmad Norok and the soul of the family home. Her memory is honoured as part of the museum's mission to celebrate the Omani woman across generations — her quiet strength, her daily life, and her enduring place in the nation's story.",
    },
    {
      icon: User,
      name: isAr ? "م/ عبدالنبي أحمد نوروك البلوشي" : "Eng. Abdulnabi Ahmed Norok Al-Balushi",
      role: isAr ? "الابن · القيّم على المتحف · مسؤول التواصل" : "Son · Curator · Contact Person",
      bio: isAr
        ? "الابن الذي يواصل حمل الإرث — يحوّل ذاكرة حياة كاملة إلى متحف يستقبل الضيوف والباحثين والوفود الرسمية من أرجاء عُمان وما وراءها."
        : "The son who carries the legacy forward — transforming a lifetime of family memory into a museum that welcomes guests, scholars, and official delegations from across Oman and beyond.",
    },
  ];

  const preserveCards = [
    {
      icon: ScrollText,
      label: isAr ? "الوثائق التاريخية" : "Historical Documents",
      text: isAr
        ? "مراسلات ووثائق رسمية نادرة من ستينيات القرن الماضي حتى ثمانينياته."
        : "Rare correspondences and official documents from the 1960s–1980s.",
    },
    {
      icon: Coins,
      label: isAr ? "الطوابع والعملات" : "Stamps & Coins",
      text: isAr
        ? "أرشيف عالمي من الفيلاتيليا والنميات من عُمان والعالم."
        : "A global philatelic and numismatic archive from Oman and around the world.",
    },
    {
      icon: Package,
      label: isAr ? "المقتنيات العائلية" : "Family Heirlooms",
      text: isAr
        ? "مقتنيات وأدوات الحياة اليومية المحفوظة عبر الأجيال."
        : "Personal heirlooms and everyday artifacts spanning generations.",
    },
    {
      icon: Landmark,
      label: isAr ? "القطع الثقافية" : "Cultural Objects",
      text: isAr
        ? "قطع تمثل التراث العماني والبلوشي الأصيل."
        : "Objects representing authentic Omani and Baluchi tradition.",
    },
    {
      icon: Crown,
      label: isAr ? "تذكارات ملكية وسلطانية" : "Royal Memorabilia",
      text: isAr
        ? "تذكارات ملكية وسلطانية تعكس التراث الوطني."
        : "Royal and Sultanate memorabilia reflecting national heritage.",
    },
  ];

  const recognition = [
    {
      icon: Users,
      stat: "3",
      desc: isAr
        ? "وفود حكومية رسمية — من بينها والي محافظة شمال الباطنة ووالي صحار"
        : "Official government delegations — including the Governor of North Al Batinah and the Wali of Sohar",
    },
    {
      icon: Newspaper,
      stat: "+2",
      desc: isAr
        ? "تناولته وسائل الإعلام الوطنية كيومية عُمان ومجلة ظفار الثقافية"
        : "Featured in national media including Oman Daily and Dhofar Cultural Magazine",
    },
    {
      icon: Award,
      stat: "∞",
      desc: isAr
        ? "زوار من أنحاء عُمان والخليج، كل منهم يغادر بقطعة من تراث حيّ"
        : "Visitors from across Oman and the Gulf, each leaving with a piece of living heritage",
    },
  ];

  const timeline = [
    {
      year: isAr ? "الجذور" : "Roots",
      title: isAr ? "التراث البلوشي والعماني" : "The Baluchi–Omani Heritage",
      text: isAr
        ? "تُرسّخ عائلة أحمد نوروك البلوشي تقليداً حياً في الحفاظ على الذاكرة، وتُكرّم جذورها البلوشية والعمانية عبر الأجيال."
        : "The Ahmed Norok Al-Balushi family cultivates a living tradition of memory, honouring their Baluchi and Omani roots across generations.",
    },
    {
      year: "1960s – 1980s",
      title: isAr ? "حياة من الخدمة والتواصل" : "A Life of Service & Connection",
      text: isAr
        ? "يعمل أحمد نوروك أميناً جمركياً، بانياً علاقات مع شخصيات مؤثرة في عُمان. تتراكم مراسلاته وأرشيفه الشخصي — سجلات صادقة لحياة عاشها بشرف."
        : "Ahmad Norok serves Oman with dedication, building relationships with figures of influence. His correspondences and personal archive begin to form — honest records of a life honourably lived.",
    },
    {
      year: isAr ? "عقود من الجمع" : "Decades of Collecting",
      title: isAr ? "طوابع وعملات ووثائق" : "Stamps, Coins & Documents",
      text: isAr
        ? "عبر عقود، يتشكّل داخل البيت العائلي أرشيف متميز يمتد من ربوع عُمان إلى العالم، من الإصدارات التذكارية إلى القطع النقدية النادرة."
        : "A distinguished archive is assembled within the family home — spanning Oman and the world, from commemorative postal issues to rare numismatic pieces.",
    },
    {
      year: "2020s",
      title: isAr ? "افتتاح متحف بن نوروك" : "Bin Norok Museum Opens",
      text: isAr
        ? "تتحوّل مجموعة العائلة إلى متحف خاص بأقسام مُنتقاة، يستقبل الوفود الرسمية والباحثين والزوار من مختلف أنحاء عُمان وما وراءها."
        : "The family's collection becomes a private museum — curated rooms receiving official delegations, scholars, and visitors from across Oman and beyond.",
    },
    {
      year: isAr ? "اليوم وما بعده" : "Today & Beyond",
      title: isAr ? "استمرار الإرث" : "Continuing the Legacy",
      text: isAr
        ? "يواصل متحف بن نوروك نموه — مرحّباً بضيوفه بموعد مسبق، وموسّعاً عنايته الأرشيفية، وضامناً أن تبقى ذاكرة عائلة نوروك البلوشي حاضرة للأجيال القادمة."
        : "Bin Norok Museum continues to grow — welcoming guests by appointment, expanding its archival care, and ensuring that the memory of the Norok Al-Balushi family endures for generations to come.",
      active: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        label={isAr ? "قصتنا" : "Our Story"}
        title={isAr ? "عن المتحف" : "About the Museum"}
        description={
          isAr
            ? "مؤسسة عائلية خاصة تحفظ التراث العماني والبلوشي عبر الأجيال."
            : "A private family institution preserving Omani and Baluchi heritage across generations."
        }
      />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-24 relative z-20">
        {/* ── Identity: full-width banner + boxed content ── */}
        <div className="mb-20 md:mb-24">
          {/* Banner image on top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[442/286] w-full max-w-3xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl mb-8"
          >
            <Image
              src="/images/museum/halls/NOROK.jpeg"
              alt={isAr ? "متحف بن نوروك" : "Bin Norok Museum"}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute bottom-4 start-6 flex items-center gap-2 text-[#F5ECD8] text-sm font-bold bg-[#1a1006]/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span>{isAr ? "متحف خاص" : "Private Museum"}</span>
              <span className="text-gold-2">·</span>
              <span>{isAr ? "سلطنة عُمان" : "Sultanate of Oman"}</span>
            </div>
          </motion.div>

          {/* Text box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="heritage-card p-8 md:p-10 text-center mb-6"
          >
            <span className="section-label mb-2">{isAr ? "من نحن" : "Who We Are"}</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-wine mb-5 leading-tight">
              {isAr ? "أرشيف حيّ لذاكرة العائلة" : "A Living Archive of Family Memory"}
            </h2>
            <p className="text-lg text-ink-2 leading-relaxed mb-4 max-w-3xl mx-auto">
              {isAr
                ? "متحف بن نوروك مؤسسة خاصة متميزة، يُشرف عليها بإخلاص أبناء عائلة أحمد نوروك البلوشي في سلطنة عُمان. ليس مجرد مجموعة مقتنيات — بل شهادة حية لعائلة آمنت بأن الحفاظ على الذاكرة فعل محبة."
                : "Bin Norok Museum is a distinguished private institution, curated by the Ahmed Norok Al-Balushi family in the Sultanate of Oman. It is not merely a collection — it is a living testament to a family that believed preservation is an act of love."}
            </p>
            <p className="text-lg text-ink-2 leading-relaxed max-w-3xl mx-auto">
              {isAr
                ? "في أقسامه المُنتقاة يلتقي الزائر بوثائق تاريخية ومقتنيات شخصية وقطع ثقافية تربط قصة عائلة واحدة بالمسار الأشمل للتراث العماني والبلوشي."
                : "Within its curated rooms, visitors encounter historical documents, personal heirlooms, and cultural artifacts that connect one family's story to the broader arc of Omani and Baluchi heritage."}
            </p>
          </motion.div>

          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { num: "6", label: isAr ? "أقسام مُنتقاة" : "Curated Sections" },
              { num: "+60", label: isAr ? "عاماً من التاريخ" : "Years of History" },
              { num: "∞", label: isAr ? "قصص محفوظة" : "Stories Preserved" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="heritage-card py-6 px-4 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-dark mb-1">{s.num}</div>
                <div className="text-sm font-bold text-ink-3">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── The Founders ── (tinted panel for rhythm) */}
        <div className="mb-20 md:mb-24 -mx-6 px-6 py-16 md:py-20 bg-white/55 border-y border-gold/15 rounded-[2rem]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label mb-2">{isAr ? "الأشخاص وراء المتحف" : "The People Behind the Museum"}</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-wine mb-4">
              {isAr ? "تأسّس في الذاكرة، وبُني بالمحبة" : "Founded in Memory, Built with Love"}
            </h2>
            <p className="text-base text-ink-2 leading-relaxed">
              {isAr
                ? "متحف بن نوروك موجود لأن شخصين كانت حياتهما تستحق التذكر — وعائلة رفضت أن تتلاشى تلك الحياة."
                : "Bin Norok Museum exists because of two people whose lives were worth remembering — and one family that refused to let those lives fade."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {founders.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="heritage-card p-7 text-center h-full flex flex-col"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-wine/8 flex items-center justify-center mb-5">
                  <f.icon className="w-7 h-7 text-wine" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-1">{f.name}</h3>
                <p className="text-[11px] font-bold text-gold-dark mb-4 tracking-wide">{f.role}</p>
                <p className="text-base text-ink-2 leading-relaxed flex-grow">{f.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── What We Preserve ── (stacked: intro on top, cards row below) */}
        <div className="mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="section-label mb-2">{isAr ? "المجموعة" : "The Collection"}</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-wine mb-5">
              {isAr ? "ما نحفظه" : "What We Preserve"}
            </h2>
            <p className="text-lg text-ink-2 leading-relaxed mb-7">
              {isAr
                ? "تضم أقسام المتحف مجموعة متنوعة ومنتقاة بعناية تمتد عبر فئات متعددة من التراث — كل قطعة اختيرت لقيمتها الثقافية أو التاريخية أو الشخصية."
                : "The museum's rooms hold a diverse and carefully curated collection spanning multiple categories of heritage — each piece chosen for its cultural, historical, or personal significance."}
            </p>
            <Link href={`/${locale}/collections`} className={btnPrimary}>
              {isAr ? "استكشف المجموعة" : "Explore the Collection"}
              <Arrow className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Unified collection cards (merged) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preserveCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="heritage-card p-7 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/12 flex items-center justify-center mb-5">
                  <c.icon className="w-7 h-7 text-gold-dark" />
                </div>
                <h3 className="text-lg font-bold text-wine mb-1.5">{c.label}</h3>
                <p className="text-base text-ink-2 leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Recognition ── (tinted panel for rhythm) */}
        <div className="mb-20 md:mb-24 -mx-6 px-6 py-16 md:py-20 bg-white/55 border-y border-gold/15 rounded-[2rem]">
          <div className="text-center mb-12">
            <span className="section-label mb-2">{isAr ? "التقدير" : "Recognition"}</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-wine">
              {isAr ? "كرّمته عُمان" : "Honoured by Oman"}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7 mb-8">
            {recognition.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="heritage-card p-8 text-center"
              >
                <r.icon className="w-8 h-8 text-gold-dark mx-auto mb-4" />
                <p className="text-4xl font-bold text-wine mb-3">{r.stat}</p>
                <p className="text-base text-ink-2 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link href={`/${locale}/news`} className={btnOutline}>
              {isAr ? "الزوار والأخبار" : "Visitors & News"}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="mb-20 md:mb-24">
          <div className="text-center mb-14">
            <span className="section-label mb-2">{isAr ? "التاريخ" : "History"}</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-wine">
              {isAr ? "قصة المتحف" : "The Story of the Museum"}
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* vertical line */}
            <div className="absolute top-2 bottom-2 start-[7px] w-px bg-gold/30" aria-hidden />
            <div className="space-y-8">
              {timeline.map((tl, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isAr ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative ps-10"
                >
                  <span
                    className={`absolute top-1.5 start-0 w-4 h-4 rounded-full border-2 ${
                      tl.active ? "bg-gold border-gold" : "bg-cream border-gold/50"
                    }`}
                  />
                  <div className={`heritage-card p-6 ${tl.active ? "ring-1 ring-gold/40" : ""}`}>
                    <span className="text-xs font-bold text-gold-dark tracking-wide uppercase">{tl.year}</span>
                    <h3 className="text-xl font-bold text-ink mt-1 mb-2">{tl.title}</h3>
                    <p className="text-base text-ink-2 leading-relaxed">{tl.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Closing quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="heritage-card p-10 md:p-14 text-center relative overflow-hidden"
        >
          <Quote className="w-10 h-10 text-gold/40 mx-auto mb-5" />
          <blockquote className="text-xl md:text-3xl font-semibold text-wine leading-snug mb-5 max-w-3xl mx-auto">
            {isAr
              ? "«أن تحفظ هو أن تتذكر. وأن تتذكر هو أن تُكرّم.»"
              : "“To preserve is to remember. To remember is to honour.”"}
          </blockquote>
          <p className="text-lg text-ink-2 max-w-2xl mx-auto mb-8">
            {isAr
              ? "متحف بن نوروك فعل محبة خاصة — التزام عائلة واحدة بأن لا يُنسى التراث العماني والبلوشي أبداً."
              : "Bin Norok Museum stands as a private act of love — one family's commitment to ensuring that Omani and Baluchi heritage is never forgotten."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/halls`} className={btnPrimary}>
              {isAr ? "استكشف المتحف" : "Explore the Museum"}
            </Link>
            <Link href={`/${locale}/visit`} className={btnOutline}>
              {isAr ? "خطّط لزيارتك" : "Plan Your Visit"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
