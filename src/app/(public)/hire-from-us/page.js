import { buildCanonicalUrl } from "@/lib/seo";
import HirefromUs from "@/components/UserPanel/HirefromUs";

const CANONICAL_URL = buildCanonicalUrl("/hire-from-us");

// CRA's HirefromUs.jsx had no <Helmet>/metadata at all — this is a genuine
// SEO improvement, not a parity deviation (there was nothing to diverge from).
export function generateMetadata() {
  return {
    title: "Hire Skilled IT Talent | Hachion",
    description: "Hachion helps you hire skilled, job-ready IT talent faster and more affordably — zero-cost hiring, pre-vetted candidates, and dedicated hiring support.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Hire Skilled IT Talent | Hachion",
      description: "Hachion helps you hire skilled, job-ready IT talent faster and more affordably.",
      url: CANONICAL_URL,
    },
  };
}

export default function HireFromUsPage() {
  return <HirefromUs />;
}
