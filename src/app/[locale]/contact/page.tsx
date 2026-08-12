import { ContactPageContent } from "@/components/contact/ContactPageContent";

// Gated in ./layout.tsx — see the note in ../visit/page.tsx.
// submitContactMessage enforces the same flag server-side.
export default function ContactPage() {
  return <ContactPageContent />;
}
