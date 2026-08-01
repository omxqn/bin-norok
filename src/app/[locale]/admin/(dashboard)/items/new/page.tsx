import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/admin/ItemForm";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [categories, halls] = await Promise.all([
    prisma.collectionCategory.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.museumHall.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "إضافة مقتنى جديد" : "Add New Item"}
      </h1>
      <ItemForm
        locale={locale}
        categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn }))}
        halls={halls.map((h) => ({ id: h.id, nameAr: h.titleAr, nameEn: h.titleEn }))}
      />
    </div>
  );
}
