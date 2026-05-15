import React, { useState, useMemo } from 'react';
import FooterLogo from '../../Assets/Logowhite.webp';
import { IoIosMail, IoIosArrowForward } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import whatsapp from '../../Assets/logos_whatsapp-icon.webp';
import facebook from '../../Assets/facebook.webp';
import twitter from '../../Assets/twitter.webp';
import youtube from '../../Assets/youtube.webp';
import linkedin from '../../Assets/linkedin.webp';
import instagram from '../../Assets/instagram.webp';
import quora from '../../Assets/Component 141.webp';

import '../../Components/UserPanel/Home.css';


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
  const navigate = useNavigate();
  const location = useLocation();
  const isCourseDetailPage = location.pathname.startsWith("/courses/");

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

  
  const handleSubscribeSubmit = (e) => {
    e.preventDefault(); 
    window.open(
      "https://www.linkedin.com/newsletters/certification-career-guides-7367392094962876416/",
      "_blank",
      "noopener,noreferrer"
    );
  };
const handleNavigation = (course) => {

  const courseSlug = course?.course_name
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  const categorySlug = course?.courseCategory
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

  if (!courseSlug || !categorySlug) {
    console.error("Missing course/category", course);
    return;
  }

  navigate(`/courses/${categorySlug}/${courseSlug}`);
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
                <img src={FooterLogo} loading="lazy" alt="Logo" />
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
                <h6 className='footer-heading text-center'>Social Links</h6>
                <div className="footer-link">
                  <a href="https://www.facebook.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                    <img src={facebook} alt="facebook-icon" loading="lazy" />
                  </a>
                  <a href="https://x.com/hachionofficial" target="_blank" rel="noopener noreferrer">
                    <img src={twitter} alt="twitter-icon" loading="lazy" />
                  </a>
                  <a href="https://www.linkedin.com/company/hachion" target="_blank" rel="noopener noreferrer">
                    <img src={linkedin} alt="linkedin-icon" loading="lazy" />
                  </a>
                  <a href="https://www.instagram.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                    <img src={instagram} alt="instagram-icon" loading="lazy" />
                  </a>
                  {/* <a href="https://www.quora.com/profile/Hachion" target="_blank" rel="noopener noreferrer">
                    <img src={quora} alt="quora-icon" loading="lazy" />
                  </a> */}
                  <a href="https://www.youtube.com/@hachion.official" target="_blank" rel="noopener noreferrer">
                    <img src={youtube} alt="youtube" loading="lazy" />
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
                  <p>Loading...</p>
                ) : trendingCourses.length > 0 ? (
                  trendingCourses.map(course => (
                    <p
                      key={course.trendingcourse_id}
                      className="footer-content"
                      onClick={() => handleNavigation(course)}
                    >
                      {course.course_name}
                    </p>
                  ))
                ) : (
                  <p>No active courses</p>
                )}
              </div>
            </div>

            {/* HACHION LINKS */}
            <div className="footer-head">
              <p className="footer-heading">Hachion</p>
              <div className="footer-column">
                <p className="footer-content" onClick={() => navigate('/aboutus')}>About us</p>
                <p className="footer-content" onClick={() => navigate('/contactus')}>Contact us</p>
                <p className="footer-content" onClick={() => navigate('/blogs')}>Blog</p>
                <p className="footer-content" onClick={() => navigate('/sitemap')}>Sitemap</p>
                {/* <p className="footer-content" onClick={() => navigate('/workshop')}>Workshop</p> */}
                <p className="footer-content" onClick={() => navigate('/summer-tech-bootcamp-for-teens')}>
                  Kids Summer Training
                </p>
              </div>
            </div>

            {/* LEGAL */}
            <div className="footer-head">
              <p className="footer-heading">Legal</p>
              <div className="footer-column">
                <p className="footer-content" onClick={() => navigate('/terms')}>Terms & Conditions</p>
                <p className="footer-content" onClick={() => navigate('/privacy')}>Privacy Policy</p>
                <p className="footer-content" onClick={() => navigate('/refundpolicy')}>Refund Policy</p>
                <p className="footer-content" onClick={() => navigate('/unsubscribe')}>Unsubscribe</p>
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
