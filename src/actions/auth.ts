"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = sanitizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(`${ip}:${email}`, "login");
  if (!rate.success) {
    return { error: "Too many login attempts. Please try again later." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

/**
 * Sign out and land on the museum home page, in the language the admin was
 * working in — not the login screen, which would look like the sign-out had
 * failed, and not /api/auth/signout, which the dashboard used to link to: that
 * is a GET to Auth.js's own unstyled confirmation page and drops the visitor
 * outside the `[locale]` tree entirely.
 *
 * Not wrapped in try/catch: signOut() signals its redirect by throwing, so
 * catching here would swallow it.
 */
export async function signOutAction(formData: FormData) {
  const requested = String(formData.get("locale") ?? "");
  const locale = locales.includes(requested as Locale) ? requested : defaultLocale;

  await signOut({ redirectTo: `/${locale}` });
}
