import { buildCanonicalUrl } from "@/lib/seo";
import { resolveCourseApiName } from "@/lib/courseApiName";
import { CourseApiNameProvider } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import EnrollPayment from "@/components/UserPanel/EnrollPayment";

export async function generateMetadata({ params }) {
  const { courseName } = await params;
  return {
    title: "Enrollment Confirmation | Hachion",
    description: "Your course enrollment payment confirmation.",
    alternates: { canonical: buildCanonicalUrl(`/payment/${courseName}`) },
    robots: { index: false, follow: false },
  };
}

export default async function PaymentPage({ params }) {
  const { courseName } = await params;
  const apiCourseName = await resolveCourseApiName(courseName);
  return (
    <CourseApiNameProvider value={apiCourseName}>
      <EnrollPayment />
    </CourseApiNameProvider>
  );
}
