import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocalized, formatDateTime } from "@/lib/utils";
import { DeleteVisitButton } from "@/components/admin/DeleteButtons";
import { DeleteNewsButton } from "@/components/admin/DeleteButtons";
import { GuestbookActions } from "@/components/admin/GuestbookModeration";

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [visits, newsEvents, guestbookEntries] = await Promise.all([
    prisma.officialVisit.findMany({ orderBy: { order: "asc" } }),
    prisma.newsEvent.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.guestbookEntry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const pendingGuestbook = guestbookEntries.filter((e) => !e.approved).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "إدارة المحتوى" : "Content Management"}
        </h1>
        <p className="text-gray-500">
          {isAr
            ? "إدارة الزيارات الرسمية، الأخبار والفعاليات، وآراء الزوار من مكان واحد"
            : "Manage official visits, news, events, and visitor opinions from one place"}
        </p>
      </div>

      {/* --- Official Visits Section --- */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {isAr ? "الزيارات الرسمية" : "Official Visits"}
          </h2>
          <Link
            href={`/${locale}/admin/visits/new`}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} /> {isAr ? "إضافة زيارة" : "Add Visit"}
          </Link>
        </div>

        <div className="heritage-card divide-y divide-gray-100">
          {visits.map((visit) => (
            <div key={visit.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-4">
                {/* The form has always uploaded an image for a visit; this list
                    used to render a fixed "No image" box regardless, which read
                    as the upload having failed. */}
                {visit.imagePath ? (
                  <div className="relative w-16 h-16 rounded-lg shrink-0 border overflow-hidden bg-gray-100">
                    <SafeImage
                      src={visit.imagePath}
                      alt={getLocalized(visit, "name", locale)}
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 border flex items-center justify-center text-gray-400 text-xs text-center px-1">
                    {isAr ? "بدون صورة" : "No image"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground">{getLocalized(visit, "name", locale)}</p>
                  <p className="text-sm text-gray-500">{getLocalized(visit, "title", locale)}</p>
                  <p className="text-xs text-gray-400 mt-1">{visit.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0" dir="ltr">
                <Link
                  href={`/${locale}/admin/visits/${visit.id}`}
                  className="text-slate-400 hover:text-blue-500 transition-colors"
                  title={isAr ? "تعديل" : "Edit"}
                >
                  <Pencil size={16} />
                </Link>
                <DeleteVisitButton id={visit.id} />
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <p className="px-5 py-10 text-center text-gray-400">
              {isAr ? "لا توجد زيارات مسجلة بعد" : "No visits recorded yet"}
            </p>
          )}
        </div>
      </section>

      {/* --- News & Events Section --- */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {isAr ? "الأخبار والفعاليات" : "News & Events"}
          </h2>
          <Link
            href={`/${locale}/admin/news/new`}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} /> {isAr ? "إضافة خبر" : "Add News"}
          </Link>
        </div>

        <div className="heritage-card divide-y divide-gray-100">
          {newsEvents.map((news) => (
            <div key={news.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-4">
                {news.imagePath && (
                  <div className="relative w-16 h-16 rounded-lg shrink-0 border overflow-hidden bg-gray-100">
                    <SafeImage
                      src={news.imagePath}
                      alt={getLocalized(news, "title", locale)}
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${news.type === 'EVENT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {news.type === 'EVENT' ? (isAr ? 'فعالية' : 'Event') : (isAr ? 'خبر' : 'News')}
                    </span>
                    {!news.published && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {isAr ? 'مسودة' : 'Draft'}
                      </span>
                    )}
                    {news.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">
                        {isAr ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-foreground">{getLocalized(news, "title", locale)}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(news.createdAt, locale)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0" dir="ltr">
                <Link
                  href={`/${locale}/admin/news/${news.id}`}
                  className="text-slate-400 hover:text-blue-500 transition-colors"
                  title={isAr ? "تعديل" : "Edit"}
                >
                  <Pencil size={16} />
                </Link>
                <DeleteNewsButton id={news.id} />
              </div>
            </div>
          ))}
          {newsEvents.length === 0 && (
            <p className="px-5 py-10 text-center text-gray-400">
              {isAr ? "لا توجد أخبار مسجلة بعد" : "No news recorded yet"}
            </p>
          )}
        </div>
      </section>

      {/* --- Guestbook Section --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {isAr ? "آراء الزوار (سجل الزوار)" : "Visitor Opinions (Guestbook)"}
          </h2>
          {pendingGuestbook > 0 && (
            <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full">
              {isAr ? `${pendingGuestbook} بانتظار الموافقة` : `${pendingGuestbook} pending`}
            </span>
          )}
        </div>
        <div className="heritage-card divide-y divide-gray-100">
          {guestbookEntries.map((entry) => (
            <div key={entry.id} className={`px-5 py-4 ${!entry.approved ? "bg-yellow-50/40" : ""}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-foreground">
                    {entry.nameAr}
                    {entry.originAr && (
                      <span className="text-xs text-gray-400 font-normal ms-2">· {entry.originAr}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{entry.messageAr}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDateTime(entry.createdAt, locale)}</p>
                </div>
                <div dir="ltr" className="shrink-0">
                  <GuestbookActions id={entry.id} approved={entry.approved} />
                </div>
              </div>
            </div>
          ))}
          {guestbookEntries.length === 0 && (
            <p className="px-5 py-10 text-center text-gray-400">
              {isAr ? "لا توجد مشاركات في سجل الزوّار بعد" : "No guestbook entries yet"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
