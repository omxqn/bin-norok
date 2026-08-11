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

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  // A bare `if (!session)` let any authenticated account — including a
  // default-role EDITOR — reach every dashboard page. Note this layout is a
  // convenience gate only: Partial Rendering means it does not re-run on
  // client navigation, so each page and server action still checks for itself.
  const role = (session.user as { role?: string }).role;

  if (!role || !["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
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
