import { buildCanonicalUrl } from "@/lib/seo";
import Unsubscribe from "@/components/UserPanel/LegalFooterSection/Unsubscribe";

const CANONICAL_URL = buildCanonicalUrl("/unsubscribe");

// The CRA original had no <Helmet> at all on this page. Minimal metadata,
// explicitly indexable — unsubscribe pages are a normal, legitimate public
// page for this kind of site and there's no reason to withhold it from
// search results.
export function generateMetadata() {
  return {
    title: "Unsubscribe | Hachion",
    description: "Unsubscribe from Hachion email and SMS communications.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

export default function UnsubscribePage() {
  return <Unsubscribe />;
}
