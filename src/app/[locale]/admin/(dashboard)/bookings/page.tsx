import { getBookings } from "@/actions/bookings";
import { formatDate, formatDateTime } from "@/lib/utils";
import { VISIT_TYPES } from "@/lib/constants";
import { BookingActions } from "@/components/admin/BookingActions";

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {isAr ? "الحجوزات" : "Bookings"}
          </h1>
          <p className="text-gray-500">
            {isAr ? `${bookings.length} طلب حجز` : `${bookings.length} booking requests`}
          </p>
        </div>
        {bookings.length > 0 && (
          <a
            href="/api/admin/bookings-export"
            download
            className="inline-flex items-center gap-2 self-start bg-forest text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#2a2014] transition-colors text-sm"
          >
            ⬇ {isAr ? "تصدير إلى Excel/CSV" : "Export to Excel/CSV"}
          </a>
        )}
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-4 md:hidden">
        {bookings.length === 0 && (
          <p className="text-center text-gray-400 py-12 heritage-card">
            {isAr ? "لا توجد حجوزات بعد" : "No bookings yet"}
          </p>
        )}
        {bookings.map((booking) => (
          <div key={booking.id} className="heritage-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">{booking.fullName}</p>
                <p className="text-xs text-gray-400">{formatDateTime(booking.createdAt, locale)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📧 {booking.email}</p>
              <p>📱 <span dir="ltr">{booking.phone}</span></p>
              <p>
                🗓️ {formatDate(booking.preferredDate, locale)} · {booking.preferredTime} ·{" "}
                {booking.numberOfVisitors} {isAr ? "زائر" : "visitors"}
              </p>
              <p>
                🎟️{" "}
                {isAr
                  ? VISIT_TYPES.find((t) => t.value === booking.visitType)?.labelAr
                  : VISIT_TYPES.find((t) => t.value === booking.visitType)?.labelEn}
              </p>
              {booking.notes && <p className="text-gray-400">📝 {booking.notes}</p>}
            </div>
            <div className="pt-2 border-t border-gray-100" dir="ltr">
              <BookingActions id={booking.id} status={booking.status} adminNotes={booking.adminNotes} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block heritage-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 text-start text-gray-500">
              <th className="px-4 py-3 font-medium text-start">{isAr ? "الزائر" : "Visitor"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "التواصل" : "Contact"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "النوع" : "Type"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "تاريخ الزيارة" : "Visit Date"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "الزوار" : "Visitors"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "تاريخ الطلب" : "Requested"}</th>
              <th className="px-4 py-3 font-medium text-start">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  {isAr ? "لا توجد حجوزات بعد" : "No bookings yet"}
                </td>
              </tr>
            )}
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{booking.fullName}</p>
                  {booking.notes && (
                    <p className="text-xs text-gray-400 max-w-[200px] truncate" title={booking.notes}>
                      {booking.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <p>{booking.email}</p>
                  <p className="text-xs text-gray-400" dir="ltr">{booking.phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {isAr
                    ? VISIT_TYPES.find((t) => t.value === booking.visitType)?.labelAr
                    : VISIT_TYPES.find((t) => t.value === booking.visitType)?.labelEn}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(booking.preferredDate, locale)}
                  <p className="text-xs text-gray-400">{booking.preferredTime}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{booking.numberOfVisitors}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDateTime(booking.createdAt, locale)}</td>
                <td className="px-4 py-3" dir="ltr">
                  <BookingActions id={booking.id} status={booking.status} adminNotes={booking.adminNotes} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
