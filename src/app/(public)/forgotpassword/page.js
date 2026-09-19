import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import ForgotPassword from "@/components/UserPanel/HomePage/AuthSection/ForgotPasswordSection/ForgotPassword";

const CANONICAL_URL = buildCanonicalUrl("/forgotpassword");

export function generateMetadata() {
  return {
    title: "Forgot Password | Hachion",
    description: "Reset your Hachion account password.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: true },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Forgot Password", path: "/forgotpassword" }]);

export default function ForgotPasswordPage() {
  return (
    <>
      <JsonLd data={schema} />
      <ForgotPassword />
    </>
  );
}
