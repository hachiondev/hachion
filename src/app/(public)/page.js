import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { homePageJsonLd } from "@/lib/homeSchema";
import JsonLd from "@/components/common/JsonLd";
import Home from "@/components/UserPanel/Home";

// Ported verbatim from the CRA app's src/Components/UserPanel/Home.jsx
// <Helmet> block. Home.jsx doesn't override og:type/og:site_name or any
// Twitter Card tag, so those keep the site-wide fallback values from the
// CRA app's public/index.html (the only ones a crawler ever actually saw
// on "/", since react-helmet-async only overrides what it's given).
const TITLE = "Online IT Training: Get Certified, Find Your Dream Job";
const DESCRIPTION =
  "Hachion offers professional certification online training courses authored by industry experts. Learn the high in-demand skills from our experts.";
const KEYWORDS =
  "Online IT Courses, Software Training, Best Online IT Training Platform";
const OG_DESCRIPTION = "Learn online with the best courses at Hachion.";
const CANONICAL_URL = buildCanonicalUrl("/");

export function generateMetadata() {
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    alternates: {
      canonical: CANONICAL_URL,
    },
    robots: {
      index: true,
      follow: true,
    },
    // Home.jsx's own <meta name="google-site-verification"> override
    // (distinct from the site-wide code in index.html) — preserved as-is.
    verification: {
      google: "OSFzh41XFoqi1NXy_zU_2YvFyv7NRVFql8TF6PpbrsM",
    },
    // Local copy (public/Hachion-logo.png), not the absolute production
    // URL — the browser fetches <link rel="icon"> directly, and the CSP's
    // img-src doesn't allow www.hachion.co, only 'self'.
    icons: {
      icon: "/Hachion-logo.png",
      apple: "/Hachion-logo.png",
    },
    openGraph: {
      type: "website",
      siteName: "Hachion",
      url: CANONICAL_URL,
      title: TITLE,
      description: OG_DESCRIPTION,
      // OG/Twitter images are metadata read by external crawlers, not
      // fetched by the visiting browser, so these stay absolute
      // production URLs (required by the Open Graph/Twitter Card spec).
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hachionofficial",
      title: "Hachion: Your Learning Partner",
      description: "Transform your career with Hachion's Online IT Courses.",
      images: [`${SITE_ORIGIN}/industry-recognized-it-certifications-social.jpg`],
    },
  };
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageJsonLd} />
      <Home />
    </>
  );
}
