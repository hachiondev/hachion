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

export const Home = () => {
  return (
    <>
   <div className='home-background'>
<Topbar/>
<NavbarTop/>
<Banner/>
<Association/>
<TrainingEvents/>
<Trending/>
<Corporate/>
<Career/>
<Learners/>

<Footer/>
</div>
<StickyBar/>
    </>
  )
}
