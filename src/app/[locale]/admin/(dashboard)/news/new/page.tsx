import { NewsForm } from "@/components/admin/NewsForm";

export default async function NewNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "إضافة خبر / فعالية" : "Add News / Event"}
      </h1>
      <NewsForm locale={locale} />
    </div>
  );
}
