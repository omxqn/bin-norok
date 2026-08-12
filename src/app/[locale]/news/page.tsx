import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { prisma } from "@/lib/prisma";
import { getLocalized, formatDate } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { FadeIn } from "@/components/FadeIn";
import { PageHero } from "@/components/PageHero";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

function TypeBadge({ type, isAr }: { type: string; isAr: boolean }) {
  const isEvent = type === "EVENT";
  return (
    <span
      className={`text-[11px] font-bold px-3 py-1 rounded-full ${
        isEvent ? "bg-forest text-[#F5ECD8]" : "bg-wine/10 text-wine"
      }`}
    >
      {isEvent ? (isAr ? "فعالية" : "Event") : isAr ? "خبر" : "News"}
    </span>
  );
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("News");
  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const newsEvents = await prisma.newsEvent.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const [featured, ...rest] = newsEvents;

  return (
    <div className="min-h-screen pb-20">
      <PageHero
        label={isAr ? "آخر المستجدات" : "Latest Updates"}
        title={t("title")}
        description={t("description")}
      />

      <div className="px-6 max-w-7xl mx-auto pt-12">
        {newsEvents.length === 0 ? (
          <p className="text-center text-ink-3 text-lg py-16">
            {isAr ? "لا توجد أخبار حالياً." : "No news yet. Check back soon."}
          </p>
        ) : (
          <>
            {/* Featured item — large hero card */}
            <FadeIn>
              <Link href={`/${locale}/news/${featured.slug}`} className="group block mb-12">
                <article className="heritage-card overflow-hidden grid md:grid-cols-2 !p-0">
                  <div className="relative h-56 md:h-auto md:min-h-[320px] overflow-hidden">
                    {featured.imagePath && !featured.imagePath.includes("/placeholders/") ? (
                      <SafeImage
                        src={featured.imagePath}
                        alt={getLocalized(featured, "title", locale)}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlaceholder text={featured.titleEn} className="w-full h-full" />
                    )}
                    <span className="absolute top-4 start-4 text-[11px] font-bold px-3 py-1 rounded-full bg-gold text-[#1a1510]">
                      {isAr ? "مميّز" : "Featured"}
                    </span>
                  </div>
                  <div className="p-7 md:p-9 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <TypeBadge type={featured.type} isAr={isAr} />
                      <span className="text-sm text-gold-dark font-bold flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(featured.eventDate ?? featured.createdAt, locale)}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-wine mb-4 leading-snug group-hover:text-gold-dark transition-colors">
                      {getLocalized(featured, "title", locale)}
                    </h2>
                    <p className="text-sm md:text-base text-ink-2 leading-relaxed line-clamp-3 mb-5">
                      {getLocalized(featured, "excerpt", locale) || getLocalized(featured, "content", locale)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase text-wine">
                      {isAr ? "اقرأ المقال" : "Read article"}
                      <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            </FadeIn>

            {/* Rest of items */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {rest.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.08}>
                    <Link href={`/${locale}/news/${item.slug}`} className="group block h-full">
                      <article className="heritage-card overflow-hidden h-full flex flex-col !p-0">
                        <div className="relative h-48 overflow-hidden">
                          {item.imagePath && !item.imagePath.includes("/placeholders/") ? (
                            <SafeImage
                              src={item.imagePath}
                              alt={getLocalized(item, "title", locale)}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <ImagePlaceholder text={item.titleEn} className="w-full h-full" />
                          )}
                          <span className="absolute top-3 start-3">
                            <TypeBadge type={item.type} isAr={isAr} />
                          </span>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <p className="text-xs text-gold-dark font-bold mb-2 flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDate(item.eventDate ?? item.createdAt, locale)}
                          </p>
                          <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-wine transition-colors">
                            {getLocalized(item, "title", locale)}
                          </h3>
                          <p className="text-sm text-ink-2 leading-relaxed flex-grow line-clamp-3">
                            {getLocalized(item, "excerpt", locale)}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-wine font-bold text-sm">
                            {isAr ? "اقرأ المزيد" : "Read more"}
                            <Arrow className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
