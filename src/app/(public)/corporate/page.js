import { buildCanonicalUrl } from "@/lib/seo";
import CorporateTraining from "@/components/UserPanel/CorporateTraining";

const CANONICAL_URL = buildCanonicalUrl("/corporate");

export function generateMetadata() {
  return {
    title: "Corporate IT Training Programs | Hachion",
    description:
      "Upskill your workforce with Hachion's corporate IT training programs — customized courses, expert instructors, and flexible schedules for teams.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

export default function CorporateTrainingPage() {
  return <CorporateTraining />;
}
