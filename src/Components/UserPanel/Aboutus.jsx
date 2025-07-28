import React, { useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import aboutUsBanner from '../../Assets/AboutusBanner (2).png';
import { MdKeyboardArrowRight } from 'react-icons/md';
import aboutUsSider from '../../Assets/aboutussider.png';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { PiStudentLight } from 'react-icons/pi';
import { MdContacts } from 'react-icons/md';
import { GrDocumentVerified } from 'react-icons/gr';
import visionImage from '../../Assets/OurVision.png';
import Learners from './Learners';
import StickyBar from './StickyBar';
import Footer from './Footer';
import FlexibleLearning from '../../Assets/FlexibleLearning.png';
import Success from '../../Assets/Success.png';
import Assistance from '../../Assets/Assistance.png';
import careerSupport from '../../Assets/careerSupport.png';
import handsOnLearning from '../../Assets/handsonLearning.png';
import onlineTeaching from '../../Assets/onlineTeaching.png';

const statistics = [
  {
    icon: <HiOutlineUserGroup className='story-icon' aria-hidden="true" />,
    number: '88,000',
    label: 'Foreign Followers',
  },
  {
    icon: <PiStudentLight className='story-icon' aria-hidden="true" />,
    number: '4789',
    label: 'Students Enrolled',
  },
  {
    icon: <MdContacts className='story-icon' aria-hidden="true" />,
    number: '96',
    label: 'Certified Teachers',
  },
  {
    icon: <GrDocumentVerified className='story-icon' aria-hidden="true" />,
    number: '488',
    label: 'Complete Courses',
  },
];

const features = [
  {
    img: FlexibleLearning,
    title: "Flexible Learning",
    desc: "Online Training accessible at your convenience",
    alt: "Flexible Learning Icon"
  },
  {
    img: onlineTeaching,
    title: "Expert Instructor",
    desc: "Industry professionals delivering valuable content",
    alt: "Expert Instructor Icon"
  },
  {
    img: handsOnLearning,
    title: "Hands-On Learning",
    desc: "Practical classes with easy-to-follow material",
    alt: "Hands-On Learning Icon"
  },
  {
    img: careerSupport,
    title: "Career Support",
    desc: "Assistance with CVs, interviews, and job placement",
    alt: "Career Support Icon"
  },
  {
    img: Assistance,
    title: "24/7 Support",
    desc: "Continuous support through online chat and phone",
    alt: "24/7 Support Icon"
  },
  {
    img: Success,
    title: "Proven Success",
    desc: "Positive feedback from participants and successful outcomes",
    alt: "Proven Success Icon"
  }
];

const StatisticCard = ({ icon, number, label }) => (
  <div className='story-div'>
    {icon}
    <p className='number'>{number}</p>
    <p className='story-content'>{label}</p>
  </div>
);

const FeatureCard = ({ img, title, desc, alt }) => (
  <div className='about-us-div-content'>
    <img src={img} alt={alt} />
    <h6>{title}</h6>
    <p>{desc}</p>
  </div>
);

const Aboutus = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='about-banner'>
        <img src={aboutUsBanner} alt='About Us Banner' />
      </div>
      <main className='about-us'>
        <div className='blogs-header'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {/* If using React Router, use Link instead of <a> */}
                {/* <Link to="/">Home</Link> <MdKeyboardArrowRight /> */}
                <a href="/">Home</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                About Us
              </li>
            </ol>
          </nav>
        </div>
        <section className='about-us-content'>
          <h1 className='about-us-heading'>About Hachion</h1>
          <div className='about-us-top'>
            <p className='about-us-left-content'>
              {/* --- Replace below with your actual full About Us text --- */}
              Hachion is an organization founded to bridge the gap between graduates and the corporate world. Whether for entry-level or senior roles, the industry has transformed, demanding both practical skills and theoretical knowledge from prospective employees. Hachion’s mission is to empower learners with quality education, ensuring their readiness for real-world challenges and successful integration into professional environments.
            </p>
            <img src={aboutUsSider} alt='About Hachion Illustration' />
          </div>
          <p className='about-us-left-content'>
            {/* --- Replace below with your actual full Placement Services text --- */}
            Our placement services provide comprehensive, end-to-end support tailored to client requirements, helping them find the right talent efficiently. We strive to make the recruitment process seamless for organizations and rewarding for candidates, saving valuable time and resources for all stakeholders.
          </p>
          
          <h2 className='about-us-heading'>Our Story</h2>
          <div className='our-story'>
            {statistics.map((stat, idx) => (
              <StatisticCard key={idx} {...stat} />
            ))}
          </div>

          <h2 className='about-us-heading'>Our Vision</h2>
          <div className='about-us-top'>
            <p className='about-us-left-content'>
              {/* --- Replace below with your actual Vision text --- */}
              Our vision is to synergize the “right talent” with the “right requirement” and ensure quality manpower is constructively and appropriately channelized. We aim to help talented and aspiring individuals realize their full potential and match them with organizations seeking the best.
            </p>
            <img src={visionImage} alt='Hachion Vision' />
          </div>

          <h2 className='about-us-heading'>What We Do</h2>
          <p className='about-us-left-content'>
            {/* --- Replace below with your actual What We Do text --- */}
            We offer a wide range of online courses to both organizations and individuals. Our platform, www.hachion.co, features over 100+ interactive online courses. Our real-time experts, each with over 10 years of IT experience, are passionate about sharing industry-relevant knowledge to boost your career prospects. We believe in practical, hands-on learning and continuous support for every learner.
          </p>

          <h2 className='about-us-heading'>Why Choose Hachion?</h2>
          <p className='about-us-left-content'>
            Hachion offers flexible, instructor-led online training programs that let you learn anytime, anywhere. Our expert instructors, practical curriculum, and dedicated support team ensure a rewarding learning journey, helping you achieve your professional goals.
          </p>
          <div className='about-us-div'>
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </section>
      </main>
      <Learners page="about" />
      <Footer />
      <StickyBar />
    </>
  );
}

export default Aboutus;