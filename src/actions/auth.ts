"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { headers } from "next/headers";

/** Error codes the login form translates for display. */
export type LoginState = { error: "credentials" | "rateLimit" | "server" } | null;

/**
 * Signs in and redirects, server-side.
 *
 * Deliberately a server action rather than the client-side `signIn(...,
 * { redirect: false })` this form used to call: that approach only works once
 * React has hydrated. Before then the browser falls back to a native form
 * submit, which reloads the page and appends the password to the URL as a
 * query string — visible in history, logs and the Referer header.
 *
 * signIn() signals its redirect by throwing, so the catch below must rethrow
 * anything that is not an AuthError.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = sanitizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  const requested = String(formData.get("locale") ?? "");
  const locale = locales.includes(requested as Locale) ? requested : defaultLocale;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(`${ip}:${email}`, "login");
  if (!rate.success) {
    return { error: "rateLimit" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      // Locale-aware: the old "/admin" has no locale prefix and does not
      // resolve to a real route.
      redirectTo: `/${locale}/admin`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type === "CredentialsSignin" ? "credentials" : "server" };
    }
    throw error;
  }

  return null;
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
