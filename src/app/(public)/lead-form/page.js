import { buildCanonicalUrl } from "@/lib/seo";
import LeadForm from "@/components/UserPanel/LeadForm";

const CANONICAL_URL = buildCanonicalUrl("/lead-form");

// CRA's LeadForm.jsx had no <Helmet>/metadata at all. Marketer-referral
// landing pages like this are typically not meant for organic search
// discovery, so this is indexed=false rather than adding a generic
// index:true default the CRA source never expressed an intent for either way.
export function generateMetadata() {
  return {
    title: "Student Registration | Hachion",
    description: "Register your interest in Hachion's IT training programs.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: true },
  };
}

export default function LeadFormPage() {
  return <LeadForm />;
}
