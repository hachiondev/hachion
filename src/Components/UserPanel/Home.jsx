import React, { useEffect, useState } from 'react';
import Association from './Association';
import TrainingEvents from './HomePage/TrainingSection/TrainingEvents';
import TeensEvents from './HomePage/TeenSection/TeensEvents';
import Career from './Career';
import Learners from './HomePage/LearnerSection/Learners';
import Corporate from './HomePage/CorporateSection/Corporate';
import { Helmet } from "react-helmet-async";
import PopupBanner from "./PopupBanner";
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import RecentEntries from './HomePage/TrendingBlogSection/RecentEntries';
import MeetInstructorBanner from './MeetInstructorBanner';
import ShareKnowledgeBanner from './ShareKnowledgeBanner';
import WhyChoose from '././WhyChoose';
import HomeFaq from './HomeFaq';
import LimitedDeals from './HomePage/LimitedSection/LimitedDeals';
import Banner from './HomePage/HomeBannerSection/Banner';
import Trending from './HomePage/TrendingSection/Trending';
import QueryFormWidget from './HomePage/QueryFormWidget/QueryFormWidget';

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

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Online IT Training: Get Certified, Find Your Dream Job</title>
        <meta name="description" content="Hachion offers professional certification online training courses authored by industry experts. Learn the high in-demand skills from our experts." />
        <meta name="keywords" content="Online IT Courses, Software Training, Best Online IT Training Platform" />
        <meta property="og:title" content="Online IT Training: Get Certified, Find Your Dream Job" />
        <meta property="og:description" content="Learn online with the best courses at Hachion." />
        <meta property="og:image" content="/Hachion-logo.png" />
        <link rel="canonical" href="https://www.hachion.co/" />
        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Hachion",
        "url": "https://www.hachion.co",
        "logo": "https://www.hachion.co/Hachion-logo.png",
        "sameAs": [
        "https://www.facebook.com/hachion.co",
        "https://x.com/hachion_co",
        "https://www.linkedin.com/company/hachion",
        "https://www.instagram.com/hachion_trainings",
        "https://www.quora.com/profile/Hachion-4",
        "https://www.youtube.com/@hachion"
      ]
      }
    `}
        </script>
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
     "url": "https://www.hachion.co/coursedetails/security-operations-center-(soc)-analyst"
   },
   {
     "@type": "SiteNavigationElement",
     "position": 2,
     "name": "Agentic AI Training",
     "description": "Agentic AI Certification Course",
     "url": "https://www.hachion.co/coursedetails/agentic-ai"
   },
   {
     "@type": "SiteNavigationElement",
     "position": 3,
     "name": "Cyber Security Training",
     "description": "Cyber Security Certification",
     "url": "https://www.hachion.co/coursedetails/cyber-security"
   },
   {
     "@type": "SiteNavigationElement",
     "position": 4,
     "name": "Data Science with Python",
     "description": "Data Science Training",
     "url": "https://www.hachion.co/coursedetails/data-science-with-python"
   },
   {
     "@type": "SiteNavigationElement",
     "position": 5,
     "name": "Salesforce Admin Training",
     "description": "Salesforce Administrator Training",
     "url": "https://www.hachion.co/coursedetails/salesforce-admin"
   }
 ]
}
`}
</script>
      </Helmet>
      <div className='home-background'>
        <PopupBanner />
        <main id="main-content">
          <Banner />
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
          {/* <Career/> */}
          <RecentEntries />
          <Learners page="home" />
          <HomeFaq />
        </main>
        {/* Query Form Widget - Fixed at bottom right (similar to screenshot) */}
        {/* { <QueryFormWidget /> } */}
        {/* {showScrollButton && (
              // <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )} */}
      </div>

    </>
  )
}