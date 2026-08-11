import { PageDisabled } from "@/components/PageDisabled";
import { VisitPageContent } from "@/components/visit/VisitPageContent";
import { isPageEnabled } from "@/lib/page-toggles";

// Server gate: admins can take the booking page offline from
// /admin/settings. createBooking enforces the same flag independently, so
// hiding the form here is UX, not the security boundary.
export default async function VisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(await isPageEnabled("visit"))) {
    return <PageDisabled locale={locale} />;
  }

  return <VisitPageContent />;
}
