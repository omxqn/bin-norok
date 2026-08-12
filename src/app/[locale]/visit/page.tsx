import { VisitPageContent } from "@/components/visit/VisitPageContent";

// The on/off switch lives in ./layout.tsx (PageGate). createBooking enforces
// the same flag independently, so hiding the form is UX, not the security
// boundary.
export default function VisitPage() {
  return <VisitPageContent />;
}
