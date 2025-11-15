import React, { useEffect, useState, useRef } from "react"; 
import StartInstructor from "../../Assets/e1.webp";
import Teaching from "../../Assets/e2.webp";
import Rules from "../../Assets/e3.webp";
import Help from "../../Assets/e4.webp";
import Story from "../../Assets/e5.webp";
import Users from "../../Assets/Users.webp";
import Notebook from "../../Assets/Notebook.webp";
import Globe from "../../Assets/GlobeHemisphereWest.webp";
import CircleWavyCheck from "../../Assets/CircleWavyCheck.webp";
import Stack from "../../Assets/Stack.webp";
import SupportMail from "../../Assets/support-mail-icon.webp";
import Apply from "../../Assets/expert-icon1.webp";
import Profile from "../../Assets/expert-icon2.webp";
import Course from "../../Assets/expert-icon3.webp";
import Earn from "../../Assets/expert-icon4.webp";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiQuotesDuotone } from "react-icons/pi";
import { LiaArrowLeftSolid } from "react-icons/lia";
import { LiaArrowRightSolid } from "react-icons/lia";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import "./Home.css";
import InstructorForm from "./InstructorForm";

const statistics = [
  {
    img: Users,
    number: '67.1k',
    label: 'Students',
    alt: "Students"
  },
  {
    img: Notebook,
    number: '26k',
    label: 'Certified Instructor',
    alt: 'Certified Instructor',
  },
  {
    img: Globe,
    number: '72',
    label: 'Country Language',
    alt: 'Country Language',
  },
  {
    img: CircleWavyCheck,
    number: '99.9%',
    label: 'Success Rate',
    alt: 'Success Rate',
  },
   {
    img: Stack,
    number: '57',
    label: 'Trusted Companies',
    alt: 'Trusted Companies',
  },
];
const ExpertStatistic = ({ img, number, label, alt }) => (
  <div className='expert-content'>
    <img src={img} alt={alt} />
    <div className='expert-sub-content'>
    <div className='expert-number'>{number}</div>
    <p className='expert-label'>{label}</p>
  </div>
  </div>
);

const onlineInstructor = [
  {
    img: Apply,
    title: '1. Apply to Become an Instructor',
    content: 'Join thousands of certified instructors and start your teaching journey.',
    alt: "Apply"
  },
  {
    img: Profile,
    title: '2. Set Up Your Profile',
    content: ' Showcase your skills and experience with a professional profile.',
    alt: 'Profile',
  },
  {
    img: Course,
    title: '3. Create Your Course',
    content: 'Upload lessons, add resources, and publish your online course.',
    alt: 'Course',
  },
  {
    img: Earn,
    title: '4. Start Teaching & Earning',
    content: 'Reach students worldwide, share your knowledge, and grow your income.',
    alt: 'Earn',
  },
];
const OnlineInstructor = ({ img, title, content, alt }) => (
  <div className='expert-online-card'>
    <img src={img} alt={alt} />
    <div className='expert-online-title'>{title}</div>
    <p className='expert-online-lable'>{content}</p>
  </div>
);

const stories = [
    {
      text: "Best live online training institute for all IT courses. Here I got the best Job Assistance to build my career.",
      author: "– Ravi Kumar",
    },
    {
      text: "Hachion helped me improve my technical skills and provided great placement support.",
      author: "– Priya Sharma",
    },
    {
      text: "Trainers are very supportive and experienced. Loved the hands-on training approach.",
      author: "– Ramesh Babu",
    },
  ];

const BecomeInstructor = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [showPopup, setShowPopup] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  // Scroll button logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="home-background">
      <Topbar />
      <NavbarTop />

      {/* Banner Section */}
      <div className="home-banner container">
        <div className="home-content">
          <h1 className="home-title">
           Become an Instuctor
          </h1>
          <p className="home-title-text">
           Become an instructor & start teaching with 26k certified instructors. Create a success story with 67.1k Students — Grow yourself with 71 countries.
          </p>
          <div className="button-row">
            <button className="home-start-button"  onClick={() => setShowPopup(true)}>Get Started</button>
          </div>
        </div>
        <img
          className="home-banner-img"
          src={StartInstructor}
          alt="Learner feedback banner"
          fetchpriority="high"
        />
      </div>
      {showPopup && <InstructorForm onClose={() => setShowPopup(false)} />}
      <div className='expert-statistics'>
            {statistics.map((stat, idx) => (
              <ExpertStatistic key={idx} {...stat} />
            ))}
          </div>

          <div className="instructor-banner container">
                {/* Left side content */}
                <div className="home-content">
                  
                  <img
                  src={Teaching}
                  alt="Teaching banner"
                  className="key-image"
                  fetchpriority="high"
                />
                  </div>
          
                {/* Right side content */}
                <div className="home-content">
                    <h2 className="become-expert-title">Why Teach Online with Hachion</h2>
                  <p className="home-title-text">
                    Turn your knowledge into impact. Hachion gives you the tools to share your expertise, grow your audience, and earn—all from one easy-to-use platform.
                  </p>
                  <div className='expert-points'>
                  <FaCheckCircle className="check-icon" />
                  <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                    Teach your way
                  </h3>
                <p className="help-faq-details">
                   Design lessons the way you want—live, recorded, or interactive. You stay in control of your teaching style.
                  </p>
                  </div>
                  </div>
                  <div className='expert-points'>
                    <FaCheckCircle className="check-icon" />
                    <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                   All-in-one dashboard
                  </h3>
                <p className="help-faq-details">
                   Manage courses, track student progress, and receive payments securely in one place.
                  </p>
                  </div>
                  </div>
                  <div className='expert-points'>
                    <FaCheckCircle className="check-icon" />
                    <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                     Connect with learners
                  </h3>
                <p className="help-faq-details">
                  Engage directly with your students through built-in chat, feedback, and Q&A support.
                  </p>
                  </div>
                  </div>
              </div>
              </div>

              <div className="home-faq-banner container">
                    <h2 className="become-expert-center-title">How to Become a Successful Online Instructor</h2>
              <div className="expert-row">
            {onlineInstructor.map((inst, idx) => (
              <OnlineInstructor key={idx} {...inst} />
            ))}
          </div>
          </div>

              <div className="instructor-banner container">
                {/* Left side content */}
                <div className="home-content">
                    <h2 className="become-expert-title">Instructor Rules & Guidelines</h2>
                  <p className="home-title-text">
                    To ensure quality learning for students, all instructors must follow these basic rules. These guidelines help maintain trust, professionalism, and a great teaching experience.
                  </p>
                  <ul className="expert-points-list">
                  <li className="help-faq-details">
                    Provide accurate, original, and high-quality course content.
                  </li>
                  <li className="help-faq-details">
                    Maintain a professional and respectful tone with all students.
                  </li>
                  <li className="help-faq-details">
                    Keep your instructor profile and course materials updated.
                  </li>
                  <li className="help-faq-details">
                    Follow platform policies on pricing, promotions, and communication.
                  </li>
                </ul>
              </div>
              {/* Right side content */}
              <div className="home-content">
                  <img
                  src={Rules}
                  alt="Rules banner"
                  className="key-image"
                  fetchpriority="high"
                />
                  </div>
              </div>

              <div className='help-background'>
              <div className="instructor-banner container">
                {/* Left side content */}
                <div className="home-content">
                  
                  <img
                  src={Help}
                  alt="Help banner"
                  className="key-image"
                  fetchpriority="high"
                />
                  </div>
          
                {/* Right side content */}
                <div className="home-content">
                    <h2 className="become-expert-title">We’re Always Here to Help You</h2>
                  <p className="home-title-text">
                    Need assistance? Our support team is ready to guide you every step of the way — whether you’re exploring new opportunities, switching careers, or simply need quick answers.
                  </p>
                  <div className='expert-points'>
                  <FaArrowRightLong className="right-icon" />
                <p className="expert-point-details">
                   Get expert help tailored to your needs
                  </p>
                  </div>
                  <div className='expert-points'>
                    <FaArrowRightLong Circle className="right-icon" />
                <p className="expert-point-details">
                  Restart or upgrade your career path with confidence
                  </p>
                  </div>
                  <div className='expert-points'>
                    <FaArrowRightLong className="right-icon" />
                <p className="expert-point-details">
                  Fast and reliable support whenever you need it
                  </p>
                  </div>
                  <div className='expert-points'>
                    <FaArrowRightLong className="right-icon" />
                <p className="expert-point-details">
                  Hassle-free solutions for all your queries
                  </p>
                  </div>
                  <div className='expert-content'>
                <img src={SupportMail} alt='SupportMail' />
                <div className='expert-sub-content'>
                <p className='support-lable'>Email us anytime</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center text-decoration-none text-white"
                  aria-label="Send an email to trainings@hachion.co using Gmail"
                  >
                  <p className='support-mail'>trainings@hachion.co</p>
                   </a>
              </div>
              </div>
              </div>
              </div>
              </div>

              <div className="instructor-banner container">
              {/* Left side content */}
              <div className="home-content">
                <h2 className="become-expert-title">
                  20,000+ Instructors Built Their Success Story with Hachion
                </h2>
                <p className="home-title-text">
                  Join a thriving community of instructors who transformed their teaching careers with Hachion. We empower educators with the tools, training, and support they need to grow, inspire, and succeed.
                </p>
                <ul className="expert-points-list">
                  <li className="help-faq-details">
                    Launch and scale your teaching career with ease
                  </li>
                  <li className="help-faq-details">
                    Access cutting-edge resources and mentorship
                  </li>
                  <li className="help-faq-details">
                    Connect with a global network of passionate learners and trainers
                  </li>
                </ul>

                <div className="trainer-story-wrapper">
                  <div className="trainer-story">
                    <PiQuotesDuotone className="quote-icon" />
                    <p className="trainer-quote">{stories[currentIndex].text}</p>
                    <span className="trainer-author">{stories[currentIndex].author}</span>
                  </div>

                  <div className="trainer-arrow-container">
                  <button
                    className={`trainer-arrow-btn prev ${currentIndex === 0 ? "active" : ""}`}
                    onClick={handlePrev}
                  >
                    <LiaArrowLeftSolid />
                  </button>
                  <button
                    className={`trainer-arrow-btn next ${
                      currentIndex === stories.length - 1 ? "active" : ""
                    }`}
                    onClick={handleNext}
                  >
                    <LiaArrowRightSolid />
                  </button>
                </div>
                </div>
              </div>

              {/* Right side content */}
              <div className="home-content">
                <img
                  src={Story}
                  alt="Story banner"
                  className="key-image"
                  fetchpriority="high"
                />
              </div>
            </div>

      <Footer />
      {showScrollButton && <StickyBar />}
    </div>
  );
};

export default BecomeInstructor;
