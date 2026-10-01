import { buildCanonicalUrl } from "@/lib/seo";
import { resolveCourseApiName } from "@/lib/courseApiName";
import { CourseApiNameProvider } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
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

export default async function EnrollNowPage({ params }) {
  const { courseName } = await params;
  const apiCourseName = await resolveCourseApiName(courseName);
  return (
    <CourseApiNameProvider value={apiCourseName}>
      <NewEnrollNow />
    </CourseApiNameProvider>
  );
}
