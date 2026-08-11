import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Paths probed by automated vulnerability scanners: WordPress installers,
// exposed dotfiles, and script extensions this app never serves. Rejected
// here so they don't fall through to app/[locale]/[...rest], which would
// otherwise render a full localized 404 page — one billed function
// invocation per bot request.
const SCANNER_PROBE =
  /^\/(?:wp-admin|wp-includes|wp-content|wordpress)(?:\/|$)|^\/\.(?:git|env|aws|svn)(?:\/|$)|\.(?:php|phtml|asp|aspx|jsp|cgi|env|sql|bak|ini|sh)$/i;

const localeGroup = locales.join("|");
const ADMIN_PATH = new RegExp(`^/(?:${localeGroup})/admin(?:/|$)`);
const ADMIN_LOGIN_PATH = new RegExp(`^/(?:${localeGroup})/admin/login/?$`);

// Auth.js v5 session cookie — unprefixed over HTTP, __Secure- over HTTPS.
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SCANNER_PROBE.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Optimistic gate: redirects logged-out visitors away from the dashboard
  // without a database round-trip. This is NOT the authorization boundary —
  // every admin page and server action verifies session and role itself,
  // because a proxy matcher can silently stop covering a Server Action when
  // routes move (see next/dist/docs/.../file-conventions/proxy.md).
  if (ADMIN_PATH.test(pathname) && !ADMIN_LOGIN_PATH.test(pathname)) {
    const signedIn = SESSION_COOKIES.some((name) => request.cookies.has(name));

    if (!signedIn) {
      const locale = pathname.split("/")[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Localized pages. Excludes API routes, Next internals, and any path
    // containing a dot (static assets in public/).
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Scanner probes contain a dot, so the pattern above would skip them.
    // Match them explicitly so SCANNER_PROBE above can reject them.
    "/wp-admin/:path*",
    "/wp-includes/:path*",
    "/wp-content/:path*",
    "/.git/:path*",
    "/(.*\\.php)",
    "/(.*\\.env)",
  ],
};
