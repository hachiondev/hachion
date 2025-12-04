import React from 'react';
import FooterLogo from '../../Assets/Logowhite.webp';
import { IoIosMail, IoIosArrowForward } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import '../../Components/UserPanel/Home.css';

// TanStack Query Hooks
import { useTopBarApi } from '../../Api/hooks/useTopBarApi';
import { useTrendingData } from '../../Api/hooks/TrendingApi/useTrendingData';

const Footer = () => {
  const navigate = useNavigate();
  const { whatsappNumber, whatsappLink } = useTopBarApi();

  // Fetch Trending Courses — TANSTACK ✔
  const { data: trendingCourses = [], isLoading } = useTrendingData();

  // -------------------------
  // 🔗 Navigation Handlers
  // -------------------------
  const handleNavigation = (courseName) => {
    const formatted = courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${formatted}`);
  };

  const go = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="footer">
      <style>
        {`
          .email-input {
            background-color: #1F1F1F !important;
          }
        `}
      </style>

      <div className="container">
        <div className="footer-top">

          {/* ----------------------- */}
          {/* LOGO + SUBSCRIBE AREA   */}
          {/* ----------------------- */}
          <div className="footer-logo-head">
            <p className="footer-heading">
              <img src={FooterLogo} loading="lazy" alt="Logo" />
            </p>

            <div className="footer-subscribe">Subscribe to our newsletter</div>

            <div className="footer-email">
              <input
                type="email"
                className="form-control email-input"
                placeholder="Email Address"
                style={{
                  backgroundColor: '#1F1F1F',
                  borderBottom: '1px solid #fff',
                  borderRadius: 0
                }}
              />
              <span className="arrow"><IoIosArrowForward /></span>
            </div>

            {/* Desktop Contact */}
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

          {/* ----------------------- */}
          {/* TRENDING COURSES        */}
          {/* ----------------------- */}
          <div className="footer-head">
            <p className="footer-heading">Trending Courses</p>
            <div className="footer-column">
              {isLoading ? (
                <p>Loading...</p>
              ) : trendingCourses.length > 0 ? (
                trendingCourses.map((course) => (
                  <p
                    key={course.trendingcourse_id}
                    className="footer-content"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigation(course.course_name)}
                  >
                    {course.course_name}
                  </p>
                ))
              ) : (
                <p>No active courses available.</p>
              )}
            </div>
          </div>

          {/* ----------------------- */}
          {/* HACHION LINKS           */}
          {/* ----------------------- */}
          <div className="footer-head">
            <p className="footer-heading">Hachion</p>
            <div className="footer-column">
              <p className="footer-content" onClick={() => go('/aboutus')}>About us</p>
              <p className="footer-content" onClick={() => go('/contactus')}>Contact us</p>
              <p className="footer-content" onClick={() => go('/blogs')}>Blog</p>
              <p className="footer-content" onClick={() => go('/sitemap')}>Sitemap</p>
              <p className="footer-content" onClick={() => go('/workshop')}>Workshop</p>
              <p className="footer-content" onClick={() => go('/summer-tech-bootcamp-for-teens')}>
                Kids Summer Training
              </p>
            </div>
          </div>

          {/* ----------------------- */}
          {/* LEGAL LINKS             */}
          {/* ----------------------- */}
          <div className="footer-head">
            <p className="footer-heading">Legal</p>
            <div className="footer-column">
              <p className="footer-content" onClick={() => go('/terms')}>Terms & Conditions</p>
              <p className="footer-content" onClick={() => go('/privacy')}>Privacy Policy</p>
              <p className="footer-content" onClick={() => go('/unsubscribe')}>Unsubscribe</p>
            </div>
          </div>

          {/* ----------------------- */}
          {/* MOBILE CONTACT          */}
          {/* ----------------------- */}
          <div className="mobile-query">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center text-white text-decoration-none me-3"
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
      </div>
    </div>
  );
};

export default Footer;
