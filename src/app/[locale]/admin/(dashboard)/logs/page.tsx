import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

const PER_PAGE = 25;

export default async function AdminLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const isAr = locale === "ar";

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [total, logs] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const base = `/${locale}/admin/logs`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "سجل النشاطات" : "Activity Log"}
        </h1>
        <p className="text-gray-500">
          {isAr ? `${total} عملية · صفحة ${page} من ${totalPages}` : `${total} operations · page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="heritage-card divide-y divide-gray-100">
        {logs.map((log) => (
          <div key={log.id} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 self-start ${
                actionColors[log.action] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {log.action}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700">{log.details ?? `${log.action} ${log.entity}`}</p>
              <p className="text-xs text-gray-400">
                {log.user ? `${log.user.name} (${log.user.email})` : isAr ? "نظام" : "System"} ·{" "}
                {formatDateTime(log.createdAt, locale)}
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400 shrink-0">{log.entity}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="px-5 py-16 text-center text-gray-400">
            {isAr ? "لا توجد نشاطات مسجلة بعد" : "No activity recorded yet"}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <PageLink
            href={page > 1 ? `${base}?page=${page - 1}` : null}
            label={isAr ? "السابق" : "Previous"}
            icon="prev"
            isAr={isAr}
          />
          <span className="text-sm text-gray-500 font-medium">{page} / {totalPages}</span>
          <PageLink
            href={page < totalPages ? `${base}?page=${page + 1}` : null}
            label={isAr ? "التالي" : "Next"}
            icon="next"
            isAr={isAr}
          />
        </div>
      )}
    </div>
  );
}

function PageLink({
  href,
  label,
  icon,
  isAr,
}: {
  href: string | null;
  label: string;
  icon: "prev" | "next";
  isAr: boolean;
}) {
  // Arrows point in reading direction — flipped for RTL
  const showLeft = (icon === "prev") !== isAr;
  const cls = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors";
  const content = (
    <>
      {showLeft && <ChevronLeft className="w-4 h-4" />}
      {label}
      {!showLeft && <ChevronRight className="w-4 h-4" />}
    </>
  );
  if (!href) {
    return <span className={`${cls} text-gray-300 cursor-not-allowed`}>{content}</span>;
  }
  return (
    <Link href={href} className={`${cls} text-wine border border-wine/40 hover:bg-wine/10`}>
      {content}
    </Link>
  );
}
