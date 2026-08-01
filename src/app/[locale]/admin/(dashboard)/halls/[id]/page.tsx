import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HallForm } from "@/components/admin/HallForm";

export default async function EditHallPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const hall = await prisma.museumHall.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!hall) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "تعديل القاعة" : "Edit Hall"}
      </h1>
      <HallForm
        locale={locale}
        hall={{
          id: hall.id,
          slug: hall.slug,
          titleAr: hall.titleAr,
          titleEn: hall.titleEn,
          descriptionAr: hall.descriptionAr,
          descriptionEn: hall.descriptionEn,
          longDescriptionAr: hall.longDescriptionAr ?? "",
          longDescriptionEn: hall.longDescriptionEn ?? "",
          imagePath: hall.imagePath,
          order: hall.order,
          published: hall.published,
          galleryPaths: hall.images.map((img) => img.path),
        }}
      />
    </div>
  );
}
