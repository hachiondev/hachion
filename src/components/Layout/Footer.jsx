'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
const FooterLogo = '/images/Logowhite.webp';
import { IoIosMail, IoIosArrowForward } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
const facebook = '/images/facebook.webp';
const twitter = '/images/twitter.webp';
const youtube = '/images/youtube.webp';
const linkedin = '/images/linkedin.webp';
const instagram = '/images/instagram.webp';

import '../UserPanel/Home.css';


import { useTopBarApi } from '../../Api/hooks/HomePageApi/useTopBarApi';
import { useTrendingData } from '../../Api/hooks/HomePageApi/TrendingApi/useTrendingData';
import { useGeoKeywordsByCourse } from '../../Api/hooks/HomePageApi/TrendingApi/useGeoKeywordsByCourse';

const normalizeCourseNameFromSlug = (slug) => {
  if (!slug) return null;

  return decodeURIComponent(slug)
    .replace(/---+/g, " - ")
    .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, "$1@@$2")
    .replace(/[-_]+/g, " ")
    .replace(/@@/g, "-")
    .replace(/\s+/g, " ")
    .trim();
};

const Footer = () => {
  const pathname = usePathname();
  const isCourseDetailPage = pathname.startsWith("/courses/");

  const { data: trendingCourses = [], isLoading } = useTrendingData();
  const { whatsappNumber, whatsappLink } = useTopBarApi();

  const { courseName } = useParams();

  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

  const normalizedCourseName = useMemo(() => {
    if (!courseName) return null;
    const decoded = normalizeCourseNameFromSlug(courseName);
    return toTitleCase(decoded);
  }, [courseName]);

  const geoQuery = useGeoKeywordsByCourse(normalizedCourseName);
  const geoKeywords = geoQuery?.data ?? [];
  const geoLoading = geoQuery?.isLoading ?? false;

  const showPopularSearches =
    isCourseDetailPage &&
    normalizedCourseName &&
    geoKeywords.length > 0;


  const [email, setEmail] = useState("");

  // Auth pages (Login / Sign Up) don't show the footer in production —
  // checked after every hook above so this stays a plain conditional
  // return, never a conditional hook call.
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    window.open(
      "https://www.linkedin.com/newsletters/certification-career-guides-7367392094962876416/",
      "_blank",
      "noopener,noreferrer"
    );
  };
const getCourseUrl = (course) => {
  const courseSlug = course?.course_name
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  const categorySlug = course?.courseCategory
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  if (!courseSlug || !categorySlug) {
    return null;
  }

  return `/courses/${categorySlug}/${courseSlug}`;
};

  return (
    <>
      <div className="footer">
        <style>
          {`
            .email-input {
              background-color: #1F1F1F !important;
            }
            .arrow {
              background: none;
              border: none;
              color: #fff;
            }
          `}
        </style>

        <div className="container">
          <div className="footer-top">

            {/* LOGO + SUBSCRIBE */}
            <div className="footer-logo-head">
              <p className="footer-heading">
                <Image
                  src={FooterLogo}
                  loading="lazy"
                  alt="Logo"
                  className="footer-logo-img"
                  width={234}
                  height={68}
                />
              </p>

              <div className="footer-subscribe">Subscribe to our newsletter</div>

              {/* ✅ FORM WITH NATIVE VALIDATION */}
              <form className="footer-email" onSubmit={handleSubscribeSubmit}>
                <input
                  type="email"
                  className="form-control email-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#1F1F1F',
                    borderBottom: '1px solid #fff',
                    borderRadius: 0
                  }}
                />

                <button
                  type="submit"
                  className="arrow"
                  style={{ cursor: "pointer" }}
                  aria-label="Subscribe"
                >
                  <IoIosArrowForward />
                </button>
              </form>

              {/* SOCIAL MEDIA LINKS */}
              <div className='mt-2'>
                <h3 className='footer-heading text-center'>Connect With Us</h3>

                <div className="footer-link">
                  <a href="https://www.facebook.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                    <Image src={facebook} alt="facebook-icon" loading="lazy" width={30} height={30} />
                  </a>
                  <a href="https://x.com/hachionofficial" target="_blank" rel="noopener noreferrer">
                    <Image src={twitter} alt="twitter-icon" loading="lazy" width={30} height={30} />
                  </a>
                  <a href="https://www.linkedin.com/company/hachion" target="_blank" rel="noopener noreferrer">
                    <Image src={linkedin} alt="linkedin-icon" loading="lazy" width={30} height={30} />
                  </a>
                  <a href="https://www.instagram.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                    <Image src={instagram} alt="instagram-icon" loading="lazy" width={30} height={30} />
                  </a>
                  <a href="https://www.youtube.com/@hachion.official" target="_blank" rel="noopener noreferrer">
                    <Image src={youtube} alt="youtube" loading="lazy" width={30} height={30} />
                  </a>
                </div>
              </div>

              <div className="desktop-query">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center text-white me-3 text-decoration-none"
                >
                  <FaPhone className="me-1 topbar-icon" />
                  <span>{whatsappNumber}</span>
                </a>

                <a
                  href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center text-white text-decoration-none"
                >
                  <IoIosMail className="me-1 topbar-icon" />
                  <span>trainings@hachion.co</span>
                </a>
              </div>
            </div>

            {/* TRENDING COURSES */}
            <div className="footer-head">
              <p className="footer-heading">Trending Courses</p>
              <div className="footer-column">
                {isLoading ? (
                  // Reserves roughly the space the real list occupies (the
                  // trending list commonly runs ~15-20 items) so it doesn't
                  // pop in and shift everything below it once loaded — this
                  // was the single largest source of CLS on shorter pages
                  // (courses, instructor-profiles), since the whole footer
                  // sits above the fold there. Direct children of
                  // .footer-column so its existing `gap: 10px` spaces them
                  // exactly like the real .footer-content links would be.
                  Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="footer-trending-skeleton-line" aria-hidden="true" />
                  ))
                ) : trendingCourses.length > 0 ? (
                  trendingCourses.map(course => {
                    const courseUrl = getCourseUrl(course);
                    return courseUrl ? (
                      <Link
                        key={course.trendingcourse_id}
                        href={courseUrl}
                        className="footer-content"
                        style={{ textDecoration: "none", color: "inherit", display: "block" }}
                      >
                        {course.course_name}
                      </Link>
                    ) : (
                      <p key={course.trendingcourse_id} className="footer-content">
                        {course.course_name}
                      </p>
                    );
                  })
                ) : (
                  <p>No active courses</p>
                )}
              </div>
            </div>

            {/* HACHION LINKS */}
            <div className="footer-head">
              <p className="footer-heading">Hachion</p>
              <div className="footer-column">
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/aboutus'>About us</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/contactus'>Contact us</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/blogs'>Blog</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/sitemap'>Sitemap</Link>
                {/* <p className="footer-content" onClick={() => navigate('/workshop')}>Workshop</p> */}
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/summer-tech-bootcamp-for-teens'>
                  Kids Summer Training
                </Link>
              </div>
            </div>

            {/* LEGAL */}
            <div className="footer-head">
              <p className="footer-heading">Legal</p>
              <div className="footer-column">
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/terms'>Terms & Conditions</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/privacy'>Privacy Policy</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/refundpolicy'>Refund Policy</Link>
                <Link className="footer-content" style={{ textDecoration: "none", color: "inherit", display: "block" }} href='/unsubscribe'>Unsubscribe</Link>
              </div>
            </div>

          </div>

          {/* POPULAR SEARCHES */}
          {showPopularSearches && (
            <>
              <hr />
              <div className="footer-head">
                <p className="footer-heading">Popular Searches</p>
                <div className="footer-column-search">
                  {geoLoading ? (
                    <p>Loading...</p>
                  ) : (
                    geoKeywords.map(item => (
                      <p
                        key={item.geoKeywordId}
                        className="footer-content-search"
                      >
                        {item.geoKeywordName}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <p className="footer-copyright-desktop">
        © Hachion {new Date().getFullYear()}. All Rights Reserved.
      </p>
    </>
  );
};

export default Footer;
