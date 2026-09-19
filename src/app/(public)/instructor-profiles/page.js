import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Instructors from "@/components/UserPanel/InstructorsPage/Instructors";

const CANONICAL_URL = buildCanonicalUrl("/instructor-profiles");

export function generateMetadata() {
  return {
    title: "Meet Our Instructors | Hachion",
    description:
      "Meet Hachion's expert instructors — industry professionals bringing real-world experience to every IT certification course.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Meet Our Instructors | Hachion",
      description:
        "Meet Hachion's expert instructors — industry professionals bringing real-world experience.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Instructor Profiles", path: "/instructor-profiles" }]);

export default function InstructorProfilesPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Instructors />
    </>
  );
}
