import { VisitForm } from "@/components/admin/VisitForm";

export default async function NewVisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "إضافة زيارة رسمية" : "Add Official Visit"}
        </h1>
        <p className="text-gray-500">
          {isAr ? "أضف زيارة جديدة إلى سجل الزيارات" : "Add a new visit to the register"}
        </p>
      </div>

      <VisitForm locale={locale} />
    </div>
  );
}
