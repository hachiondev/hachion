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

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>Hachion - Your Learning Partner</title>
        <meta name="description" content="Hachion offers professional certification online training courses authored by industry experts. Learn the high in-demand skills from our experts." />
        <meta name="keywords" content="Online IT Courses, Software Training, Best Online IT Training Platform" />
        <meta property="og:title" content="Online IT Training: Get Certified, Find Your Dream Job" />
        <meta property="og:description" content="Learn online with the best courses at Hachion." />
        <meta property="og:image" content="/Hachion-logo.png" />
      </Helmet>
   <div className='home-background'>
  
<Topbar/>
<NavbarTop/>
<Banner/>
<Association/>
<TrainingEvents/>
<Trending/>
<Corporate/>
<Career/>
{/* <Learners/> */}
<Learners page="home"/>

<Footer/>
</div>
<StickyBar/>

    </>
  )
}