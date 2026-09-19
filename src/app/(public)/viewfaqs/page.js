import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import AllFaqs from "@/components/UserPanel/FaqPage/AllFaqs";

const CANONICAL_URL = buildCanonicalUrl("/viewfaqs");

export function generateMetadata() {
  return {
    title: "Frequently Asked Questions | Hachion",
    description:
      "Find answers to frequently asked questions about Hachion's online IT certification courses, class formats, and support.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Frequently Asked Questions | Hachion",
      description:
        "Find answers to frequently asked questions about Hachion's online IT certification courses.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "FAQs", path: "/viewfaqs" }]);

export default function ViewFaqsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <AllFaqs />
    </>
  );
}
