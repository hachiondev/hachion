import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import ContactUs from "@/components/UserPanel/ContactUs";

const CANONICAL_URL = buildCanonicalUrl("/contactus");

export function generateMetadata() {
  return {
    title: "Contact Hachion | Get in Touch",
    description:
      "Have a question about our IT certification courses? Contact Hachion's team for course details, enrollment help, or corporate training inquiries.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Contact Hachion | Get in Touch",
      description: "Contact Hachion's team for course details, enrollment help, or corporate training inquiries.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Contact Us", path: "/contactus" }]);

export default function ContactUsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <ContactUs />
    </>
  );
}
