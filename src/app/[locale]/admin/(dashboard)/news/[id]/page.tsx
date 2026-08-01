import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const article = await prisma.newsEvent.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "تعديل المقال" : "Edit Article"}
      </h1>
      <NewsForm
        locale={locale}
        article={{
          id: article.id,
          slug: article.slug,
          titleAr: article.titleAr,
          titleEn: article.titleEn,
          excerptAr: article.excerptAr ?? "",
          excerptEn: article.excerptEn ?? "",
          contentAr: article.contentAr,
          contentEn: article.contentEn,
          type: article.type,
          imagePath: article.imagePath,
          featured: article.featured,
          published: article.published,
          eventDate: article.eventDate ? article.eventDate.toISOString().split("T")[0] : "",
        }}
      />
    </div>
  );
}
