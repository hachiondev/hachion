import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import RefundPolicy from "@/components/UserPanel/LegalFooterSection/RefundPolicy";

const CANONICAL_URL = buildCanonicalUrl("/refundpolicy");

export function generateMetadata() {
  return {
    title: "Refund Policy | Hachion",
    description:
      "Read Hachion's refund policy for course enrollments, cancellations, and payment terms.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Refund Policy", path: "/refundpolicy" }]);

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={schema} />
      <RefundPolicy />
    </>
  );
}
