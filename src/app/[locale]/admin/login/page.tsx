"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
        setIsLoading(false);
      } else {
        router.push(`/${locale}/admin`);
        router.refresh();
      }
    } catch (err) {
      setError(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#453723] to-[#2a2014]">
      <div className="max-w-md w-full heritage-card !border-t-4 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <p className="section-label mb-2">
            {isAr ? "لوحة التحكم" : "Admin Panel"}
          </p>
          <h1 className="text-3xl font-bold text-wine mb-2">
            {isAr ? "متحف بن نوروك" : "Bin Norouk Museum"}
          </h1>
          <div className="gold-divider mx-auto mb-3" />
          <p className="text-ink-3 text-sm font-medium">
            {isAr ? "تسجيل الدخول للوحة التحكم" : "Admin Dashboard Login"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@museum.com"
                className="rtl:pr-10 ltr:pl-10 h-12"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{isAr ? "كلمة المرور" : "Password"}</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rtl:pr-10 ltr:pl-10 h-12"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              isAr ? "دخول" : "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-ink-3">
          <p>&copy; {new Date().getFullYear()} {isAr ? "متحف بن نوروك. لوحة الإدارة." : "Bin Norouk Museum. Admin Panel."}</p>
        </div>
      </div>
    </div>
  );
}
