import { PageGate } from "@/components/PageGate";

// Segment gate — an admin can take this page offline from /admin/pages.
export default async function VisitorsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="visitors" locale={locale}>
      {children}
    </PageGate>
  );
}
