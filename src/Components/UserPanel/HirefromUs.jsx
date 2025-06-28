import React, { useEffect , useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { FaArrowUp } from 'react-icons/fa';
import banner from '../../Assets/hirebanner.png';
import Typewriter from 'typewriter-effect';

const HirefromUs = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
      useEffect(() => {
        console.log("Privacy component mounted. Scrolling to top...");
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
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div>
      <div className='home-background'>
      <Topbar/>
      <NavbarTop/>
      <div className='hirebackground'>
              <div className='hire-banner'>
                <div className='hire-content'>
                <h1 className='hire-title'>
                <span className='hire-title-span'>Hachion</span>
                <Typewriter
                    options={{
                    strings: [
                        'is built for smarter hiring.',
                        'is your hiring co-pilot.'
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 20,
                    delay: 100,
                    pauseFor: 3000,
                    }}
                />
                </h1>
                <p className='hire-title-text'>Hachion helps you hire skilled talent faster and more affordably.</p>
                <button className='post-job-button'>Post Job</button>
                </div>
                <img className='hire-banner-img' src={banner} alt='Hire banner' />
                <div>
              </div>
              </div>
              </div>
      <Footer/>
      {showScrollButton && (
              <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )}
      </div>
      <StickyBar/>
    </div>
  )
}

export default HirefromUs
