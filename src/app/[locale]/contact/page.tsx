import { PageDisabled } from "@/components/PageDisabled";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { isPageEnabled } from "@/lib/page-toggles";

// Server gate — see the note in ../visit/page.tsx. submitContactMessage
// enforces the same flag server-side.
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(await isPageEnabled("contact"))) {
    return <PageDisabled locale={locale} />;
  }

  return <ContactPageContent />;
}
