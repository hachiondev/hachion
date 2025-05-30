import React from 'react'
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Banner from './Banner';
import Association from './Association';
import TrainingEvents from './TrainingEvents';
import Trending from './Trending';
import Career from './Career';
import Learners from './Learners';
import Footer from './Footer';
import Corporate from './Corporate';
import StickyBar from './StickyBar';
import { Helmet } from "react-helmet-async";
import PopupBanner from "./PopupBanner";

export const Home = () => {
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
<Trending/>
<TrainingEvents/>
<Corporate/>
<Career/>
<Association/>
<Learners page="home"/>

<Footer/>
</div>
<StickyBar/>

    </>
  )
}