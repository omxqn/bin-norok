import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/utils";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { DeleteHallButton, DeleteCollectionItemButton } from "@/components/admin/DeleteButtons";
import { QrButton } from "@/components/admin/QrButton";

export default async function AdminCollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [halls, items] = await Promise.all([
    prisma.museumHall.findMany({ orderBy: { order: "asc" } }),
    prisma.collectionItem.findMany({
      include: { category: true, hall: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {isAr ? "القاعات والمقتنيات" : "Halls & Collections"}
          </h1>
          <p className="text-gray-500">
            {isAr
              ? `${halls.length} قاعة · ${items.length} قطعة`
              : `${halls.length} halls · ${items.length} items`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/admin/halls/new`}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} /> {isAr ? "إضافة قاعة" : "Add Hall"}
          </Link>
          <Link
            href={`/${locale}/admin/items/new`}
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus size={16} /> {isAr ? "إضافة مقتنى" : "Add Item"}
          </Link>
        </div>
      </div>

      {/* Halls */}
      <div className="heritage-card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-foreground">{isAr ? "قاعات المتحف" : "Museum Halls"}</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {halls.map((hall) => (
            <div key={hall.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-foreground">
                  <span className="text-gray-400 font-mono text-sm me-2">#{hall.order}</span>
                  {getLocalized(hall, "title", locale)}
                </p>
                <p className="text-sm text-gray-500 truncate max-w-lg">
                  {getLocalized(hall, "description", locale)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0" dir="ltr">
                <PublishToggle entity="hall" id={hall.id} published={hall.published} />
                <Link
                  href={`/${locale}/admin/halls/${hall.id}`}
                  className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                  title={isAr ? "تعديل" : "Edit"}
                >
                  <Pencil size={16} />
                </Link>
                <DeleteHallButton id={hall.id} />
              </div>
            </div>
          ))}
          {halls.length === 0 && (
            <p className="px-5 py-10 text-center text-gray-400">
              {isAr ? "لا توجد قاعات" : "No halls yet"}
            </p>
          )}
        </div>
      </div>

      {/* Collection Items */}
      <div className="heritage-card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-foreground">{isAr ? "المقتنيات" : "Collection Items"}</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-foreground">{getLocalized(item, "title", locale)}</p>
                <p className="text-sm text-gray-500">
                  {getLocalized(item.category, "name", locale)}
                  {item.hall && <> · {getLocalized(item.hall, "title", locale)}</>}
                  {item.period && <> · {item.period}</>}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0" dir="ltr">
                <QrButton itemId={item.id} title={getLocalized(item, "title", locale)} />
                <PublishToggle entity="item" id={item.id} published={item.published} />
                <Link
                  href={`/${locale}/admin/items/${item.id}`}
                  className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                  title={isAr ? "تعديل" : "Edit"}
                >
                  <Pencil size={16} />
                </Link>
                <DeleteCollectionItemButton id={item.id} />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="px-5 py-10 text-center text-gray-400">
              {isAr ? "لا توجد مقتنيات" : "No items yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
