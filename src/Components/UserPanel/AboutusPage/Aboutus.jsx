// Aboutus.jsx (partial - only showing the relevant section with Team component)
import React, { useEffect, useState } from "react";
import "../Blogs.css";
import Benefit from "../../../Assets/about1.webp";
import whatwedo from "../../../Assets/about3.webp";
import founder from "../../../Assets/founder.webp";
import data1 from "../../../Assets/foreign.webp";
import data2 from "../../../Assets/studentenroll.webp";
import data3 from "../../../Assets/certteacher.webp";
import data4 from "../../../Assets/coursecomplete.webp";
import feat1 from "../../../Assets/flex-icon.webp";
import feat2 from "../../../Assets/expert-instructor-icon.webp";
import feat3 from "../../../Assets/learn-icon.webp";
import feat4 from "../../../Assets/career-icon.webp";
import feat5 from "../../../Assets/247-icon.webp";
import feat6 from "../../../Assets/success-icon.webp";
import Learners from "../HomePage/LearnerSection/Learners";
import { TiTick } from "react-icons/ti";
import { TbSlashes } from "react-icons/tb";
import HomeFaq from "../HomeFaq";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StatisticCard from "./components/StatisticCard";
import FeatureCard from "./components/FeatureCard";
import Founder from "./components/Founder";
import Team from "./components/Team";

const API_BASE = "https://api.test.hachion.co";

const statistics = [
  {
    image: data1,
    number: "200K",
    label: "FOREIGN FOLLOWERS",
    alt: "FOREIGN FOLLOWERS",
  },
  {
    image: data2,
    number: "50K+",
    label: "STUDENTS ENROLLED",
    alt: "STUDENTS ENROLLED",
  },
  {
    image: data3,
    number: "1000+",
    label: "CERTIFIED TEACHERS",
    alt: "CERTIFIED TEACHERS",
  },
  {
    image: data4,
    number: "45K+",
    label: "COMPLETE COURSES",
    alt: "COMPLETE COURSES",
  },
];

const featurecard = [
  {
    img: feat1,
    title: "Flexible Learning",
    desc: "Learn anytime, anywhere with live online classes.",
    alt: "Flexible Learning Icon",
  },
  {
    img: feat2,
    title: "Expert Trainers",
    desc: "Train with certified professionals from the industry.",
    alt: "Expert Trainers Icon",
  },
  {
    img: feat3,
    title: "Hands-On Practice",
    desc: "Gain real skills through practical, project-based learning.",
    alt: "Hands-On Practice Icon",
  },
  {
    img: feat4,
    title: "Career Support",
    desc: "Get resume, interview, and placement assistance.",
    alt: "Career Support Icon",
  },
  {
    img: feat5,
    title: "24/7 Assistance",
    desc: "Receive round-the-clock learner support.",
    alt: "24/7 Assistance Icon",
  },
  {
    img: feat6,
    title: "Proven Results",
    desc: "Thousands of learners placed in top global companies.",
    alt: "Proven Results Icon",
  },
];

const Aboutus = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [employees, setEmployees] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState("");

  const filteredMembers =
    activeTab === "All"
      ? employees
      : employees.filter(
          (member) =>
            member.department &&
            member.department.toLowerCase() === activeTab.toLowerCase()
        );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoadingTeam(true);
    setTeamError("");

    axios
      .get(`${API_BASE}/employees`)
      .then((res) => {
        setEmployees(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setTeamError("Failed to load team members");
      })
      .finally(() => setIsLoadingTeam(false));
  }, []);

  const getEmployeeImageUrl = (companyImage) => {
    if (!companyImage) return null;

    if (
      companyImage.startsWith("http://") ||
      companyImage.startsWith("https://")
    ) {
      return companyImage;
    }

    const clean = companyImage.startsWith("/")
      ? companyImage.substring(1)
      : companyImage;

    return `https://api.test.hachion.co/uploads/test/employee_company_logo/${clean}`;
  };

  return (
    <>
      <div className="instructor-profile-banner">
        <h1 className="instructor-profile-title">ABOUT US</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="instructor-breadcrumb-item">
              <a href="/">Home</a> <TbSlashes color="#00aeef" />
            </li>
            <li
              className="instructor-breadcrumb-item active"
              aria-current="page"
            >
              About us
            </li>
          </ol>
        </nav>
      </div>

      <div className="instructor-banner container">
        {/* Left side content (image) */}
        <img
          className="corporate-image"
          src={Benefit}
          alt="Benefit banner"
          fetchpriority="high"
        />

        {/* Right side text */}
        <div className="home-content">
          <h2 className="about-head">
            Hachion: Bridging Education and Industry Success
          </h2>
          <p className="instructor-title-text">
            At Hachion, we empower learners to turn their education into
            real-world success. Through hands-on training, expert mentorship,
            and career-focused programs, we prepare you for opportunities in
            today's global job market.
          </p>

          <div className="aboutus-top">
            <div>
              <h3 className="key-title-text">Our Mission</h3>
              <p className="instructor-title-text">
                To build industry-ready professionals by delivering practical
                learning experiences that boost confidence, skills, and
                employability.
              </p>
            </div>
            <div>
              <h3 className="key-title-text">Our Vision</h3>
              <p className="instructor-title-text">
                To be the most trusted learning partner connecting talent with
                opportunity, helping every learner become career-ready and
                future-focused.
              </p>
            </div>
          </div>

          <button
            className="home-start-button"
            onClick={() => navigate("/coursedetails")}
          >
            Start Learning Today
          </button>
        </div>
      </div>

      <div className="about-statistics container">
        {statistics.map((stat, idx) => (
          <StatisticCard key={idx} {...stat} />
        ))}
      </div>

      <div className="home-faq-banner container">
        <h2 className="aboutus-feat-title">Why Choose Hachion?</h2>
        <p className="learner-title-tag">
          At Hachion, we make learning simple, flexible, and career-focused —
          helping you grow with real-world skills and expert support.
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
            Hachion helps learners gain the practical, job-ready skills
            employers look for.
          </p>

          <div className="expert-points">
            <TiTick className="about-right-icon" />
            <p className="expert-point-details">
              100+ Online Courses for individuals and teams
            </p>
          </div>
          <div className="expert-points">
            <TiTick className="about-right-icon" />
            <p className="expert-point-details">
              Industry-Relevant Training for real-world careers
            </p>
          </div>
          <div className="expert-points">
            <TiTick className="about-right-icon" />
            <p className="expert-point-details">
              Top Programs: QA Testing, DevOps, AWS, Tableau, Power BI, Business
              Analysis, Salesforce, Hadoop
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

      {/* Team section - Using the Team component with props */}
      <Team
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredMembers={filteredMembers}
        isLoadingTeam={isLoadingTeam}
        teamError={teamError}
        getEmployeeImageUrl={getEmployeeImageUrl}
      />

      {/* Founder section */}
      <Founder founder={founder} />

      <HomeFaq />
    </>
  );
};

export default Aboutus;