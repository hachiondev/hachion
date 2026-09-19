import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Aboutus from "@/components/UserPanel/AboutusPage/Aboutus";

const CANONICAL_URL = buildCanonicalUrl("/aboutus");

export function generateMetadata() {
  return {
    title: "About Hachion | Online IT Certification Training",
    description:
      "Learn about Hachion, an online learning platform offering industry-recognized IT certification courses authored by expert instructors.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "About Hachion | Online IT Certification Training",
      description:
        "Learn about Hachion, an online learning platform offering industry-recognized IT certification courses.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "About Us", path: "/aboutus" }]);

export default function AboutusPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Aboutus />
    </>
  );
}
