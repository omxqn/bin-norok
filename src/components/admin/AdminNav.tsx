"use client";

// Admin navigation:
// - Desktop: vertical sidebar (rendered here, hidden on mobile).
// - Mobile: fixed bottom bar with the 4 primary items + a "More" sheet
//   that reveals the remaining items.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Library, MessageSquare, Newspaper,
  Users, Settings, Activity, LogOut, MoreHorizontal, X, Briefcase
} from "lucide-react";

export interface AdminNavProps {
  locale: string;
  isAr: boolean;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  pendingBookings: number;
  unreadMessages: number;
  pendingGuestbook: number;
}

export function AdminNav(props: AdminNavProps) {
  const { locale, isAr } = props;
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const items = [
    { key: "dash", name: isAr ? "نظرة عامة" : "Dashboard", href: `/${locale}/admin`, icon: LayoutDashboard, badge: 0, exact: true },
    { key: "bookings", name: isAr ? "الحجوزات" : "Bookings", href: `/${locale}/admin/bookings`, icon: Calendar, badge: props.pendingBookings },
    { key: "collections", name: isAr ? "القاعات والمقتنيات" : "Collections", href: `/${locale}/admin/collections`, icon: Library, badge: 0 },
    { key: "content", name: isAr ? "المحتوى التفاعلي" : "Content", href: `/${locale}/admin/content`, icon: Newspaper, badge: props.pendingGuestbook },
    { key: "messages", name: isAr ? "الرسائل" : "Messages", href: `/${locale}/admin/messages`, icon: MessageSquare, badge: props.unreadMessages },
    { key: "users", name: isAr ? "المستخدمون" : "Users", href: `/${locale}/admin/users`, icon: Users, badge: 0 },
    { key: "settings", name: isAr ? "الإعدادات" : "Settings", href: `/${locale}/admin/settings`, icon: Settings, badge: 0 },
    { key: "logs", name: isAr ? "سجل النشاطات" : "Activity Log", href: `/${locale}/admin/logs`, icon: Activity, badge: 0 },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const primary = items.slice(0, 4); // Dashboard, Bookings, Collections, Content
  const rest = items.slice(4);

  function Badge({ count }: { count: number }) {
    if (count <= 0) return null;
    return (
      <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
        {count > 99 ? "99+" : count}
      </span>
    );
  }

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-[#453723] to-[#33281a] border-e border-gold/25 flex-col shrink-0">
        <div className="p-6 border-b border-gold/20 flex items-center justify-center">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[#F0E8D2]">
            <span className="text-gold text-[9px] leading-none">◆</span>
            {isAr ? "إدارة المتحف" : "Museum Admin"}
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                  active ? "bg-gold/15 text-gold-2" : "text-[#F0E8D2]/70 hover:bg-gold/10 hover:text-gold-2"
                }`}
              >
                <span className="relative">
                  <Icon className="w-4 h-4 text-gold-dark" />
                  <Badge count={item.badge} />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold/20">
          <div className="mb-4 px-4">
            <p className="text-sm font-bold text-[#F0E8D2]">{props.userName}</p>
            <p className="text-xs text-[#F0E8D2]/50 truncate">{props.userEmail}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-gold/15 text-gold-2 text-xs font-bold rounded">
              {props.userRole}
            </span>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-500/15 rounded-lg transition-colors font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            {isAr ? "تسجيل الخروج" : "Sign Out"}
          </Link>
        </div>
      </aside>

      {/* ===== Mobile top bar (brand + sign out) ===== */}
      <div className="md:hidden sticky top-0 z-30 bg-gradient-to-b from-[#453723] to-[#3d3018] border-b border-gold/20 flex items-center justify-between px-4 py-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0E8D2]">
          <span className="text-gold text-[9px] leading-none">◆</span>
          {isAr ? "إدارة المتحف" : "Museum Admin"}
        </h2>
        <Link href="/api/auth/signout" className="text-red-300 p-1.5" aria-label={isAr ? "خروج" : "Sign out"}>
          <LogOut className="w-5 h-5" />
        </Link>
      </div>

      {/* ===== Mobile bottom nav ===== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-[#33281a] to-[#453723] border-t border-gold/25 flex items-stretch" aria-label={isAr ? "تنقّل الإدارة" : "Admin navigation"}>
        {primary.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                active ? "text-gold-2" : "text-[#F0E8D2]/65"
              }`}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                <Badge count={item.badge} />
              </span>
              <span className="truncate max-w-[64px]">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium text-[#F0E8D2]/65"
        >
          <span className="relative">
            <MoreHorizontal className="w-5 h-5" />
            <Badge count={rest.reduce((s, i) => s + i.badge, 0)} />
          </span>
          <span>{isAr ? "المزيد" : "More"}</span>
        </button>
      </nav>

      {/* ===== "More" bottom sheet ===== */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 inset-x-0 bg-cream rounded-t-2xl p-4 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-ink">{isAr ? "المزيد" : "More"}</h3>
              <button onClick={() => setMoreOpen(false)} className="text-ink-3 p-1" aria-label={isAr ? "إغلاق" : "Close"}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {rest.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                      active ? "bg-gold/15 border-gold/40 text-wine" : "bg-white border-ink/10 text-ink-2 hover:border-gold/40"
                    }`}
                  >
                    <span className="relative">
                      <Icon className="w-5 h-5 text-gold-dark" />
                      <Badge count={item.badge} />
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
