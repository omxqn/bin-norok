import { LoadingLogo } from "@/components/LoadingLogo";

// Applies to every public route under [locale] that doesn't define its own
// loading.tsx, so any navigation waiting on data shows the branded logo
// rather than a blank screen.
export default function Loading() {
  // No wrapper: LoadingLogo's page variant already fills the viewport and
  // centres itself. Nesting it in another min-h-screen box pushed it upward
  // and clipped the top of the ring.
  return <LoadingLogo />;
}
