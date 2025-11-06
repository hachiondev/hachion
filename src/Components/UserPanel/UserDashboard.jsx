import { React, useState, useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Dashboard.css';
import { RxDashboard } from "react-icons/rx";
import { PiNotePencilBold, PiCertificateBold } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { TbSettingsBolt } from "react-icons/tb";
import { PiBriefcase } from "react-icons/pi";
import UserDashboardCard from './UserDashboardCard';
import Footer from './Footer';
import StickyBar from './StickyBar';
import UserEnrolled from './UserEnrolled';
import UserOrders from './UserOrders';
import UserCertificate from './UserCertificate';
import UserReviews from './UserReviews';
import UserPathfinder from './UserPathfinder';
import UserProfile from './UserProfile';
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useParams, useNavigate } from 'react-router-dom';
import { CgPathOutline , CgMenuGridR } from "react-icons/cg";
import { BsBookmarkHeart } from "react-icons/bs";
import UserWishlist from './UserWishlist';
import UserAppliedJobs from './UserAppliedJobs';
import { BsCart2 } from "react-icons/bs";

const menuItems = [
  { title: 'Dashboard',     slug: 'dashboard',      icon: <RxDashboard /> },
  { title: 'User Profile',  slug: 'profile',       icon: <GoPerson /> },
  { title: 'Enrolls',       slug: 'enrolls',        icon: <PiNotePencilBold /> },
  { title: 'Wishlist',      slug: 'wishlist',       icon: <BsBookmarkHeart /> },
  { title: 'Order History', slug: 'order_history',  icon: <BsCart2 /> },
  { title: 'Certificate',   slug: 'certificate',    icon: <PiCertificateBold /> },
  // { title: 'Applied Jobs',  slug: 'applied_jobs',   icon: <PiBriefcase /> },
  { title: 'Review',        slug: 'review',         icon: <MdOutlineRateReview /> },
  { title: 'Pathfinder',    slug: 'pathfinder',     icon: <CgPathOutline  /> },
  // { title: 'Settings',      slug: 'settings',       icon: <TbSettingsBolt /> },
];

const UserDashboard = () => {
  const { section } = useParams(); 
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  useEffect(() => {
    const urlSlug = (section || '').toLowerCase();
    const storedSlug = localStorage.getItem('selectedCategorySlug');

    let idx = menuItems.findIndex(m => m.slug === urlSlug);
    if (idx === -1 && !urlSlug && storedSlug) {
      
      const storedIdx = menuItems.findIndex(m => m.slug === storedSlug);
      if (storedIdx !== -1) {
        navigate(`/userdashboard/${storedSlug}`, { replace: true });
        idx = storedIdx;
      }
    }
    if (idx === -1) idx = 0; 

    setActiveIndex(idx);
    
    localStorage.setItem('selectedCategorySlug', menuItems[idx].slug);
  }, [section, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuItemClick = (index) => {
    const slug = menuItems[index].slug;
    setActiveIndex(index);
    localStorage.setItem('selectedCategorySlug', slug);
    navigate(`/userdashboard/${slug}`);
    if (isMobileView) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderSelectedComponent = () => {
    const current = menuItems[activeIndex]?.title || 'Dashboard';
    switch (current) {
      case 'Dashboard':
        return <UserDashboardCard />;
      case 'User Profile':
        return <UserProfile />;
      case 'Order History':
        return <UserOrders />;
      case 'Certificate':
        return <UserCertificate />;
      case 'Enrolls':
        return <UserEnrolled />;
      case 'Wishlist':
        return <UserWishlist />;
      // case 'Applied Jobs':
      //   return <UserAppliedJobs />;
      case 'Review':
        return <UserReviews />;
      case 'Pathfinder':
        return <UserPathfinder />;
      // case 'Settings':
      //   return <UserProfile />;
      default:
        return <UserDashboardCard />;
    }
  };

  return (
    <>
      <Topbar />
      <NavbarTop />

      {/* Mobile Menu Button */}
      {isMobileView && (
        <button className="home-start-button" onClick={() => setIsSidebarOpen(true)}>
          <CgMenuGridR style={{ marginBottom: '3px' }} /> Menu
        </button>
      )}

      <div className="user-dashboard container">
        {/* Overlay for mobile sidebar */}
        {isMobileView && isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}

        {/* Sidebar */}
        <div className={`sidebar-user ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileView && isSidebarOpen ? 'open' : ''}`}>
          {/* Sidebar collapse toggle button */}
          {!isMobileView && (
            <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
              {isSidebarCollapsed ? <BiArrowToRight /> : <BiArrowToLeft />}
            </button>
          )}

          {/* Close button for mobile */}
          {isMobileView && (
            <button className="filter-close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
          )}

          <ul className="menu-list-user">
            {menuItems.map((item, index) => (
              <li key={item.slug} className="menu-item-container">
                <button
                  onClick={() => handleMenuItemClick(index)}
                  className={`menu-item-user ${activeIndex === index ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="user-dashboard-content">
          {renderSelectedComponent()}
        </div>
      </div>

      <Footer />
      <StickyBar />
    </>
  );
};

export default UserDashboard;
