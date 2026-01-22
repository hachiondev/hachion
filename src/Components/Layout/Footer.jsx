import React from 'react';
import FooterLogo from '../../Assets/Logowhite.webp';
import { IoIosMail, IoIosArrowForward } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import '../../Components/UserPanel/Home.css';

// TanStack Query Hooks
import { useTopBarApi } from '../../Api/hooks/HomePageApi/useTopBarApi';
import { useTrendingData } from '../../Api/hooks/HomePageApi/TrendingApi/useTrendingData';
import { useGeoKeywordsByCourse } from '../../Api/hooks/HomePageApi/TrendingApi/useGeoKeywordsByCourse';

const normalizeCourseNameFromSlug = (slug) => {
  if (!slug) return null;

  return decodeURIComponent(slug)

    // 1️⃣ Convert SEO triple dash to real hyphen
    .replace(/---+/g, " - ")

    // 2️⃣ Protect certification codes like AZ-400, DP-203
    .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, "$1@@$2")

    // 3️⃣ Convert remaining hyphens / underscores to spaces
    .replace(/[-_]+/g, " ")

    // 4️⃣ Restore protected codes
    .replace(/@@/g, "-")

    // 5️⃣ Normalize spaces
    .replace(/\s+/g, " ")
    .trim();
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const { data: trendingCourses = [], isLoading } = useTrendingData();

  const { whatsappNumber, whatsappLink } = useTopBarApi();

  // -------------------------
  // ✅ Decode course name from URL
  // Example: act-english → ACT(English)
  // -------------------------
 
  const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
// const { courseName } = useParams();
const { courseName } = useParams();

console.log('Footer useParams:', useParams());


const normalizedCourseName = React.useMemo(() => {
  if (!courseName) return null;

  const decoded = normalizeCourseNameFromSlug(courseName);
  return toTitleCase(decoded); // ✅ Salesforce Admin
}, [courseName]);

const geoQuery = useGeoKeywordsByCourse(normalizedCourseName);

const geoKeywords = geoQuery?.data ?? [];
const geoLoading = geoQuery?.isLoading ?? false;




  // -------------------------
  // Handlers
  // -------------------------
  const handleNavigation = (courseName) => {
    const formatted = courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${formatted}`);
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

          {/* LOGO + SUBSCRIBE */}
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

            <div className="desktop-query">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                 className="d-flex align-items-center text-white me-3 text-decoration-none">
                <FaPhone className="me-1 topbar-icon" />
                <span>{whatsappNumber}</span>
              </a>

              <a href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                 target="_blank" rel="noopener noreferrer"
                 className="d-flex align-items-center text-white text-decoration-none">
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
                    onClick={() => handleNavigation(course.course_name)}
                  >
                    {course.course_name}
                  </p>
                ))
              ) : (
                <p>No active courses</p>
              )}
            </div>
          </div>

          {/* ✅ DYNAMIC COURSE KEYWORDS (REPLACED FIRST HACHION) */}
          <div className="footer-head">
           {/* <p className="footer-heading">
  {normalizedCourseName || 'Course Keywords'}
</p> */}
<p className="footer-heading">Popular Searches</p>


            <div className="footer-column">
              {geoLoading ? (
                <p>Loading...</p>
              ) : geoKeywords.length > 0 ? (
                geoKeywords.map(item => (
                  <p key={item.geoKeywordId} className="footer-content">
                    {item.geoKeywordName}
                  </p>
                ))
              ) : (
                <p>No keywords available</p>
              )}
            </div>
          </div>

          {/* HACHION LINKS (STATIC – KEEP) */}
          <div className="footer-head">
            <p className="footer-heading">Hachion</p>
            <div className="footer-column">
              <p className="footer-content" onClick={() => navigate('/aboutus')}>About us</p>
              <p className="footer-content" onClick={() => navigate('/contactus')}>Contact us</p>
              <p className="footer-content" onClick={() => navigate('/blogs')}>Blog</p>
              <p className="footer-content" onClick={() => navigate('/sitemap')}>Sitemap</p>
              <p className="footer-content" onClick={() => navigate('/workshop')}>Workshop</p>
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
              <p className="footer-content" onClick={() => navigate('/unsubscribe')}>Unsubscribe</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;
