import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import AllReviews from "@/components/UserPanel/ReviewsPage/AllReviews";

const CANONICAL_URL = buildCanonicalUrl("/view-all-reviews");

export function generateMetadata() {
  return {
    title: "Learner Reviews | Hachion",
    description:
      "Read reviews from Hachion learners about our online IT certification training, hands-on projects, and career support.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Learner Reviews | Hachion",
      description:
        "Read reviews from Hachion learners about our online IT certification training and career support.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Learner Reviews", path: "/view-all-reviews" }]);

export default function ViewAllReviewsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <AllReviews />
    </>
  );
}
