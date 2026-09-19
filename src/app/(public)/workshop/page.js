import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import Workshop from "@/components/UserPanel/Workshop";

const CANONICAL_URL = buildCanonicalUrl("/workshop");

export function generateMetadata() {
  return {
    title: "IT Certification Workshops | Job-Ready Skills | Hachion",
    description:
      "Join hands-on IT workshops in the US! Get certified in high-demand tech skills with expert-led training. Boost your career today - limited seats available!",
    keywords: "IT workshops USA, tech certification training, hands-on IT courses, best IT workshops 2025, IT skills training near me, certified tech workshops",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Online IT Training: Get Certified, Find Your Dream Job",
      description: "Learn online with the best courses at Hachion.",
      url: CANONICAL_URL,
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
  };
}

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hachion",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/Hachion-logo.png`,
  sameAs: [
    "https://www.facebook.com/hachion.co",
    "https://x.com/hachion_co",
    "https://www.linkedin.com/company/hachion",
    "https://www.instagram.com/hachion_trainings",
    "https://www.quora.com/profile/Hachion-4",
    "https://www.youtube.com/@hachion",
  ],
};

export default function WorkshopPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Workshop />
    </>
  );
}
