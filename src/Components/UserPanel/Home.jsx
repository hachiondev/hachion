import React, { useEffect , useState } from 'react'
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
import { FaArrowUp } from 'react-icons/fa';

export const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

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
  
    // Scroll to top function
    const scrollToTop = () => {
      console.log("Scroll to top clicked!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
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

{/* Scroll to Top Button */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
      
<StickyBar/>
    </>
  )
}
