import { notFound } from "next/navigation";

// Catch-all for unknown URLs inside a locale — triggers the custom
// [locale]/not-found.tsx page instead of the framework default.
export default function CatchAllPage() {
  notFound();
}
