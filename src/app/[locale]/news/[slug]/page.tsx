import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocalized, formatDate } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { FadeIn } from "@/components/FadeIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await prisma.newsEvent.findUnique({ where: { slug } });
  if (!article) return {};
  const title = `${getLocalized(article, "title", locale)} | ${locale === "ar" ? "متحف بن نوروك" : "Bin Norouk Museum"}`;
  const description =
    getLocalized(article, "excerpt", locale) ||
    getLocalized(article, "content", locale).slice(0, 160);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: article.imagePath ? [article.imagePath] : [],
    },
  };
}

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";

  const article = await prisma.newsEvent.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <FadeIn>
        <Link
          href={`/${locale}/news`}
          className="text-primary hover:underline mb-8 inline-block font-medium"
        >
          {isAr ? "← العودة إلى الأخبار" : "← Back to News"}
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              article.type === "EVENT"
                ? "bg-primary/10 text-primary"
                : "bg-primary/10 text-primary"
            }`}
          >
            {article.type === "EVENT" ? (isAr ? "فعالية" : "Event") : isAr ? "خبر" : "News"}
          </span>
          <p className="text-primary font-bold">
            {formatDate(article.eventDate ?? article.createdAt, locale)}
          </p>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
          {getLocalized(article, "title", locale)}
        </h1>
        <ImagePlaceholder
          text={article.titleEn}
          className="w-full h-56 md:h-[360px] rounded-2xl shadow-lg mb-10"
        />
        <div className="prose max-w-none">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {getLocalized(article, "content", locale)}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
