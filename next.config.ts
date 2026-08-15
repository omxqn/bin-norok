import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Content-Security-Policy. Shipped in Report-Only mode: violations are
// reported to the browser console but nothing is blocked, so this cannot
// break the live site. Verify the console is clean, then rename the header
// below to 'Content-Security-Policy' to enforce it.
//
// 'unsafe-inline' on style-src is required by Tailwind v4 and next/font.
// Tightening script-src further needs a per-request nonce issued from
// src/proxy.ts — see next/dist/docs/01-app/02-guides/content-security-policy.md
const contentSecurityPolicy = [
  "default-src 'self'",
  // va.vercel-scripts.com serves the Vercel Analytics script in development;
  // in production it is proxied from this origin.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://images.unsplash.com https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // No 'upgrade-insecure-requests': browsers ignore it in a report-only
  // policy and log a console error. Add it when this is enforced.
].join('; ');

// Security headers applied to every response
const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only send the origin as referrer to other sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable powerful browser features we don't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Force HTTPS for two years, including subdomains. Only add `preload` once
  // every subdomain is confirmed HTTPS-ready — it is hard to undo.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Disable the legacy XSS Auditor. The header is gone from modern browsers
  // and its `1; mode=block` mode was itself exploitable in older ones.
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // uploadImage() accepts images up to MAX_FILE_SIZE (5MB), but a Server
      // Action request is capped at 1MB by default — so every photo straight
      // off a phone was rejected by the framework before the action ever ran.
      // The extra headroom covers multipart boundaries and part headers.
      bodySizeLimit: '6mb',
    },
  },
  images: {
    // Keep in sync with isOptimizableImageSrc() in src/lib/image-src.ts: a
    // host missing here makes next/image throw while rendering, which fails
    // the whole page instead of just the image.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Admin uploads, when the app runs on Vercel (BLOB_READ_WRITE_TOKEN).
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
