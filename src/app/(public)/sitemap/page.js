import { buildCanonicalUrl } from "@/lib/seo";
import Sitemap from "@/components/UserPanel/SitemapPage/Sitemap";

const CANONICAL_URL = buildCanonicalUrl("/sitemap");

// The CRA original had no <Helmet> here either — added since an HTML
// sitemap is specifically meant to help both users and crawlers discover
// content, so it should be indexed (unlike Unsubscribe).
export function generateMetadata() {
  return {
    title: "Sitemap | Hachion",
    description: "Browse all Hachion course categories and courses in one place.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

export default function SitemapPage() {
  return <Sitemap />;
}
