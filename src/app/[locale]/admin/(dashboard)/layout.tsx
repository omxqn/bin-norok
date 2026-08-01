import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const isAr = locale === "ar";

  const [pendingBookings, unreadMessages, pendingGuestbook] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    prisma.guestbookEntry.count({ where: { approved: false } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminNav
        locale={locale}
        isAr={isAr}
        userName={session.user?.name}
        userEmail={session.user?.email}
        userRole={(session.user as { role?: string })?.role}
        pendingBookings={pendingBookings}
        unreadMessages={unreadMessages}
        pendingGuestbook={pendingGuestbook}
      />

      {/* Main content — extra bottom padding on mobile clears the bottom nav */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
