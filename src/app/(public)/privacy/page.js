import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Privacy from "@/components/UserPanel/LegalFooterSection/Privacy";

const CANONICAL_URL = buildCanonicalUrl("/privacy");

export function generateMetadata() {
  return {
    title: "Privacy Policy | Hachion",
    description:
      "Read Hachion's privacy policy to learn how we collect, use, and protect your personal information.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Privacy Policy", path: "/privacy" }]);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Privacy />
    </>
  );
}
