import React, { useEffect, useRef, useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import {MdKeyboardArrowRight} from 'react-icons/md';
import './Blogs.css';
import KidsLearners from './KidsLearners';
import SummerFAQ from './SummerFAQ';
import KidsCourses from './KidsCourses';
import summerbanners from '../../Assets/summerbanners.jpeg';
import morningkids from '../../Assets/morningkids.jpeg';
import aftkids from '../../Assets/aftkids.jpeg';
import flexkid from '../../Assets/flexkid.jpeg';
import choosekid from '../../Assets/choosekid.jpeg';
import discountkids from '../../Assets/discountkids.jpeg';
import happykids from '../../Assets/happykids.jpeg';
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { MdDiscount } from "react-icons/md";
import SummerRegister from './SummerRegister';
import { ImLocation2 } from "react-icons/im";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

const KidsSummer = () => {
      const footerRef = useRef(null);
      const [isSticky, setIsSticky] = useState(false);

      useEffect(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsSticky(false);
                }
              });
            },
            { rootMargin: '0px', threshold: 0.1 }
          );
          if (footerRef.current) {
            observer.observe(footerRef.current);
          }
          return () => {
            if (footerRef.current) {
              observer.unobserve(footerRef.current);
            }
          };
        }, []);
  return (
    <div>
      <Topbar />
            <NavbarTop />
            <div className='blogs-header'>
                  <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
                        <li className="breadcrumb-item active" aria-current="page">
                         Kids Summer Camp
                        </li>
                      </ol>
                    </nav>
                    </div>
            <h1 className='summer-title'>Best Summer Tech Bootcamp 2025 for Teens | Coding & Design Courses</h1>
            <img className='kidbanner' src={summerbanners} alt='Kids Summer Banner' />
<div className="summer-part">
    <div className="info-box"><span className="daily-icon"><ImLocation2 /></span><strong>Location:</strong><br />Online & In-Person (US-Based)</div>
    <div className="info-box"><span className="daily-icon"><IoCalendarNumberSharp /></span><strong>Duration:</strong><br />4-6 Weeks (June-August)</div>
    <div className="info-box"><span className="daily-icon"><MdAccessTime /></span><strong>Daily:</strong><br />2-Hour Interactive Sessions</div>
  </div>
            
            <h2 className='summer-title'>Top-Rated Summer Tech Program</h2>
            <div className='summer-part'>
          <p className='summer-text'>Give your child a head start in tech this summer! Our bootcamp teaches real-world tech skills through project-based learning, designed for beginners to advanced learners.</p>
          </div>

          <h2 className='summer-title'>Program Schedule</h2>
          <div className='summer-part'>
          <div className='program-schedule'>
            <img src={morningkids} alt='Morning Batch' />
            <p className='ps-text'>Morning Batch :
                <br/>
                10 AM - 12 PM EST
            </p>
          </div>
          <div className='program-schedule'>
            <img src={aftkids} alt='Afternoon Batch' />
            <p className='ps-text'>Afternoon Batch :
                <br/>
                 2 PM - 4 PM EST
            </p>
          </div>
          <div className='program-schedule'>
            <img src={flexkid} alt='Flex Batch' />
            <p className='ps-text'>Flexible Options :
                <br/>
                 Choose 4-week or 6-week tracks
            </p>
          </div>
          </div>

          <h2 className='summer-title'>Why Choose Us?</h2>
            <div className='summer-part'>
            <img className='choose-img' src={choosekid} alt='Why Choose Us' />
            <ol>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Industry-Aligned Curriculum - Learn tools professionals use daily</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Certification - Boost college applications & resumes</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> 1:1 Mentorship - Dedicated instructor support</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Fun & Interactive - No boring lectures!</li>
          </ol>
          </div>

          <KidsCourses/>

          <h2 className='summer-title'>Special Perks</h2>
            <div className='summer-part'>
            <ol>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Early Bird Discount: 10% off until May 30</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Sibling/Friend Group Discount: Extra 5% off</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Free Demo Class: June 1st - Parents welcome!</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Certificate + Project Showcase (Share on LinkedIn!)</li>
          </ol>
          <img className='discount-img' src={discountkids} alt='Discounts Img' />
          </div>

          <SummerFAQ/>

          <h2 className='summer-title'>Why Our Bootcamp?</h2>
            <div className='summer-part'>
                <img className='discount-img' src={happykids} alt='Why Our Bootcamp' />
            <ol>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Top-Rated Instructors - Silicon Valley-trained mentors</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Project-Based Learning - Build real apps/websites</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Career Prep - Resume workshop & tech showcase</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> 100% Satisfaction - Join 1,000+ happy students!</li>
          </ol>
          </div>

          <KidsLearners page="course"/>
          <SummerRegister/>
             
          <div ref={footerRef}>
            <Footer />
          </div>
          <StickyBar />
    </div>
  )
}

export default KidsSummer
