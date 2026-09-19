// JSON-LD payloads for the public Home page ("/"), ported verbatim from
// the CRA app's src/Components/UserPanel/Home.jsx <Helmet> script blocks.
// Every @type and property is preserved exactly, including the original
// file's mismatched comment (the object below is typed "EducationalOrganization"
// with an aggregateRating/review — the CRA source labeled it "Review Schema"
// even though schema.org has no such type; kept as-is to not change behavior).

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hachion",
  url: "https://www.hachion.co/",
  logo: "https://www.hachion.co/Hachion-logo.png",
  description:
    "Hachion offers industry-ready online IT courses with certification and complete job assistance.",
  telephone: "+1-732-485-2499",
  email: "trainings@hachion.co",
  address: {
    "@type": "PostalAddress",
    streetAddress: "601 Voyage Trce",
    addressLocality: "Leander",
    addressRegion: "TX",
    postalCode: "78641",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.facebook.com/hachion.official/",
    "https://www.instagram.com/hachion.official/",
    "https://www.linkedin.com/company/hachion/",
    "https://www.youtube.com/@hachion.official",
    "https://x.com/hachionofficial",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-732-485-2499",
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.hachion.co/",
  name: "Online IT Training: Get Certified, Find Your Dream Job",
  image: "https://www.hachion.co/industry-recognized-it-certifications.webp",
  url: "https://www.hachion.co",
  telephone: "+1 732-485-2499",
  description:
    "Hachion offers professional certification online training courses authored by industry experts Learn the high in demand skills from our experts.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "601 Voyage Trace",
    addressLocality: "Leander",
    addressRegion: "Texas",
    postalCode: "78641",
    addressCountry: "USA",
  },
};

export const educationalOrganizationReviewSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://www.hachion.co/#organization",
  name: "Hachion",
  url: "https://www.hachion.co/",
  logo: "https://www.hachion.co/Hachion-logo.png",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    reviewCount: "3",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Shimpa Sontakke" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "The sessions were very helpful for beginners. The training helped me understand technical concepts clearly with practical guidance.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Jacker Jack" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Best live online training institute for IT courses with excellent job assistance and career support.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Raju" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Hachion provides excellent learning support and knowledgeable mentors for Salesforce Admin training.",
    },
  ],
};

export const navigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "Security Operations Center",
      description: "SOC Analyst Training",
      url: "https://www.hachion.co/courses/security-operations-center-(soc)-analyst",
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "Agentic AI Training",
      description: "Agentic AI Certification Course",
      url: "https://www.hachion.co/courses/agentic-ai",
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Cyber Security Training",
      description: "Cyber Security Certification",
      url: "https://www.hachion.co/courses/cyber-security",
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "Data Science with Python",
      description: "Data Science Training",
      url: "https://www.hachion.co/courses/data-science-with-python",
    },
    {
      "@type": "SiteNavigationElement",
      position: 5,
      name: "Salesforce Admin Training",
      description: "Salesforce Administrator Training",
      url: "https://www.hachion.co/courses/salesforce-admin",
    },
  ],
};

export const homePageJsonLd = [
  organizationSchema,
  localBusinessSchema,
  educationalOrganizationReviewSchema,
  navigationSchema,
];
