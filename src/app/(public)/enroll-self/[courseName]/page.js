import { buildCanonicalUrl } from "@/lib/seo";
import { resolveCourseApiName } from "@/lib/courseApiName";
import { CourseApiNameProvider } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
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

export default async function EnrollSelfPage({ params }) {
  const { courseName } = await params;
  const apiCourseName = await resolveCourseApiName(courseName);
  return (
    <CourseApiNameProvider value={apiCourseName}>
      <NewEnrollSelfPaced />
    </CourseApiNameProvider>
  );
}
