import React, { useEffect, useState } from "react";
import "./Blogs.css";
import Benefit from "../../Assets/about1.webp";
import whatwedo from "../../Assets/about3.webp";
import founder from "../../Assets/founder.webp";
import data1 from "../../Assets/foreign.webp";
import data2 from "../../Assets/studentenroll.webp";
import data3 from "../../Assets/certteacher.webp";
import data4 from "../../Assets/coursecomplete.webp";
import feat1 from "../../Assets/flex-icon.webp";
import feat2 from "../../Assets/expert-instructor-icon.webp";
import feat3 from "../../Assets/learn-icon.webp";
import feat4 from "../../Assets/career-icon.webp";
import feat5 from "../../Assets/247-icon.webp";
import feat6 from "../../Assets/success-icon.webp";
import Learners from "./Learners";
import { TiTick } from "react-icons/ti";
import { TbSlashes } from "react-icons/tb";
import HomeFaq from "./HomeFaq";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

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

const StatisticCard = ({ image, number, label, alt }) => (
  <div className="expert-content">
    <img src={image} alt={alt} />
    <div className="expert-sub-content">
      <div className="about-number">{number}</div>
      <p className="about-label">{label}</p>
    </div>
  </div>
);

const FeatureCard = ({ img, title, desc, alt }) => (
  <div className="about-feat-card">
    <img src={img} alt={alt} />
    <div className="about-feat-title">{title}</div>
    <p className="about-feat-lable">{desc}</p>
  </div>
);

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

    return `https://api.test.hachion.co/uploads/prod/employee_company_logo/${clean}`;
  };

  return (
    <>
      <div className="instructor-profile-banner container">
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
            today’s global job market.
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

      {/* Team section */}
      <div className="team-section container">
        {/* Header Section */}
        <div className="home-faq-banner">
          <h2 className="aboutus-feat-title">Meet our team</h2>
          <p className="learner-title-tag">
            A multidisciplinary crew of instructors, product thinkers, and
            support champions powering your learning journey.
          </p>
        </div>

        {/* Tab Menu */}
        <div className="tab-menu">
          {["All", "HR", "SEO", "BUSINESS", "DEVELOPER", "RECRUITMENT"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
  {/* Cards Grid */}
<div className="team-grid">
  {isLoadingTeam && <p>Loading team...</p>}
  {teamError && (
    <p style={{ color: "red", fontWeight: "bold" }}>{teamError}</p>
  )}

  {!isLoadingTeam && !teamError && (
    <>
      {filteredMembers.length > 0 ? (
        filteredMembers.map((member) => {
          const imgSrc = getEmployeeImageUrl(member.companyImage);

          return (
            <div
              key={member.employeeId ?? member.id}
              className="team-card"
            >
              <div
                className="team-image"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                {/* Default Avatar (always visible) */}
                <Avatar
                  variant="square"
                  sx={{ width: "100%", height: "100%" }}
                />

                {/* Actual image, overlays Avatar */}
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={member.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          );
        })
      ) : (
        
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#777",
            fontSize: "18px",
            fontWeight: "500",
            padding: "40px 0",
          }}
        >
          No Employees found for this department.
        </div>
      )}
    </>
  )}

          {/* Join Team Card */}
          <div className="team-card join-card">
            <div className="join-content">
              <p className="join-title">Interested to join our team?</p>
              <a href="#!" className="apply-link">
                Apply now →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Founder section */}
      <div className="instructor-banner container">
        <div className="about-content">
          <h2 className="about-head">Meet the Founder</h2>
          <p className="about-partner">
            Name :<span> Lakshmi Prasad</span>
          </p>
          <p className="about-partner">
            Designation :<span> Managing Partner</span>
          </p>
          <p className="instructor-title-text">
            At Hachion, visionary leadership meets innovation. Lakshmi Prasad
            leads with a passion for technology, education, and digital
            transformation, driving Hachion’s mission to make quality learning
            accessible to all.
          </p>
          <p className="instructor-title-text">
            His belief is simple — continuous learning creates limitless
            opportunities. Under his guidance, Hachion empowers learners with
            AI-driven, practical, and future-ready education designed to shape
            successful global careers.
          </p>
          <p className="instructor-title-text">
            “Education should not only teach you what to learn but inspire you
            to grow.” – Lakshmi Prasad
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
    </>
  );
};

export default Aboutus;
