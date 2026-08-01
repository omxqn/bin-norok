"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Library, 
  CalendarCheck, 
  Mail, 
  Newspaper, 
  Settings, 
  Users, 
  Activity 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Halls", href: "/admin/halls", icon: Building2 },
  { name: "Collections", href: "/admin/collections", icon: Library },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "News & Events", href: "/admin/news", icon: Newspaper },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-wider">Bin Norouk Admin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-slate-800 text-amber-500" : "hover:bg-slate-800 hover:text-white text-slate-300"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-800">
        &copy; {new Date().getFullYear()} Bin Norouk Museum
      </div>
    </div>
  );
}
