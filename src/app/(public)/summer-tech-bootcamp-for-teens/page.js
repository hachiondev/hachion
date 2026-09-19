import { buildCanonicalUrl } from "@/lib/seo";
import JsonLd from "@/components/common/JsonLd";
import KidsSummer from "@/components/UserPanel/KidsSummer";

const CANONICAL_URL = buildCanonicalUrl("/summer-tech-bootcamp-for-teens");
const TITLE = "STEM Summer Tech Bootcamp: Hands-On Python, Coding & More";
const DESCRIPTION =
  "Join our Summer Tech Bootcamp! Kids and teens learn Python, Java, robotics, and AI through fun projects. 1:1 mentoring, certificates & flexible schedules.";

export function generateMetadata() {
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords:
      "summer tech bootcamp for teens, Python summer camp for high school students, Learn Python for teens online, Java programming summer classes, Core Java course for middle school, Web design bootcamp for teens, HTML CSS summer program, Social media marketing for students, Teen digital marketing course, STEM summer camps near me, Best tech courses for 6th to 12th graders, Online coding classes with certificate, Project-based tech camp",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    // The CRA original's og:title/og:description/og:image were copy-pasted
    // verbatim from the Home page (a real bug — this page's social share
    // preview showed Home's title, not this page's). Fixed to describe
    // this page's own content instead of duplicating Home's.
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: CANONICAL_URL,
    },
  };
}

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hachion",
  url: "https://www.hachion.co",
  logo: "https://www.hachion.co/Hachion-logo.webp",
  sameAs: [
    "https://www.facebook.com/hachion.co",
    "https://x.com/hachion_co",
    "https://www.linkedin.com/company/hachion",
    "https://www.instagram.com/hachion_trainings",
    "https://www.quora.com/profile/Hachion-4",
    "https://www.youtube.com/@hachion",
  ],
};

export default function KidsSummerPage() {
  return (
    <>
      <JsonLd data={schema} />
      <KidsSummer />
    </>
  );
}
