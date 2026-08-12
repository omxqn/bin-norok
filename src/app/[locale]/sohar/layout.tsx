import { PageGate } from "@/components/PageGate";

// Segment gate — an admin can take this page offline from /admin/pages.
export default async function SoharLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageGate slug="sohar" locale={locale}>
      {children}
    </PageGate>
  );
}
