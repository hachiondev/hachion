// import React, { useEffect } from 'react';
// import Topbar from './Topbar';
// import NavbarTop from './NavbarTop';
// import './Blogs.css';
// import aboutUsBanner from '../../Assets/AboutusBanner (2).png';
// import { MdKeyboardArrowRight } from 'react-icons/md';
// import aboutUsSider from '../../Assets/aboutussider.png';
// import { HiOutlineUserGroup } from 'react-icons/hi2';
// import { PiStudentLight } from 'react-icons/pi';
// import { MdContacts } from 'react-icons/md';
// import { GrDocumentVerified } from 'react-icons/gr';
// import visionImage from '../../Assets/OurVision.png';
// import Learners from './Learners';
// import StickyBar from './StickyBar';
// import Footer from './Footer';
// import FlexibleLearning from '../../Assets/FlexibleLearning.png';
// import Success from '../../Assets/Success.png';
// import Assistance from '../../Assets/Assistance.png';
// import careerSupport from '../../Assets/careerSupport.png';
// import handsOnLearning from '../../Assets/handsonLearning.png';
// import onlineTeaching from '../../Assets/onlineTeaching.png';

// const statistics = [
//   {
//     icon: <HiOutlineUserGroup className='story-icon' aria-hidden="true" />,
//     number: '88,000',
//     label: 'Foreign Followers',
//   },
//   {
//     icon: <PiStudentLight className='story-icon' aria-hidden="true" />,
//     number: '4789',
//     label: 'Students Enrolled',
//   },
//   {
//     icon: <MdContacts className='story-icon' aria-hidden="true" />,
//     number: '96',
//     label: 'Certified Teachers',
//   },
//   {
//     icon: <GrDocumentVerified className='story-icon' aria-hidden="true" />,
//     number: '488',
//     label: 'Complete Courses',
//   },
// ];

// const features = [
//   {
//     img: FlexibleLearning,
//     title: "Flexible Learning",
//     desc: "Online Training accessible at your convenience",
//     alt: "Flexible Learning Icon"
//   },
//   {
//     img: onlineTeaching,
//     title: "Expert Instructor",
//     desc: "Industry professionals delivering valuable content",
//     alt: "Expert Instructor Icon"
//   },
//   {
//     img: handsOnLearning,
//     title: "Hands-On Learning",
//     desc: "Practical classes with easy-to-follow material",
//     alt: "Hands-On Learning Icon"
//   },
//   {
//     img: careerSupport,
//     title: "Career Support",
//     desc: "Assistance with CVs, interviews, and job placement",
//     alt: "Career Support Icon"
//   },
//   {
//     img: Assistance,
//     title: "24/7 Support",
//     desc: "Continuous support through online chat and phone",
//     alt: "24/7 Support Icon"
//   },
//   {
//     img: Success,
//     title: "Proven Success",
//     desc: "Positive feedback from participants and successful outcomes",
//     alt: "Proven Success Icon"
//   }
// ];

// const StatisticCard = ({ icon, number, label }) => (
//   <div className='story-div'>
//     {icon}
//     <p className='number'>{number}</p>
//     <p className='story-content'>{label}</p>
//   </div>
// );

// const FeatureCard = ({ img, title, desc, alt }) => (
//   <div className='about-us-div-content'>
//     <img src={img} alt={alt} />
//     <h6>{title}</h6>
//     <p>{desc}</p>
//   </div>
// );

// const Aboutus = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//       <Topbar />
//       <NavbarTop />
//       <div className='about-banner'>
//         <img src={aboutUsBanner} alt='About Us Banner' />
//       </div>
//       <main className='about-us'>
//         <div className='blogs-header'>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 {/* If using React Router, use Link instead of <a> */}
//                 {/* <Link to="/">Home</Link> <MdKeyboardArrowRight /> */}
//                 <a href="/">Home</a> <MdKeyboardArrowRight />
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 About Us
//               </li>
//             </ol>
//           </nav>
//         </div>
//         <section className='about-us-content'>
//           <h1 className='about-us-heading'>About Hachion</h1>
//           <div className='about-us-top'>
//             <p className='about-us-left-content'>
//               {/* --- Replace below with your actual full About Us text --- */}
//               Hachion is an organization founded to bridge the gap between graduates and the corporate world. Whether for entry-level or senior roles, the industry has transformed, demanding both practical skills and theoretical knowledge from prospective employees. Hachion’s mission is to empower learners with quality education, ensuring their readiness for real-world challenges and successful integration into professional environments.
//             </p>
//             <img src={aboutUsSider} alt='About Hachion Illustration' />
//           </div>
//           <p className='about-us-left-content'>
//             {/* --- Replace below with your actual full Placement Services text --- */}
//             Our placement services provide comprehensive, end-to-end support tailored to client requirements, helping them find the right talent efficiently. We strive to make the recruitment process seamless for organizations and rewarding for candidates, saving valuable time and resources for all stakeholders.
//           </p>
          
//           <h2 className='about-us-heading'>Our Story</h2>
//           <div className='our-story'>
//             {statistics.map((stat, idx) => (
//               <StatisticCard key={idx} {...stat} />
//             ))}
//           </div>

//           <h2 className='about-us-heading'>Our Vision</h2>
//           <div className='about-us-top'>
//             <p className='about-us-left-content'>
//               {/* --- Replace below with your actual Vision text --- */}
//               Our vision is to synergize the “right talent” with the “right requirement” and ensure quality manpower is constructively and appropriately channelized. We aim to help talented and aspiring individuals realize their full potential and match them with organizations seeking the best.
//             </p>
//             <img src={visionImage} alt='Hachion Vision' />
//           </div>

//           <h2 className='about-us-heading'>What We Do</h2>
//           <p className='about-us-left-content'>
//             {/* --- Replace below with your actual What We Do text --- */}
//             We offer a wide range of online courses to both organizations and individuals. Our platform, www.hachion.co, features over 100+ interactive online courses. Our real-time experts, each with over 10 years of IT experience, are passionate about sharing industry-relevant knowledge to boost your career prospects. We believe in practical, hands-on learning and continuous support for every learner.
//           </p>

//           <h2 className='about-us-heading'>Why Choose Hachion?</h2>
//           <p className='about-us-left-content'>
//             Hachion offers flexible, instructor-led online training programs that let you learn anytime, anywhere. Our expert instructors, practical curriculum, and dedicated support team ensure a rewarding learning journey, helping you achieve your professional goals.
//           </p>
//           <div className='about-us-div'>
//             {features.map((feature, idx) => (
//               <FeatureCard key={idx} {...feature} />
//             ))}
//           </div>
//         </section>
//       </main>
//       <Learners page="about" />
//       <Footer />
//       <StickyBar />
//     </>
//   );
// }

// export default Aboutus;

import React, { useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import Benefit from '../../Assets/about1.webp';
import whatwedo from '../../Assets/about3.webp';
import founder from '../../Assets/founder.webp';
import data1 from '../../Assets/foreign.webp';
import data2 from '../../Assets/studentenroll.webp';
import data3 from '../../Assets/certteacher.webp';
import data4 from '../../Assets/coursecomplete.png';
import feat1 from '../../Assets/flex-icon.png';
import feat2 from '../../Assets/expert-instructor-icon.png';
import feat3 from '../../Assets/learn-icon.webp';
import feat4 from '../../Assets/career-icon.webp';
import feat5 from '../../Assets/247-icon.webp';
import feat6 from '../../Assets/success-icon.webp';
import Learners from './Learners';
import StickyBar from './StickyBar';
import Footer from './Footer';
import { TiTick } from "react-icons/ti";
import { TbSlashes } from "react-icons/tb";
import HomeFaq from './HomeFaq';
import { useNavigate } from "react-router-dom";

const statistics = [
  {
    image: data1 ,
    number: '200K',
    label: 'FOREIGN FOLLOWERS',
    alt: 'FOREIGN FOLLOWERS',
  },
  {
    image: data2,
    number: '50K+',
    label: 'STUDENTS ENROLLED',
    alt: 'STUDENTS ENROLLED',
  },
  {
    image: data3,
    number: '1000+',
    label: 'CERTIFIED TEACHERS',
    alt: 'CERTIFIED TEACHERS',
  },
  {
    image: data4,
    number: '45K+',
    label: 'COMPLETE COURSES',
    alt: 'COMPLETE COURSES',
  },
];

const featurecard = [
  {
    img: feat1,
    title: "Flexible Learning",
    desc: "Learn anytime, anywhere with live online classes.",
    alt: "Flexible Learning Icon"
  },
  {
    img: feat2,
    title: "Expert Trainers",
    desc: "Train with certified professionals from the industry.",
    alt: "Expert Trainers Icon"
  },
  {
    img: feat3,
    title: "Hands-On Practice",
    desc: "Gain real skills through practical, project-based learning.",
    alt: "Hands-On Practice Icon"
  },
  {
    img: feat4,
    title: "Career Support",
    desc: "Get resume, interview, and placement assistance.",
    alt: "Career Support Icon"
  },
  {
    img: feat5,
    title: "24/7 Assistance",
    desc: "Receive round-the-clock learner support.",
    alt: "24/7 Assistance Icon"
  },
  {
    img: feat6,
    title: "Proven Results",
    desc: "Thousands of learners placed in top global companies.",
    alt: "Proven Results Icon"
  }
];

const StatisticCard = ({ image, number, label, alt }) => (
  <div className='expert-content'>
    <img src={image} alt={alt} />
    <div className='expert-sub-content'>
    <div className='about-number'>{number}</div>
    <p className='about-label'>{label}</p>
  </div>
  </div>
);

const FeatureCard = ({ img, title, desc, alt }) => (
  <div className='about-feat-card'>
    <img src={img} alt={alt} />
    <div className='about-feat-title'>{title}</div>
    <p className='about-feat-lable'>{desc}</p>
  </div>
);

const Aboutus = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="instructor-profile-banner container">
              <h1 className="instructor-profile-title">ABOUT US</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="instructor-breadcrumb-item">
                    <a href="/">Home</a> <TbSlashes color="#00aeef" />
                  </li>
                  <li className="instructor-breadcrumb-item active" aria-current="page">
                    About us
                  </li>
                </ol>
              </nav>
            </div>
        <div className="instructor-banner container">
      {/* Left side content */}
      <img
        className="corporate-image"
        src={Benefit}
        alt="Benefit banner"
        fetchpriority="high"
      />
      {/* Right side image */}
      <div className="home-content">
        <h2 className="about-head">Hachion: Bridging Education and Industry Success</h2>
        <p className="instructor-title-text">
          At Hachion, we empower learners to turn their education into real-world success. Through hands-on training, expert mentorship, and career-focused programs, we prepare you for opportunities in today’s global job market.
        </p>
          <div className="expert-points">
            <div>
            <h3 className="key-title-text">
             Our Mission
            </h3>
          <p className="instructor-title-text">
            To build industry-ready professionals by delivering practical learning experiences that boost confidence, skills, and employability.
            </p>
            </div>
            <div>
            <h3 className="key-title-text">
             Our Vision
            </h3>
          <p className="instructor-title-text">
            To be the most trusted learning partner connecting talent with opportunity, helping every learner become career-ready and future-focused.
            </p>
            </div>
            </div>
          <button className="home-start-button" onClick={() => navigate("/coursedetails")}>Start Learning Today</button>
        </div>
    </div>
     <div className='about-statistics container'>
            {statistics.map((stat, idx) => (
              <StatisticCard key={idx} {...stat} />
            ))}
          </div>

        <div className="home-faq-banner container">
              <h2 className="aboutus-feat-title">Why Choose Hachion?</h2>
               <p className="learner-title-tag">
                 At Hachion, we make learning simple, flexible, and career-focused — helping you grow with real-world skills and expert support.
                  </p>
              <div className="about-card-row">
            {featurecard.map((inst, idx) => (
              <FeatureCard key={idx} {...inst} />
            ))}
          </div>
          </div>
      <div className="instructor-banner container">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="about-head">What We Do ?</h2>
        <p className="instructor-title-text">
        Hachion helps learners gain the practical, job-ready skills employers look for.
        </p>
          <div className='expert-points'>
                      <TiTick  className="about-right-icon" />
                    <p className="expert-point-details">
                      100+ Online Courses for individuals and teams
                      </p>
                      </div>
                      <div className='expert-points'>
                        <TiTick  Circle className="about-right-icon" />
                    <p className="expert-point-details">
                      Industry-Relevant Training for real-world careers
                      </p>
                      </div>
                      <div className='expert-points'>
                        <TiTick  className="about-right-icon" />
                    <p className="expert-point-details">
                      Top Programs: QA Testing, DevOps, AWS, Tableau, Power BI, Business Analysis, Salesforce, Hadoop
                      </p>
                      </div>
        </div>
        {/* Right side image */}
        <img
        className="corporate-image"
        src={whatwedo}
        alt="what we do banner"
        fetchpriority="high"
      />
    </div>
     <Learners page="about" />

     {/* <div className="home-faq-banner container">
              <h2 className="aboutus-feat-title">Meet our team</h2>
               <p className="learner-title-tag">
                 A multidisciplinary crew of instructors, product thinkers, and support champions powering your learning journey.
                  </p>
          </div> */}

     <div className="instructor-banner container">
      {/* Left side content */}
        <div className="about-content">
        <h2 className="about-head">Meet the Founder</h2>
        <p className="about-partner">
             Name :<span>Lakshmi Prasad</span>
            </p>
            <p className="about-partner">
             Designation :<span>Managing Partner</span>
            </p>
        <p className="instructor-title-text">
          At Hachion, visionary leadership meets innovation. Lakshmi Prasad leads with a passion for technology, education, and digital transformation, driving Hachion’s mission to make quality learning accessible to all.
          </p>
        <p className="instructor-title-text">
        His belief is simple — continuous learning creates limitless opportunities. Under his guidance, Hachion empowers learners with AI-driven, practical, and future-ready education designed to shape successful global careers.
        </p>
        <p className="instructor-title-text">
        “Education should not only teach you what to learn but inspire you to grow.” – Lakshmi Prasad
        </p>
        </div>
        {/* Right side image */}
        <img
        className="corporate-image"
        src={founder}
        alt="Founder banner"
        fetchpriority="high"
      />
    </div>
      <HomeFaq />
      <Footer />
      <StickyBar />
    </>
  );
}

export default Aboutus;