import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocalized, formatDate } from "@/lib/utils";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { DeleteNewsButton } from "@/components/admin/DeleteButtons";

export default async function AdminNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const newsEvents = await prisma.newsEvent.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {isAr ? "الأخبار والفعاليات" : "News & Events"}
          </h1>
          <p className="text-gray-500">
            {isAr ? `${newsEvents.length} مقال` : `${newsEvents.length} articles`}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/news/new`}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm self-start"
        >
          <Plus size={16} /> {isAr ? "إضافة خبر / فعالية" : "Add News / Event"}
        </Link>
      </div>

      <div className="heritage-card divide-y divide-gray-100">
        {newsEvents.map((article) => (
          <div key={article.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    article.type === "EVENT"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {article.type === "EVENT" ? (isAr ? "فعالية" : "Event") : isAr ? "خبر" : "News"}
                </span>
                <p className="font-bold text-foreground">{getLocalized(article, "title", locale)}</p>
              </div>
              <p className="text-sm text-gray-500 truncate max-w-lg mt-1">
                {getLocalized(article, "excerpt", locale)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(article.eventDate ?? article.createdAt, locale)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0" dir="ltr">
              <PublishToggle entity="news" id={article.id} published={article.published} />
              <Link
                href={`/${locale}/admin/news/${article.id}`}
                className="text-slate-400 hover:text-blue-500 transition-colors"
                title={isAr ? "تعديل" : "Edit"}
              >
                <Pencil size={16} />
              </Link>
              <DeleteNewsButton id={article.id} />
            </div>
          </div>
        ))}
        {newsEvents.length === 0 && (
          <p className="px-5 py-16 text-center text-gray-400">
            {isAr ? "لا توجد أخبار بعد" : "No news yet"}
          </p>
        )}
      </div>
    </div>
  );
}
