import { buildCanonicalUrl } from "@/lib/seo";
import UserProtectedRoute from "@/components/UserPanel/UserDashboardPage/UserProtectedRoute";
import UserDashboard from "@/components/UserPanel/UserDashboardPage/UserDashboard";

const CANONICAL_URL = buildCanonicalUrl("/userdashboard");

// Optional catch-all mirrors the CRA app's single `/userdashboard/:section?`
// route — one page, client-side tab switching inside UserDashboard.
// Noindex/nofollow: this is authenticated, per-user account content.
export function generateMetadata() {
  return {
    title: "My Dashboard | Hachion",
    description: "Manage your Hachion courses, profile, wishlist, orders, certificates, and reviews.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: false },
  };
}

export default function UserDashboardPage() {
  return (
    <UserProtectedRoute>
      <UserDashboard />
    </UserProtectedRoute>
  );
}
