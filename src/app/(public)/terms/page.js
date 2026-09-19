import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Terms from "@/components/UserPanel/LegalFooterSection/Terms";

const CANONICAL_URL = buildCanonicalUrl("/terms");

export function generateMetadata() {
  return {
    title: "Terms & Conditions | Hachion",
    description:
      "Read Hachion's terms and conditions covering course enrollment, payments, and use of our online learning platform.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Terms and Conditions", path: "/terms" }]);

export default function TermsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Terms />
    </>
  );
}
