import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import BecomeInstructor from "@/components/UserPanel/BecomeInstructor";

const CANONICAL_URL = buildCanonicalUrl("/become-instructor");

export function generateMetadata() {
  return {
    title: "Become an Instructor | Hachion",
    description:
      "Become an instructor and start teaching with Hachion's community of 26k+ certified instructors reaching 67.1k+ students worldwide.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Become an Instructor | Hachion",
      description:
        "Become an instructor and start teaching with Hachion's community of certified instructors.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Become an Instructor", path: "/become-instructor" }]);

export default function BecomeInstructorPage() {
  return (
    <>
      <JsonLd data={schema} />
      <BecomeInstructor />
    </>
  );
}
