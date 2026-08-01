"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center lg:hidden">
        <span className="font-bold text-lg">Admin</span>
      </div>
      <div className="hidden lg:flex" />
      
      <div className="flex items-center space-x-4">
        <Link href="/" target="_blank" className="text-sm text-slate-500 hover:text-slate-700">
          View Site
        </Link>
        <div className="h-6 w-px bg-slate-200 mx-2" />
        {session?.user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-700">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <UserIcon size={16} className="text-slate-500" />
              </div>
              <div className="hidden md:block">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-xs text-slate-500">{session.user.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
