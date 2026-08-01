import Link from "next/link";
import { Users, Library, Calendar, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const isAr = locale === "ar";

  // Fetch some quick stats from the database
  // First day of the month, 5 months back (6-month window)
  const chartStart = new Date();
  chartStart.setDate(1);
  chartStart.setHours(0, 0, 0, 0);
  chartStart.setMonth(chartStart.getMonth() - 5);

  const [
    hallsCount,
    itemsCount,
    pendingBookings,
    unreadMessages,
    recentBookings,
    recentMessages,
    chartBookings,
  ] = await Promise.all([
    prisma.museumHall.count(),
    prisma.collectionItem.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactMessage.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
  ]);

  // Group bookings into the last 6 months
  const months: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString(isAr ? "ar-OM" : "en-US", { month: "short" }),
      count: 0,
    });
  }
  for (const booking of chartBookings) {
    const key = `${booking.createdAt.getFullYear()}-${booking.createdAt.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.count++;
  }
  const maxCount = Math.max(1, ...months.map((m) => m.count));

  const stats = [
    {
      title: isAr ? "طلبات الحجز الجديدة" : "Pending Bookings",
      value: pendingBookings,
      icon: Calendar,
      color: "bg-wine"
    },
    {
      title: isAr ? "رسائل غير مقروءة" : "Unread Messages",
      value: unreadMessages,
      icon: MessageSquare,
      color: "bg-forest"
    },
    {
      title: isAr ? "قاعات العرض" : "Museum Halls",
      value: hallsCount,
      icon: Library,
      color: "bg-gold"
    },
    {
      title: isAr ? "إجمالي المقتنيات" : "Total Items",
      value: itemsCount,
      icon: Users, // Can use a better icon later
      color: "bg-gold-dark"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">
          {isAr ? "نظرة عامة" : "Dashboard Overview"}
        </h1>
        <p className="text-gray-500">
          {isAr ? "مرحباً بك في لوحة تحكم متحف بن نوروك" : "Welcome to Bin Norouk Museum Admin Dashboard"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly bookings chart */}
      <div className="heritage-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">
          {isAr ? "الحجوزات خلال آخر ٦ أشهر" : "Bookings — last 6 months"}
        </h2>
        <div className="flex items-end justify-between gap-3 h-40" dir="ltr">
          {months.map((month) => (
            <div key={month.key} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
              <span className="text-xs font-bold text-gray-600">{month.count}</span>
              <div
                className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all"
                style={{ height: `${Math.max(4, (month.count / maxCount) * 100)}%` }}
              />
              <span className="text-xs text-gray-400 font-medium">{month.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="heritage-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{isAr ? "أحدث طلبات الحجز" : "Recent Bookings"}</h2>
            <Link href={`/${locale}/admin/bookings`} className="text-sm text-primary hover:underline font-bold">
              {isAr ? "عرض الكل" : "View all"}
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {isAr ? "لا توجد حجوزات حديثة" : "No recent bookings"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">{booking.fullName}</p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(booking.createdAt, locale)} · {booking.numberOfVisitors}{" "}
                      {isAr ? "زائر" : "visitors"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="heritage-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{isAr ? "أحدث الرسائل" : "Recent Messages"}</h2>
            <Link href={`/${locale}/admin/messages`} className="text-sm text-primary hover:underline font-bold">
              {isAr ? "عرض الكل" : "View all"}
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {isAr ? "لا توجد رسائل حديثة" : "No recent messages"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentMessages.map((message) => (
                <div key={message.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-gray-800 truncate">
                      {!message.isRead && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full me-2" />
                      )}
                      {message.name}
                    </p>
                    <p className="text-xs text-gray-400 shrink-0">
                      {formatDateTime(message.createdAt, locale)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{message.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
