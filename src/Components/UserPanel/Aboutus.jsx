import React, { useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Breadcrumb from './Breadcrumb';
import StoryCard from './StoryCard';
import WhyChooseUsCard from './WhyChooseUsCard';
import Learners from './Learners';
import StickyBar from './StickyBar';
import Footer from './Footer';
import './Blogs.css';

import aboutUsBanner from '../../Assets/AboutusBanner (2).png';
import aboutUsSider from '../../Assets/aboutussider.png';
import visionImage from '../../Assets/OurVision.png';
import FlexibleLearning from '../../Assets/FlexibleLearning.png';
import Success from '../../Assets/Success.png';
import Assistance from '../../Assets/Assistance.png';
import careerSupport from '../../Assets/careerSupport.png';
import handsOnLearning from '../../Assets/handsonLearning.png';
import onlineTeaching from '../../Assets/onlineTeaching.png';

const storyData = [
  { icon: <StoryCard.Icon type="group" />, number: '88,000', text: 'Foreign Followers' },
  { icon: <StoryCard.Icon type="student" />, number: '4789', text: 'Students Enrolled' },
  { icon: <StoryCard.Icon type="contacts" />, number: '96', text: 'Certified Teachers' },
  { icon: <StoryCard.Icon type="verified" />, number: '488', text: 'Complete Courses' }
];

const whyChooseUs = [
  { img: FlexibleLearning, title: 'Flexible Learning', desc: 'Online Training accessible at your convenience' },
  { img: onlineTeaching, title: 'Expert Instructor', desc: 'Industries professionals delivering valuable content' },
  { img: handsOnLearning, title: 'Hands-On Learning', desc: 'Practical classes with easy-to-follow material.' },
  { img: careerSupport, title: 'Career Support', desc: 'Assistance with CVs, interviews, and job placement.' },
  { img: Assistance, title: '24/7 Support', desc: 'Continuous support through online chat and phone.' },
  { img: Success, title: 'Proven Success', desc: 'Positive feedback from participants and successful outcomes.' },
];

const Aboutus = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="about-banner">
        <img src={aboutUsBanner} alt="about-us" />
      </div>

      <div className="about-us">
        <Breadcrumb current="About Us" />
        
        <div className="about-us-content">
          <h1 className="about-us-heading">About Hachion</h1>
          <div className="about-us-top">
            <p className="about-us-left-content">
              Hachion is an organization that has been set up with the purpose of bridging the gap between graduates and corporate...
            </p>
            <img src={aboutUsSider} alt="About Us Side" />
          </div>
          <p className="about-us-left-content">
            Our placement services focus on providing extensive end-to-end services as per the customized requirement of our clients...
          </p>

          <h1 className="about-us-heading">Our Story</h1>
          <div className="our-story">
            {storyData.map((item, idx) => (
              <StoryCard key={idx} {...item} />
            ))}
          </div>

          <h1 className="about-us-heading">Our Vision</h1>
          <div className="about-us-top">
            <p className="about-us-left-content">
              Our Vision is to synergize the “right talent” with the “right requirement”...
            </p>
            <img src={visionImage} alt="Our Vision" />
          </div>

          <h1 className="about-us-heading">What We Do?</h1>
          <p className="about-us-left-content">
            We provide a wide range of online courses to both large organizations and individual learners...
          </p>

          <h1 className="about-us-heading">Why to choose Hachion?</h1>
          <p className="about-us-left-content">
            Hachion offers you the flexibility to learn anytime, anywhere with instructor-led online training programs...
          </p>
          <div className="about-us-div">
            {whyChooseUs.map((card, idx) => (
              <WhyChooseUsCard key={idx} {...card} />
            ))}
          </div>
        </div>
      </div>

      <Learners page="about" />
      <Footer />
      <StickyBar />
    </>
  );
};

export default Aboutus;
