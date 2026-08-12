import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default async function HallsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const t = await getTranslations("Halls");

  const halls = await prisma.museumHall.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { collectionItems: true } } },
  });

  return (
    <div className="min-h-screen pb-28">
      <PageHero
        label={isAr ? "قاعات المتحف" : "Museum Halls"}
        title={t("title")}
        description={t("description")}
      />

      <div className="container max-w-7xl mx-auto px-6 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {halls.map((hall, index) => (
            <FadeIn key={hall.id} delay={index * 0.08}>
              <Link href={`/${locale}/halls/${hall.slug}`} className="block group h-full">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_18px_60px_rgba(20,15,9,0.22)] transition-all duration-500 h-[380px] md:h-[420px] ring-1 ring-transparent hover:ring-gold/40 flex flex-col">
                  <div className="absolute inset-0">
                    <SafeImage
                      src={hall.imagePath || "/images/museum/placeholders/hall-default.jpg"}
                      alt={getLocalized(hall, "title", locale)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1006]/95 via-[#1a1006]/35 to-transparent transition-opacity duration-500" />

                  {/* Item count chip */}
                  {hall._count.collectionItems > 0 && (
                    <div className="absolute top-4 end-4 z-10 bg-black/30 backdrop-blur-md border border-gold/25 rounded-full px-3 py-1 text-[11px] font-bold text-gold-2">
                      {new Intl.NumberFormat(isAr ? "ar-OM" : "en-US").format(hall._count.collectionItems)}
                      {isAr ? " قطعة" : " items"}
                    </div>
                  )}

                  <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                    <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold-2 font-[family-name:var(--font-cormorant)] font-bold text-base mb-3 backdrop-blur-md bg-white/5 group-hover:bg-gold group-hover:text-[#1a1510] group-hover:border-gold transition-colors duration-500">
                      {new Intl.NumberFormat(isAr ? "ar-OM" : "en-US", { minimumIntegerDigits: 2 }).format(index + 1)}
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md group-hover:text-gold-2 transition-colors duration-300">
                      {getLocalized(hall, "title", locale)}
                    </h2>

                    <p className="text-[#F0E8D8]/85 text-sm leading-relaxed line-clamp-2 mb-4">
                      {getLocalized(hall, "description", locale)}
                    </p>

                    <div className="inline-flex items-center gap-2 text-gold-2 font-bold text-sm">
                      <span>{isAr ? "اكتشف القاعة" : "Explore Hall"}</span>
                      {isAr ? (
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
                      ) : (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
