import { LoadingLogo } from "@/components/LoadingLogo";

// The dashboard renders inside its own chrome (AdminNav stays visible), so
// this fills only the content column rather than the whole viewport.
export default function Loading() {
  return <LoadingLogo variant="inline" />;
}
