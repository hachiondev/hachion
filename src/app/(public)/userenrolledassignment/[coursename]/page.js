import UserProtectedRoute from "@/components/UserPanel/UserDashboardPage/UserProtectedRoute";
import UserEnrolledAssignment from "@/components/UserPanel/UserEnrolledAssignment";

// Same auth guard as /userdashboard — CRA nested this route inside both
// <Layout/> (navbar/footer) and <UserProtectedRoute/> (auth-gated).
// Noindex/nofollow: authenticated, per-user course-player content.
export function generateMetadata() {
  return {
    title: "Course Player | Hachion",
    description: "Continue your enrolled course.",
    robots: { index: false, follow: false },
  };
}

export default function UserEnrolledAssignmentPage() {
  return (
    <UserProtectedRoute>
      <UserEnrolledAssignment />
    </UserProtectedRoute>
  );
}
