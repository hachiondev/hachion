"use client";

import { useState } from "react";
import "./Blogs.css";
import JobsDisplay from "./JobsDisplay";
import careerjob from "@/assets/careerbanner.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";

const ApplyHiring = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const resetFilters = () => {
    setJobTitle("");
    setJobType("");
    setLocation("");
    setExperience("");
  };

  return (
    <div>
      <div className="home-background">
        <div className="blogs-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Career
              </li>
            </ol>
          </nav>
        </div>
        <div>
          <img className="career-banner-img" src={careerjob.src} alt="Career Banner" />

          <h2 className="summer-title">We&apos;re Hiring!</h2>
          <div className="hire-part">
            <p className="career-job-text">
              Interested in working with us? Email your resume to{" "}
              <span className="career-span">
                <a href="https://mail.google.com/mail/?view=cm&to=hr@hachion.co" target="_blank" rel="noopener noreferrer">
                  {" "}hr@hachion.co{" "}
                </a>
              </span>
              <br />
              You can also view our current job listings and apply to the one that best suits your experience.
            </p>
          </div>

          <div className="hire-part">
            <div className="search-div-career" role="search">
              <input className="search-input-career" type="search" placeholder="Enter Job Title, Type, Location or Keywords" aria-label="Search" title="Search" />
              <button className="btn-search-home" aria-hidden="true">
                <IoSearch style={{ fontSize: "1.8rem" }} />
              </button>
            </div>
          </div>
          <div className="filter-container">
            <div className="filter-section">
              <select value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} aria-label="Filter by Title">
                <option value="">Select Job Title</option>
                <option value="SEO Executive">SEO Executive</option>
                <option value="Beanch Sale">Beanch Sale</option>
                <option value="Developer">Developer</option>
              </select>

              <select value={jobType} onChange={(e) => setJobType(e.target.value)} aria-label="Filter by Type">
                <option value="">Select Job Type</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by Location">
                <option value="">Select Location</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="India">India</option>
              </select>

              <select value={experience} onChange={(e) => setExperience(e.target.value)} aria-label="Filter by Experience">
                <option value="">Experience Level</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="2-4 Years">2-4 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>

              <button className="view-all" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>

          <JobsDisplay filters={{ jobTitle, jobType, location, experience }} />
        </div>
      </div>
    </div>
  );
};

export default ApplyHiring;
