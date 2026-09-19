import Link from "next/link";
import Image from "next/image";
import { MdKeyboardArrowRight } from 'react-icons/md';
import './Blogs.css';
import KidsLearners from './KidsLearners';
import SummerFAQ from './SummerFAQ';
import KidsCourses from './KidsCourses';
import summerbanners from '@/assets/summerbanners.webp';
import morningkids from '@/assets/morningkids.webp';
import aftkids from '@/assets/aftkids.webp';
import flexkid from '@/assets/flexkid.webp';
import choosekid from '@/assets/choosekid.webp';
import discountkids from '@/assets/discountkids.webp';
import happykids from '@/assets/happykids.webp';
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { MdDiscount } from "react-icons/md";
import SummerRegister from './SummerRegister';
import { ImLocation2 } from "react-icons/im";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

// Server Component: the CRA original's footerRef/isSticky IntersectionObserver
// state was dead (isSticky was never read anywhere in the JSX) — dropped,
// which removes the only reason this page needed to be a Client Component.
const KidsSummer = () => {
  return (
    <div>
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Kids Summer Camp
            </li>
          </ol>
        </nav>
      </div>
      <h1 className='summer-title'>Best Summer Tech Bootcamp 2025 for Teens | Coding & Design Courses</h1>
      <Image className='kidbanner' src={summerbanners} alt='Kids Summer Banner' priority />
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
          <Image src={morningkids} alt='Morning Batch' />
          <p className='ps-text'>Morning Batch :
            <br />
            10 AM - 12 PM EST
          </p>
        </div>
        <div className='program-schedule'>
          <Image src={aftkids} alt='Afternoon Batch' />
          <p className='ps-text'>Afternoon Batch :
            <br />
            2 PM - 4 PM EST
          </p>
        </div>
        <div className='program-schedule'>
          <Image src={flexkid} alt='Flex Batch' />
          <p className='ps-text'>Flexible Options :
            <br />
            Choose 4-week or 6-week tracks
          </p>
        </div>
      </div>

      <h2 className='summer-title'>Why Choose Us?</h2>
      <div className='summer-part'>
        <Image className='choose-img' src={choosekid} alt='Why Choose Us' />
        <ol>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Industry-Aligned Curriculum - Learn tools professionals use daily</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Certification - Boost college applications & resumes</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> 1:1 Mentorship - Dedicated instructor support</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Fun & Interactive - No boring lectures!</li>
        </ol>
      </div>

      <KidsCourses />

      <h2 className='summer-title'>Special Perks</h2>
      <div className='summer-part'>
        <ol>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Early Bird Discount: 10% off until May 30</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Sibling/Friend Group Discount: Extra 5% off</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Free Demo Class: June 1st - Parents welcome!</li>
          <li className='choose-points'><span className='point-icon'><MdDiscount /></span> Certificate + Project Showcase (Share on LinkedIn!)</li>
        </ol>
        <Image className='discount-img' src={discountkids} alt='Discounts Img' />
      </div>

      <SummerFAQ />

      <h2 className='summer-title'>Why Our Bootcamp?</h2>
      <div className='summer-part'>
        <Image className='discount-img' src={happykids} alt='Why Our Bootcamp' />
        <ol>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Top-Rated Instructors - Silicon Valley-trained mentors</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Project-Based Learning - Build real apps/websites</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> Career Prep - Resume workshop & tech showcase</li>
          <li className='choose-points'><span className='point-icon'><TbArrowBadgeRightFilled /></span> 100% Satisfaction - Join 1,000+ happy students!</li>
        </ol>
      </div>

      <KidsLearners page="course" />
      <SummerRegister />
    </div>
  );
};

export default KidsSummer;
