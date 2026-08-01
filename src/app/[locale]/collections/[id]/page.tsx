import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { FadeIn } from "@/components/FadeIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const item = await prisma.collectionItem.findUnique({ where: { id } });
  if (!item) return {};
  const title = `${getLocalized(item, "title", locale)} | ${locale === "ar" ? "متحف بن نوروك" : "Bin Norouk Museum"}`;
  const description = getLocalized(item, "description", locale);
  return {
    title,
    description,
    openGraph: { title, description, images: item.imagePath ? [item.imagePath] : [] },
  };
}

export default async function CollectionItemPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const item = await prisma.collectionItem.findUnique({
    where: { id },
    include: { category: true, hall: true },
  });

  if (!item || !item.published) {
    notFound();
  }

  const longDescription = getLocalized(item, "longDescription", locale);
  const historicalNote = getLocalized(item, "historicalNote", locale);

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <Link
        href={`/${locale}/collections`}
        className="text-primary hover:underline mb-8 inline-block font-medium"
      >
        {isAr ? "← العودة إلى المجموعات" : "← Back to Collections"}
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <FadeIn direction="left">
          <ImagePlaceholder
            text={item.titleEn}
            className="w-full aspect-square rounded-3xl shadow-2xl"
          />
        </FadeIn>

        <FadeIn direction="right" delay={0.2}>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            {getLocalized(item.category, "name", locale)}
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
            {getLocalized(item, "title", locale)}
          </h1>
          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {getLocalized(item, "description", locale)}
            </p>
            {longDescription && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-5">
                {longDescription}
              </p>
            )}
            {historicalNote && (
              <blockquote className="mt-6 border-s-4 border-primary ps-4 text-muted-foreground italic">
                {historicalNote}
              </blockquote>
            )}

            <div className="mt-8 pt-8 border-t border-primary/30">
              <div className="grid grid-cols-2 gap-4">
                {item.period && (
                  <div>
                    <h4 className="font-bold text-foreground">
                      {isAr ? "الحقبة" : "Era"}
                    </h4>
                    <p className="text-muted-foreground">{item.period}</p>
                  </div>
                )}
                {item.condition && (
                  <div>
                    <h4 className="font-bold text-foreground">
                      {isAr ? "الحالة" : "Condition"}
                    </h4>
                    <p className="text-muted-foreground">{item.condition}</p>
                  </div>
                )}
                {item.hall && (
                  <div>
                    <h4 className="font-bold text-foreground">
                      {isAr ? "القاعة" : "Hall"}
                    </h4>
                    <Link
                      href={`/${locale}/halls/${item.hall.slug}`}
                      className="text-primary hover:underline"
                    >
                      {getLocalized(item.hall, "title", locale)}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
