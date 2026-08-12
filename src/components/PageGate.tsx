import { isPageEnabled, type PageSlug } from "@/lib/page-toggles";
import { PageDisabled } from "@/components/PageDisabled";

/**
 * Wraps a public route segment so an admin can take it offline from
 * /admin/pages. Used from each section's layout.tsx, which means it also
 * covers the detail routes underneath (halls/[slug], collections/[id], …)
 * without each one repeating the check.
 *
 * This is the visitor-facing gate. Anything with a side effect — bookings,
 * contact messages, guestbook entries — re-checks the same flag inside its
 * server action, because an action is a public POST endpoint that never goes
 * through this component.
 */
export async function PageGate({
  slug,
  locale,
  children,
}: {
  slug: PageSlug;
  locale: string;
  children: React.ReactNode;
}) {
  if (!(await isPageEnabled(slug))) {
    return <PageDisabled locale={locale} />;
  }

  return <>{children}</>;
}
