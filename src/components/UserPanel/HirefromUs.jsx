"use client";

import { useEffect, useRef } from "react";
import "./Blogs.css";
import PostJob from "./PostJob";
import banner from "@/assets/hirebanner.webp";
import whyhachion from "@/assets/whyhire.webp";
import collabration from "@/assets/hirecollab.webp";
import companies from "@/assets/itlogos.webp";
import Typewriter from "@/components/common/Typewriter";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const HirefromUs = () => {
  const postJobRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="home-background">
        <div className="hirebackground">
          <div className="hire-banner">
            <div className="hire-content">
              <h1 className="hire-title">
                <span className="hire-title-span">Hachion</span>
                <Typewriter strings={["is built for smarter hiring.", "is your hiring co-pilot."]} deleteSpeed={20} delay={100} pauseFor={3000} loop />
              </h1>
              <p className="hire-title-text">Hachion helps you hire skilled talent faster and more affordably.</p>
              <button className="post-job-button" onClick={() => postJobRef.current?.scrollIntoView({ behavior: "smooth" })}>
                Post Job
              </button>
            </div>
            <img className="hire-banner-img" src={banner.src} alt="Hire banner" fetchPriority="high" width="500" height="500" />
          </div>
        </div>

        <h2 className="hire-sub-title">Why Hire from Hachion?</h2>
        <div className="hire-part">
          <ol className="points">
            <li className="hire-points">
              <span className="point-icon"><IoMdCheckmarkCircleOutline /></span>{" "}
              <div><strong>Zero-Cost Hiring: </strong>Hire pre-trained professionals without bearing any recruitment fees.</div>
            </li>
            <li className="hire-points">
              <span className="point-icon"><IoMdCheckmarkCircleOutline /></span>{" "}
              <div><strong>Pre-Vetted, Job-Ready Talent: </strong>Candidates come equipped with practical, real-world project experience.</div>
            </li>
            <li className="hire-points">
              <span className="point-icon"><IoMdCheckmarkCircleOutline /></span>{" "}
              <div><strong>Dedicated Hiring Support: </strong>From candidate sourcing to seamless onboarding, Hachion provides hands-on guidance throughout the process.</div>
            </li>
            <li className="hire-points">
              <span className="point-icon"><IoMdCheckmarkCircleOutline /></span>{" "}
              <div><strong>Wide Tech Coverage: </strong>Access professionals skilled in 150+ in-demand domains like DevOps, Cloud, Data Science, QA, and more.</div>
            </li>
            <li className="hire-points">
              <span className="point-icon"><IoMdCheckmarkCircleOutline /></span>{" "}
              <div><strong>All-Year Talent Availability: </strong>A consistent pipeline of qualified candidates ready when you are.</div>
            </li>
          </ol>
          <img className="hire-img" src={whyhachion.src} alt="Why hire from Hachion" loading="lazy" />
        </div>

        <h2 className="hire-sub-title">Top IT firms collaborate with Hachion</h2>
        <div className="hire-part">
          <img className="hire-collab" src={collabration.src} alt="Collabration" loading="lazy" />
          <img className="hire-logo" src={companies.src} alt="IT Logos" loading="lazy" />
        </div>
        <div ref={postJobRef} style={{ marginTop: 20 }}>
          <PostJob />
        </div>
      </div>
    </div>
  );
};

export default HirefromUs;
