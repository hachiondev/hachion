import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import ApplyHiring from "@/components/UserPanel/ApplyHiring";

const CANONICAL_URL = buildCanonicalUrl("/career");

// CRA's ApplyHiring.jsx had no <Helmet>/metadata at all — this is a genuine
// SEO improvement, not a parity deviation (there was nothing to diverge from).
export function generateMetadata() {
  return {
    title: "Careers at Hachion | We're Hiring",
    description: "Explore current job openings at Hachion and apply to the role that best suits your experience.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Careers at Hachion | We're Hiring",
      description: "Explore current job openings at Hachion and apply to the role that best suits your experience.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Career", path: "/career" }]);

export default function CareerPage() {
  return (
    <>
      <JsonLd data={schema} />
      <ApplyHiring />
    </>
  );
}
