import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";
import { CollectionsGrid } from "@/components/collections/CollectionsGrid";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Collections");

  const [categories, items] = await Promise.all([
    prisma.collectionCategory.findMany({
      orderBy: { nameEn: "asc" },
    }),
    prisma.collectionItem.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Only show categories that actually contain published items
  const usedCategoryIds = new Set(items.map((item) => item.categoryId));
  const visibleCategories = categories.filter((cat) => usedCategoryIds.has(cat.id));

  return (
    <div className="min-h-screen pb-20">
      <PageHero
        label={locale === "ar" ? "كنوز المتحف" : "Museum Treasures"}
        title={t("title")}
        description={t("description")}
      />

      <div className="px-6 max-w-7xl mx-auto pt-10">
      <CollectionsGrid
        locale={locale}
        allLabel={t("filterAll")}
        categories={visibleCategories.map((cat) => ({
          id: cat.id,
          nameAr: cat.nameAr,
          nameEn: cat.nameEn,
        }))}
        items={items.map((item) => ({
          id: item.id,
          titleAr: item.titleAr,
          titleEn: item.titleEn,
          period: item.period,
          imagePath: item.imagePath,
          categoryId: item.categoryId,
          categoryNameAr: item.category.nameAr,
          categoryNameEn: item.category.nameEn,
        }))}
      />
      </div>
    </div>
  );
}
