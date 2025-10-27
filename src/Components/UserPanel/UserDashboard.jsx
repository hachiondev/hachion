import { React, useState, useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Dashboard.css';
import { RxDashboard } from "react-icons/rx";
import { PiNotePencilBold } from "react-icons/pi";
import { PiTrolleySuitcaseFill } from "react-icons/pi";
import { FaIdCard } from "react-icons/fa6";
import { PiCertificateBold } from "react-icons/pi";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import { TbSettingsBolt } from "react-icons/tb";
import UserDashboardCard from './UserDashboardCard';
import Footer from './Footer';
import StickyBar from './StickyBar';
import UserEnrolled from './UserEnrolled';
import UserOrders from './UserOrders';
import Certificate from './Certificate';
import UserMessages from './UserMessages';
import UserReviews from './UserReviews';
import UserVideos from './UserVideos';
import UserResume from './UserResume';
import UserProfile from './UserProfile';
import { BiArrowToLeft } from "react-icons/bi";
import { BiArrowToRight } from "react-icons/bi";
import { useParams } from 'react-router-dom';
import { TbBriefcaseFilled } from "react-icons/tb";
import UserAppliedJobs from './UserAppliedJobs';
import UserPathfinder from './UserPathfinder';
import { CgPathTrim } from "react-icons/cg";
import { CgMenuGridR } from "react-icons/cg";
import { BsBookmarkHeart } from "react-icons/bs";
import UserWishlist from './UserWishlist';

  const menuItems = [
    { title: 'Dashboard', icon: <RxDashboard  /> },
    { title: 'Enrolls', icon: <PiNotePencilBold /> },
    { title: 'Wishlist', icon: <BsBookmarkHeart /> },
    { title: 'Order History', icon: <PiTrolleySuitcaseFill /> },
    // { title: 'Resume', icon: <FaIdCard /> },
    { title: 'Certificate', icon: <PiCertificateBold/> },
    // { title: 'Videos', icon: <MdOutlineVideoCameraFront /> },
    // { title: 'Messages', icon: <BsFillEnvelopeFill /> },
    { title: 'Applied Jobs', icon: <TbBriefcaseFilled /> },
    { title: 'Review', icon: <MdRateReview /> },
    { title: 'Pathfinder', icon: <CgPathTrim /> },
    { title: 'Settings', icon: <TbSettingsBolt /> },
  ];

const UserDashboard = () => {
  const { section } = useParams(); // Get section from URL params
  const initialCategory = section || localStorage.getItem('selectedCategory') || 'Dashboard';
  const initialIndex = menuItems.findIndex(item => item.title === initialCategory);

  // --- State variables ---
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Handle window resize for mobile view ---
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Sync active menu on refresh or URL param change ---
  useEffect(() => {
    const category = section || localStorage.getItem('selectedCategory') || 'Dashboard';
    setSelectedCategory(category);
    const index = menuItems.findIndex(item => item.title === category);
    setActiveIndex(index !== -1 ? index : 0);
  }, [section]);

  // --- Handle menu click ---
  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    setSelectedCategory(title);
    localStorage.setItem('selectedCategory', title); // Persist selection
    if (isMobileView) setIsSidebarOpen(false); // Close mobile sidebar on selection
  };

  // --- Toggle sidebar collapse ---
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderSelectedComponent = () => {
    switch (selectedCategory) {
      case 'Dashboard':
        return <UserDashboardCard />;
      case 'Order History':
        return <UserOrders />;
      case 'Certificate':
        return <Certificate />;
      case 'Enrolls':
        return <UserEnrolled />;
      case 'Wishlist':
        return <UserWishlist />;
      // case 'Messages':
      //   return <UserMessages />;
      case 'Applied Jobs':
        return <UserAppliedJobs />;
      case 'Review':
        return <UserReviews />;
      // case 'Videos':
      //   return <UserVideos />;
      // case 'Resume':
      case 'Pathfinder':
        return <UserPathfinder/>;
      //   return <UserResume />;
      case 'Settings':
        return <UserProfile />;
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
              <li key={index} className="menu-item-container">
                <button
                  onClick={() => handleMenuItemClick(index, item.title)}
                  className={`menu-item-user ${selectedCategory === item.title ? 'active' : ''}`}
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
