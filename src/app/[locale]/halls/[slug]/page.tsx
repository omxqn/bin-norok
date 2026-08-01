import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";
import { HallImageSlider } from "@/components/halls/HallImageSlider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const hall = await prisma.museumHall.findUnique({ where: { slug } });
  if (!hall) return {};
  const title = `${getLocalized(hall, "title", locale)} | ${locale === "ar" ? "متحف بن نوروك" : "Bin Norouk Museum"}`;
  const description = getLocalized(hall, "description", locale);
  const image = hall.imagePath;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : [] },
  };
}

export default async function HallDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("Halls");

  const hall = await prisma.museumHall.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      collectionItems: {
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!hall || !hall.published) {
    notFound();
  }

  const longDescription = getLocalized(hall, "longDescription", locale);

  // Prefer the curated gallery; fall back to main image + item photos
  const allImages =
    hall.images.length > 0
      ? hall.images.map((img) => img.path)
      : (Array.from(
          new Set([hall.imagePath, ...hall.collectionItems.map((item) => item.imagePath)])
        ).filter(Boolean) as string[]);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <FadeIn className="mb-16">
        {/* Back Link - aligned to start */}
        <div className="flex justify-start mb-8">
          <Link
            href={`/${locale}/halls`}
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold text-sm px-4 py-2.5 bg-primary/10 hover:bg-primary rounded-lg border border-primary/20"
          >
            {locale === "ar" ? (
              <>العودة إلى القاعات <span>&rarr;</span></>
            ) : (
              <><span>&larr;</span> Back to Halls</>
            )}
          </Link>
        </div>
        
        <div className="text-center">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-10">
            <HallImageSlider
              images={allImages.length > 0 ? allImages : []}
              fallbackText={getLocalized(hall, "title", locale)}
              className="h-72 md:h-[480px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-white pointer-events-none z-30">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                {getLocalized(hall, "title", locale)}
              </h1>
            </div>
          </div>

        <div className="prose max-w-3xl mx-auto text-center rtl:text-right ltr:text-left">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium">
            {getLocalized(hall, "description", locale)}
          </p>
          {longDescription && (
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-5 font-medium">
              {longDescription}
            </p>
          )}
        </div>
        </div>
      </FadeIn>

    </div>
  );
}
