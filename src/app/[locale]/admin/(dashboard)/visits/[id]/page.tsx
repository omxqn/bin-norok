import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VisitForm } from "@/components/admin/VisitForm";

export default async function EditVisitPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const visit = await prisma.officialVisit.findUnique({
    where: { id },
  });

  if (!visit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "تعديل الزيارة" : "Edit Visit"}
        </h1>
        <p className="text-gray-500">
          {isAr ? "تحديث بيانات الزيارة الرسمية" : "Update official visit details"}
        </p>
      </div>

      <VisitForm visit={visit} locale={locale} />
    </div>
  );
}
