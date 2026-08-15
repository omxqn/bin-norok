// ===========================================
// Canonical site URL
// ===========================================
// Canonical URLs, hreflang alternates, OG images and the sitemap all need an
// absolute origin. NEXT_PUBLIC_APP_URL is "http://localhost:3000" in the
// committed .env, so relying on it alone published localhost URLs in the
// production <head>. Fall back through the Vercel-provided host before
// giving up on localhost.

const PRODUCTION_URL = "https://binnorookmus.com";

function normalise(value: string): string {
  const withProtocol = value.startsWith("http") ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  // Accept the configured value only when it is a real public origin —
  // a localhost value in a production build is a misconfiguration, not intent.
  if (configured && !/localhost|127\.0\.0\.1/.test(configured)) {
    return normalise(configured);
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (vercelHost) return normalise(vercelHost);

  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;

  return configured ? normalise(configured) : "http://localhost:3000";
}

export const siteUrl = getSiteUrl();
