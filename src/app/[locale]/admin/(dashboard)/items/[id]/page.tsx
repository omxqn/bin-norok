import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/admin/ItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const [item, categories, halls] = await Promise.all([
    prisma.collectionItem.findUnique({ where: { id } }),
    prisma.collectionCategory.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.museumHall.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "تعديل المقتنى" : "Edit Item"}
      </h1>
      <ItemForm
        locale={locale}
        categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn }))}
        halls={halls.map((h) => ({ id: h.id, nameAr: h.titleAr, nameEn: h.titleEn }))}
        item={{
          id: item.id,
          titleAr: item.titleAr,
          titleEn: item.titleEn,
          descriptionAr: item.descriptionAr,
          descriptionEn: item.descriptionEn,
          longDescriptionAr: item.longDescriptionAr ?? "",
          longDescriptionEn: item.longDescriptionEn ?? "",
          categoryId: item.categoryId,
          hallId: item.hallId,
          period: item.period ?? "",
          condition: item.condition ?? "",
          historicalNoteAr: item.historicalNoteAr ?? "",
          historicalNoteEn: item.historicalNoteEn ?? "",
          imagePath: item.imagePath,
          featured: item.featured,
          published: item.published,
        }}
      />
    </div>
  );
}
