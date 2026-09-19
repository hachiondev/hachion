import { buildCanonicalUrl } from "@/lib/seo";
import NewEnrollSelfPaced from "@/components/UserPanel/NewEnrollSelfPaced";

export async function generateMetadata({ params }) {
  const { courseName } = await params;
  return {
    title: "Enroll & Pay | Hachion",
    description: "Confirm your course details and proceed with payment.",
    alternates: { canonical: buildCanonicalUrl(`/enroll-self/${courseName}`) },
    robots: { index: false, follow: false },
  };
}

export default function EnrollSelfPage() {
  return <NewEnrollSelfPaced />;
}
