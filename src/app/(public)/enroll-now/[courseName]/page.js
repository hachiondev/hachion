import { buildCanonicalUrl } from "@/lib/seo";
import NewEnrollNow from "@/components/UserPanel/NewEnrollmentPage/NewEnrollNow";

export async function generateMetadata({ params }) {
  const { courseName } = await params;
  return {
    title: "Enroll & Pay | Hachion",
    description: "Confirm your course details and proceed with payment.",
    alternates: { canonical: buildCanonicalUrl(`/enroll-now/${courseName}`) },
    robots: { index: false, follow: false },
  };
}

export default function EnrollNowPage() {
  return <NewEnrollNow />;
}
