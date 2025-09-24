import React, { useEffect , useState } from 'react';
import Banner from './Banner';
import Association from './Association';
import TrainingEvents from './TrainingEvents';
import Trending from './Trending';
import TeensEvents from './TeensEvents';
import Career from './Career';
import Learners from './Learners';
import Footer from './Footer';
import Corporate from './Corporate';
import StickyBar from './StickyBar';
import { Helmet } from "react-helmet-async";
import PopupBanner from "./PopupBanner";
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import RecentEntries from './RecentEntries';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import MeetInstructorBanner from './MeetInstructorBanner';
import ShareKnowledgeBanner from './ShareKnowledgeBanner';
import WhyChoose from '././WhyChoose';
import HomeFaq from './HomeFaq';
import LimitedDeals from './LimitedDeals';

export const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
   const location = useLocation();
  useEffect(() => {
    if (location.hash === '#upcoming-events') {
      const element = document.getElementById('upcoming-events');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  
        useEffect(() => {
          window.scrollTo(0, 0);
        }, []);
      
        useEffect(() => {
          const handleScroll = () => {
            if (window.scrollY > 300) {
              setShowScrollButton(true);
            } else {
              setShowScrollButton(false);
            }
          };
      
          window.addEventListener("scroll", handleScroll);
          return () => window.removeEventListener("scroll", handleScroll);
        }, []);
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
</Helmet>
   <div className='home-background'>
  <PopupBanner/>
<Topbar/>
<NavbarTop/>
<Banner/>
<Association/>
<Trending/>
<TeensEvents/>
<div id="upcoming-events">
<TrainingEvents/>
</div>
<Corporate/>
<WhyChoose/>
<LimitedDeals/>
<MeetInstructorBanner/>
<ShareKnowledgeBanner/>
{/* <Career/> */}
<Learners page="home"/>
 <RecentEntries />
<HomeFaq/>
<Footer/>
{/* {showScrollButton && (
              <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )} */}
</div>
<StickyBar/>

    </>
  )
}