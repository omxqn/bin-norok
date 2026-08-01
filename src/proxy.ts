import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export function proxy(request: NextRequest) {
  // If the request is for the admin dashboard, bypass next-intl
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Add auth checks here later
    return NextResponse.next();
  }

  // Otherwise, use next-intl middleware for localized public pages
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
