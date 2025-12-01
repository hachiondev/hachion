import React, { useEffect , useState, useRef } from 'react';
import PostJob from './PostJob';
import { FaArrowUp } from 'react-icons/fa';
import banner from '../../Assets/hirebanner.webp';
import whyhachion from '../../Assets/whyhire.webp';
import collabration from '../../Assets/hirecollab.webp';
import companies from '../../Assets/itlogos.webp';
import Typewriter from 'typewriter-effect';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const HirefromUs = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const postJobRef = useRef(null);
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
                <button className='post-job-button' onClick={() => postJobRef.current?.scrollIntoView({ behavior: 'smooth' })}>Post Job</button>
                </div>
                <img className='hire-banner-img' src={banner} alt='Hire banner' fetchpriority="high"/>
                <div>
              </div>
              </div>
              </div>

            <h2 className='hire-sub-title'>Why Hire from Hachion?</h2>
            <div className='hire-part'>
            <ol className='points'>
          <li className='hire-points'><span className='point-icon'><IoMdCheckmarkCircleOutline /></span> <div><strong>Zero-Cost Hiring: </strong>Hire pre-trained professionals without bearing any recruitment fees.</div></li>
          <li className='hire-points'><span className='point-icon'><IoMdCheckmarkCircleOutline /></span> <div><strong>Pre-Vetted, Job-Ready Talent: </strong>Candidates come equipped with practical, real-world project experience.</div></li>
          <li className='hire-points'><span className='point-icon'><IoMdCheckmarkCircleOutline /></span> <div><strong>Dedicated Hiring Support: </strong>From candidate sourcing to seamless onboarding, Hachion provides hands-on guidance throughout the process.</div></li>
          <li className='hire-points'><span className='point-icon'><IoMdCheckmarkCircleOutline /></span> <div><strong>Wide Tech Coverage: </strong>Access professionals skilled in 150+ in-demand domains like DevOps, Cloud, Data Science, QA, and more.</div></li>
          <li className='hire-points'><span className='point-icon'><IoMdCheckmarkCircleOutline /></span> <div><strong>All-Year Talent Availability: </strong>A consistent pipeline of qualified candidates ready when you are.</div></li>
          </ol>
          <img className='hire-img' src={whyhachion} alt='Why hire from Hachion' loading="lazy"/>
          </div>

          <h2 className='hire-sub-title'>Top IT firms collaborate with Hachion</h2>
            <div className='hire-part'>
          <img className='hire-collab' src={collabration} alt='Collabration' loading="lazy"/>  
          <img className='hire-logo' src={companies} alt='IT Logos' loading="lazy"/>
          </div>
          <div ref={postJobRef} style={{marginTop: 20}}>
          <PostJob />
        </div>
      </div>
    </div>
  )
}

export default HirefromUs
