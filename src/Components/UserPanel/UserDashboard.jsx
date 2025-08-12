import { React, useState, useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Dashboard.css';
import { AiFillDashboard } from "react-icons/ai";
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
import UserCategoryTable from './UserCategoryTable';
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

  const menuItems = [
    // { title: 'Dashboard', icon: <AiFillDashboard /> },
    { title: 'Enrolls', icon: <PiNotePencilBold /> },
    // { title: 'Orders', icon: <PiTrolleySuitcaseFill /> },
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
  const { section } = useParams();
  const initialCategory = section || localStorage.getItem('selectedCategory') || 'Enrolls';
  const initialIndex = menuItems.findIndex(item => item.title === initialCategory);

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

useEffect(() => {
    if (section) {
      const foundIndex = menuItems.findIndex(item => item.title === section);
      if (foundIndex !== -1) {
        setSelectedCategory(section);
        setActiveIndex(foundIndex);
      }
    } else {
      const storedCategory = localStorage.getItem('selectedCategory');
      if (storedCategory) {
        setSelectedCategory(storedCategory);
        const foundIndex = menuItems.findIndex(item => item.title === storedCategory);
        if (foundIndex !== -1) {
          setActiveIndex(foundIndex);
        }
      }
    }
  }, [section]);

  const loginuserData = JSON.parse(localStorage.getItem('loginuserData'));
const email = loginuserData?.email || ''; 

  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    setSelectedCategory(title); 
    localStorage.setItem('selectedCategory', title);
    toggleDropdown(index);
  };

  const renderSelectedComponent = () => {
    switch (selectedCategory) {
      // case 'Dashboard':
      //   return <UserDashboardCard />;
      // case 'Orders':
      //   return <UserOrders />;
      case 'Certificate':
        return <Certificate />;
      case 'Enrolls':
        return <UserCategoryTable />;
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
        return <UserCategoryTable />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Topbar />
      <NavbarTop />

      <div className="user-dashboard-heading">
      <h3>Welcome {loginuserData?.name || 'User'}</h3>

      </div>
      <div className="user-dashboard">
        {/* Sidebar with collapse functionality */}
        <div className={`sidebar-user ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <BiArrowToRight /> : <BiArrowToLeft />}
          </button>
          <ul className="menu-list-user">
            {menuItems.map((item, index) => (
              <li key={index} className="menu-item-container">
                <button
                  onClick={() => handleMenuItemClick(index, item.title)}
                  className={`menu-item-user ${activeIndex === index ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

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