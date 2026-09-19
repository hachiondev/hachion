"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AvatarCount from "./AvatarCount";
import "../../Home.css";
import "../../Buttons.css";
import BannerButtonPopup from "./BannerButtonPopup";
import heroBg from "@/assets/hb.webp";

// Hero entrance animation (see .hero-content-anim/.hero-image-anim in
// Home.css) — matches the CRA app's Framer Motion hero animation (text
// slides in from the left, image from the right, fading in together)
// using plain CSS transform/opacity instead of framer-motion, so there's
// no lazy-loaded-library delay to the LCP paint and no layout pass (only
// compositor-handled properties), while still landing the same visual
// entrance. Runs once via animation-fill-mode, never replaying on
// re-render.
const Banner = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* .home-banner-background's CSS background-image isn't discoverable
          by the browser until CSS finishes parsing, and it's the page's LCP
          element — measured via Lighthouse at 68% of total LCP time spent
          in "Load Delay" before the browser even started fetching it. A
          same-URL preload (React 19/Next.js hoists <link> tags rendered
          anywhere in the tree, including client components, up to <head>)
          lets the browser start the fetch immediately instead of waiting
          for CSSOM construction. */}
      <link rel="preload" as="image" href={heroBg.src} fetchPriority="high" />
      <div className="home-banner-background container">
        <div className="home-banner">

        {/* Left side content */}
        <div className="home-content hero-content-anim">
          <h1 className="home-title">
            <span className="home-title-span">Boost Your Career</span> with
            <br />
            Industry-Recognized
            <br />
            IT Certifications
          </h1>

          <p className="home-title-text">
            Learn from flexible, affordable, and expert-designed courses trusted by
            25,000+ learners worldwide. Upgrade your skills anytime, anywhere – and
            achieve your career goals faster.
          </p>

          <div className="avatar-row">
            <AvatarCount />
            <span className="home-sub-text">Join with us</span>
          </div>

          <div className="button-row">
            <button
              className="home-start-button hero-start-button"
              onClick={() => setShowPopup(true)}
            >
              Start Your Certification
            </button>

            <Link href="/courses" className="home-browse-button hero-browse-button" prefetch={false}>
              Browse All Courses
            </Link>
          </div>
        </div>

        {/* Right side image */}
        <Image
          className="home-banner-img hero-image-anim"
          src="/industry-recognized-it-certifications.webp"
          alt="Home banner"
          priority
          fetchPriority="high"
          width={429}
          height={521}
          sizes="(max-width: 768px) 100vw, 45vw"
        />

        {showPopup && <BannerButtonPopup onClose={() => setShowPopup(false)} />}
      </div>
      </div>
    </>
  );
};

export default Banner;
