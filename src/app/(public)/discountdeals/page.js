import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import DiscountDeals from "@/components/UserPanel/DiscountDeals";

const CANONICAL_URL = buildCanonicalUrl("/discountdeals");

export function generateMetadata() {
  return {
    title: "Course Discounts & Deals | Hachion",
    description:
      "Explore current discounts and deals on Hachion's IT certification courses. Limited-time offers on top-rated training programs.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Course Discounts & Deals | Hachion",
      description:
        "Explore current discounts and deals on Hachion's IT certification courses.",
      url: CANONICAL_URL,
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Discount Deals", path: "/discountdeals" }]);

export default function DiscountDealsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <DiscountDeals />
    </>
  );
}
