import React, { useEffect, lazy, Suspense } from 'react';
import { Helmet } from "react-helmet-async";
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import PopupBanner from "./PopupBanner";
import Banner from './HomePage/HomeBannerSection/Banner';

// 🔥 Lazy loaded components (performance optimization)
const Association = lazy(() => import('./Association'));
const TrainingEvents = lazy(() => import('./HomePage/TrainingSection/TrainingEvents'));
const TeensEvents = lazy(() => import('./HomePage/TeenSection/TeensEvents'));
const Career = lazy(() => import('./Career'));
const Learners = lazy(() => import('./HomePage/LearnerSection/Learners'));
const Corporate = lazy(() => import('./HomePage/CorporateSection/Corporate'));
const RecentEntries = lazy(() => import('./HomePage/TrendingBlogSection/RecentEntries'));
const MeetInstructorBanner = lazy(() => import('./MeetInstructorBanner'));
const ShareKnowledgeBanner = lazy(() => import('./ShareKnowledgeBanner'));
const WhyChoose = lazy(() => import('./WhyChoose'));
const HomeFaq = lazy(() => import('./HomeFaq'));
const LimitedDeals = lazy(() => import('./HomePage/LimitedSection/LimitedDeals'));
const Trending = lazy(() => import('./HomePage/TrendingSection/Trending'));
const QueryFormWidget = lazy(() => import('./HomePage/QueryFormWidget/QueryFormWidget'));

// 🔥 Keep Banner normal (IMPORTANT for LCP performance)


export const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#upcoming-events') {
      const element = document.getElementById('upcoming-events');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Online IT Training: Get Certified, Find Your Dream Job</title>
          <meta
    name="google-site-verification"
    content="OSFzh41XFoqi1NXy_zU_2YvFyv7NRVFql8TF6PpbrsM"
  />
        <meta
          name="description"
          content="Hachion offers professional certification online training courses authored by industry experts. Learn the high in-demand skills from our experts."
        />
        <meta
          name="keywords"
          content="Online IT Courses, Software Training, Best Online IT Training Platform"
        />
        <meta property="og:title" content="Online IT Training: Get Certified, Find Your Dream Job" />
        <meta property="og:description" content="Learn online with the best courses at Hachion." />
        <meta property="og:image" content="/Hachion-logo.png" />
        <link rel="canonical" href="https://www.hachion.co/" />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {`
         {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hachion",
  "url": "https://www.hachion.co/",
  "logo": "https://www.hachion.co/static/media/logo.01fbce12140022ec183e.webp",
  "description": "Hachion offers industry-ready online IT courses with certification and complete job assistance.",
  "telephone": "+1-732-485-2499",
  "email": "trainings@hachion.co",

  "address": {
    "@type": "PostalAddress",
    "streetAddress": "601 Voyage Trce",
    "addressLocality": "Leander",
    "addressRegion": "TX",
    "postalCode": "78641",
    "addressCountry": "US"
  },

  "sameAs": [
    "https://www.facebook.com/hachion.official/",
    "https://www.instagram.com/hachion.official/",
    "https://www.linkedin.com/company/hachion/",
    "https://www.youtube.com/@hachion.official",
    "https://x.com/hachionofficial"
  ],

  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+1-732-485-2499",
    "contactType": "customer support",
    "areaServed": "US",
    "availableLanguage": [
      "English",
      "Hindi",
      "Telugu"
    ]
  }]
}
          `}
        </script>

{/* Local Business Schema */}
<script type="application/ld+json">
{`
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.hachion.co/",
  "name": "Online IT Training: Get Certified, Find Your Dream Job",
  "image": "https://www.hachion.co/industry-recognized-it-certifications.webp",
  "url": "https://www.hachion.co",
  "telephone": "+1 732-485-2499",
  "description": "Hachion offers professional certification online training courses authored by industry experts Learn the high in demand skills from our experts.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "601 Voyage Trace",
    "addressLocality": "Leander",
    "addressRegion": "Texas",
    "postalCode": "78641",
    "addressCountry": "USA"
  }
}

`}
</script>
{/* Review Schema */}
<script type="application/ld+json">
{`
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://www.hachion.co/#organization",
  "name": "Hachion",
  "url": "https://www.hachion.co/",
  "logo": "https://www.hachion.co/static/media/logo.01fbce12140022ec183e.webp",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "reviewCount": "3"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Shimpa Sontakke"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "The sessions were very helpful for beginners. The training helped me understand technical concepts clearly with practical guidance."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Jacker Jack"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Best live online training institute for IT courses with excellent job assistance and career support."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Raju"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Hachion provides excellent learning support and knowledgeable mentors for Salesforce Admin training."
    }
  ]
}
`}
</script>
        {/* Navigation Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": "Security Operations Center",
                "description": "SOC Analyst Training",
                "url": "https://www.hachion.co/courses/security-operations-center-(soc)-analyst"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": "Agentic AI Training",
                "description": "Agentic AI Certification Course",
                "url": "https://www.hachion.co/courses/agentic-ai"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "Cyber Security Training",
                "description": "Cyber Security Certification",
                "url": "https://www.hachion.co/courses/cyber-security"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": "Data Science with Python",
                "description": "Data Science Training",
                "url": "https://www.hachion.co/courses/data-science-with-python"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": "Salesforce Admin Training",
                "description": "Salesforce Administrator Training",
                "url": "https://www.hachion.co/courses/salesforce-admin"
              }
            ]
          }
          `}
        </script>
      </Helmet>

      <div className='home-background'>
        <PopupBanner />

        <main id="main-content">
          {/* 🔥 Load Banner first for performance */}
          <Banner />

          {/* 🔥 Lazy loaded content */}
          <Suspense fallback={<div style={{ height: "200px" }} />}>
            <Association />
            <Trending />
            <TeensEvents />

            <div id="upcoming-events">
              <TrainingEvents />
            </div>

            <Corporate />
            <WhyChoose />
            <LimitedDeals />
            <MeetInstructorBanner />
            <ShareKnowledgeBanner />
            <RecentEntries />
            <Learners page="home" />
            <HomeFaq />

            {/* Optional */}
            {/* <QueryFormWidget /> */}
          </Suspense>
        </main>

        {/* Scroll button (optional - currently disabled) */}
        {/*
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
        */}
      </div>
    </>
  );
};