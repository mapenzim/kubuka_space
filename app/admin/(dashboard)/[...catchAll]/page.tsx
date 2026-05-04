import { notFound } from "next/navigation";

// This catch-all route intercepts any unmatched URLs starting with /admin/
// and forces Next.js to render the nearest not-found.tsx file (which is your admin one!)
export default function AdminCatchAll() {
  notFound();
}