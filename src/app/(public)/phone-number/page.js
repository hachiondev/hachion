import { buildCanonicalUrl } from "@/lib/seo";
import GoogleMobileNumber from "@/components/UserPanel/HomePage/AuthSection/GoogleMobileNumber";

const CANONICAL_URL = buildCanonicalUrl("/phone-number");

// The CRA original had no <Helmet> on this page — added minimal metadata for
// consistency; noindex since this is a mid-signup step with no
// search-result value (matches robots.txt's Disallow: /phone-number).
export function generateMetadata() {
  return {
    title: "Enter Phone Number | Hachion",
    description: "Complete your Hachion account signup by confirming your phone number.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: false },
  };
}

export default function PhoneNumberPage() {
  return <GoogleMobileNumber />;
}
