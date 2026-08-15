"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale } from "next-intl";
import { loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2 } from "lucide-react";

// The submit button lives in its own component because useFormStatus only
// reports the pending state of a parent <form>.
function SubmitButton({ isAr }: { isAr: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg font-bold rounded-xl"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : isAr ? "دخول" : "Sign In"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Posts to a server action, so sign-in works even before React hydrates —
  // no native GET fallback that reloads the page with the password in the URL.
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, null);

  const errorMessage = !state?.error
    ? ""
    : state.error === "rateLimit"
      ? isAr
        ? "محاولات كثيرة. يرجى المحاولة لاحقاً."
        : "Too many attempts. Please try again later."
      : state.error === "credentials"
        ? isAr
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "Invalid email or password"
        : isAr
          ? "حدث خطأ غير متوقع"
          : "An unexpected error occurred";

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

        {errorMessage && (
          <div
            role="alert"
            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center"
          >
            {errorMessage}
          </div>
        )}

        {/* No method/encType: React sets POST and the correct encoding itself
            when the action is a function, and specifying them is overridden. */}
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <div className="space-y-2">
            <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="admin@museum.com"
                className="rtl:pr-10 ltr:pl-10 h-12"
                required
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
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="rtl:pr-10 ltr:pl-10 h-12"
                required
              />
            </div>
          </div>

          <SubmitButton isAr={isAr} />
        </form>

        <div className="mt-8 text-center text-xs text-ink-3">
          <p>&copy; {new Date().getFullYear()} {isAr ? "متحف بن نوروك. لوحة الإدارة." : "Bin Norouk Museum. Admin Panel."}</p>
        </div>
      </div>
    </div>
  );
}
